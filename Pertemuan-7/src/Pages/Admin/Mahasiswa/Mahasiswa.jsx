import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

const emptyForm = { id: "", nim: "", name: "", max_sks: 0 };

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // ✅ Pindahkan state ke DALAM komponen Mahasiswa
  const [kelas, setKelas] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // ✅ Ambil data kelas & mata kuliah untuk hitung total SKS
  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        const [resKelas, resMk] = await Promise.all([
          getAllKelas(),
          getAllMataKuliah(),
        ]);
        setKelas(resKelas.data || []);
        setMataKuliah(resMk.data || []);
      } catch (err) {
        console.error("Gagal mengambil data kelas/mata kuliah:", err);
      }
    };
    fetchExtraData();
  }, []);

  const {
    data: result = { data: [], total: 0 },
    isLoading: isLoadingMahasiswa,
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const { data: mahasiswa = [] } = result;
  const totalCount = result.total;
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "max_sks" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setForm({ nim: "", name: "", max_sks: 0 });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setForm({
      id: mhs.id,
      nim: mhs.nim,
      name: mhs.name || mhs.nama,
      max_sks: mhs.max_sks || 0,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim || !form.name || !form.max_sks) {
      toastError("NIM, Nama, dan Max SKS wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(() => {
        update({ id: form.id, data: form });
        resetForm();
      });
    } else {
      const exists = mahasiswa.find((m) => m.nim === form.nim);
      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      store(form);
      resetForm();
    }
  };

  const getTotalSks = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>

          {user?.permission?.includes("mahasiswa.create") && (
            <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Cari nama/NIM..."
            className="border px-3 py-1 rounded flex-grow"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="name">Sort by Nama</option>
            <option value="nim">Sort by NIM</option>
            <option value="max_sks">Sort by Max SKS</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border px-3 py-1 rounded"
          >
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={25}>25 / halaman</option>
          </select>
        </div>

        {user?.permission?.includes("mahasiswa.read") && (
          <MahasiswaTable
            data={mahasiswa}
            onEdit={openEditModal}
            getTotalSks={getTotalSks}
            onDelete={handleDelete}
            onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
            isLoading={isLoadingMahasiswa}
          />
        )}

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={handlePrev}
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={handleNext}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </Card>

      <MahasiswaModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        form={form}
        onChange={handleChange}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Mahasiswa;
