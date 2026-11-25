import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

const emptyForm = { id: "", nim: "", nama: "" };

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // Ambil data & mutasi dari React Query Hooks
  const { data: mahasiswa = [] } = useMahasiswa();
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setIsModalOpen(false);
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setForm({ id: mhs.id, nim: mhs.nim, nama: mhs.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      toastError("NIM dan Nama wajib diisi");
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

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

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

        {user?.permission?.includes("mahasiswa.read") && (
          <MahasiswaTable
            data={mahasiswa}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onDetail={(id) => navigate(`/admin/mahasiswa/${id}`)}
          />
        )}
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
