import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";
import { mahasiswaList } from "@/Data/Dummy";
import { confirmAction } from "@/Helpers/SwalHelper";
import { showSuccess, showError } from "@/Helpers/ToastHelper";

const Mahasiswa = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMahasiswa = async () => {
    setMahasiswa(mahasiswaList);
  };

  useEffect(() => {
    setTimeout(() => fetchMahasiswa(), 500);
  }, []);

  const storeMahasiswa = (newData) => {
    setMahasiswa([...mahasiswa, newData]);
  };

  const updateMahasiswa = (nim, newData) => {
    const updated = mahasiswa.map((mhs) =>
      mhs.nim === nim ? { ...mhs, ...newData } : mhs
    );
    setMahasiswa(updated);
  };

  const deleteMahasiswa = (nim) => {
    const filtered = mahasiswa.filter((mhs) => mhs.nim !== nim);
    setMahasiswa(filtered);
  };

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (nim) => {
    const mhs = mahasiswa.find((item) => item.nim === nim);
    setSelectedMahasiswa(mhs);
    setIsModalOpen(true);
  };

  const handleSubmit = async (form) => {
    if (selectedMahasiswa) {
      const isConfirmed = await confirmAction({
        title: "Konfirmasi Update",
        text: `Yakin ingin menyimpan perubahan data ${form.nama}?`,
        confirmButtonText: "Ya, Simpan",
      });

      if (isConfirmed) {
        updateMahasiswa(selectedMahasiswa.nim, form);
        showSuccess("Data berhasil diperbarui!");
        return true;
      } else {
        showError("Perubahan data dibatalkan!");
        return false;
      }
    } else {
      const isDuplicate = mahasiswa.some(
        (mhs) => String(mhs.nim) === String(form.nim.trim())
      );

      if (isDuplicate) {
        showError("NIM sudah terdaftar! Gunakan NIM yang berbeda.");
        return false;
      }

      storeMahasiswa({ ...form, status: true });
      showSuccess("Data berhasil ditambahkan!");
      return true;
    }
  };

  const handleDelete = async (nim) => {
    const isConfirmed = await confirmAction({
      title: "Konfirmasi Hapus",
      text: `Yakin ingin menghapus mahasiswa dengan NIM ${nim}?`,
      confirmButtonText: "Ya, Hapus",
    });

    if (isConfirmed) {
      deleteMahasiswa(nim);
      showSuccess("Data berhasil dihapus!");
    } else {
      showError("Penghapusan data dibatalkan!");
    }
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Daftar Mahasiswa
          </Heading>

          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        </div>

        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      </Card>

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </>
  );
};

export default Mahasiswa;
