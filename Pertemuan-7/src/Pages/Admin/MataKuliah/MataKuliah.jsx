import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MataKuliahModal from "./MataKuliahModal";
import MataKuliahTable from "./MataKuliahTable";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import {
  getAllMataKuliah,
  storeMataKuliah,
  updateMataKuliah,
  deleteMataKuliah,
} from "@/Utils/Apis/MataKuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const emptyForm = { id: "", kode: "", nama: "", sks: "" };

const MataKuliah = () => {
  const { user } = useAuthStateContext();
  const [mataKuliah, setMataKuliah] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchMataKuliah = async () => {
    try {
      const res = await getAllMataKuliah();
      setMataKuliah(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mata kuliah");
    }
  };

  useEffect(() => {
    fetchMataKuliah();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (mk) => {
    setForm({ id: mk.id, kode: mk.kode, nama: mk.nama, sks: mk.sks });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.kode || !form.nama || !form.sks) {
      toastError("Kode, Nama, dan SKS wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(async () => {
        try {
          await updateMataKuliah(form.id, form);
          toastSuccess("Mata kuliah berhasil diperbarui");
          setForm(emptyForm);
          setIsEdit(false);
          setIsModalOpen(false);
          fetchMataKuliah();
        } catch (err) {
          toastError("Gagal memperbarui mata kuliah");
        }
      });
    } else {
      const exists = mataKuliah.find((m) => m.kode === form.kode);
      if (exists) {
        toastError("Kode mata kuliah sudah terdaftar!");
        return;
      }

      try {
        await storeMataKuliah(form);
        toastSuccess("Mata kuliah berhasil ditambahkan");
        setForm(emptyForm);
        setIsModalOpen(false);
        fetchMataKuliah();
      } catch (err) {
        toastError("Gagal menambahkan mata kuliah");
      }
    }
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await deleteMataKuliah(id);
        toastSuccess("Mata kuliah berhasil dihapus");
        fetchMataKuliah();
      } catch (err) {
        toastError("Gagal menghapus mata kuliah");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mata Kuliah
          </Heading>

          {user?.permission?.includes("matakuliah.create") && (
            <Button onClick={openAddModal}>+ Tambah Mata Kuliah</Button>
          )}
        </div>

        {user?.permission?.includes("matakuliah.read") && (
          <MataKuliahTable
            data={mataKuliah}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <MataKuliahModal
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

export default MataKuliah;
