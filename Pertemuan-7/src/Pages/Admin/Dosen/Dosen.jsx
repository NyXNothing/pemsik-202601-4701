import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import DosenModal from "./DosenModal";
import DosenTable from "./DosenTable";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const emptyForm = { id: "", nidn: "", nama: "" };

const Dosen = () => {
  const { user } = useAuthStateContext();
  const [dosen, setDosen] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      setDosen(res.data);
    } catch (err) {
      toastError("Gagal mengambil data dosen");
    }
  };

  useEffect(() => {
    fetchDosen();
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

  const openEditModal = (dsn) => {
    setForm({ id: dsn.id, nidn: dsn.nidn, nama: dsn.nama });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nidn || !form.nama) {
      toastError("NIDN dan Nama wajib diisi");
      return;
    }

    if (isEdit) {
      confirmUpdate(async () => {
        try {
          await updateDosen(form.id, form);
          toastSuccess("Data dosen berhasil diperbarui");
          setForm(emptyForm);
          setIsEdit(false);
          setIsModalOpen(false);
          fetchDosen();
        } catch (err) {
          toastError("Gagal memperbarui data dosen");
        }
      });
    } else {
      const exists = dosen.find((d) => d.nidn === form.nidn);
      if (exists) {
        toastError("NIDN sudah terdaftar!");
        return;
      }

      try {
        await storeDosen(form);
        toastSuccess("Data dosen berhasil ditambahkan");
        setForm(emptyForm);
        setIsModalOpen(false);
        fetchDosen();
      } catch (err) {
        toastError("Gagal menambahkan data dosen");
      }
    }
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await deleteDosen(id);
        toastSuccess("Data dosen berhasil dihapus");
        fetchDosen();
      } catch (err) {
        toastError("Gagal menghapus data dosen");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Dosen
          </Heading>

          {user?.permission?.includes("dosen.create") && (
            <Button onClick={openAddModal}>+ Tambah Dosen</Button>
          )}
        </div>

        {user?.permission?.includes("dosen.read") && (
          <DosenTable
            data={dosen}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <DosenModal
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

export default Dosen;
