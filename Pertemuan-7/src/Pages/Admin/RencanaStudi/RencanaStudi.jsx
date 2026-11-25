import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  getAllKelas,
  storeKelas,
  updateKelas,
  deleteKelas,
} from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [resKelas, resDosen, resMahasiswa, resMataKuliah] =
        await Promise.all([
          getAllKelas(),
          getAllDosen(),
          getAllMahasiswa(),
          getAllMataKuliah(),
        ]);
      setKelas(resKelas.data || []);
      setDosen(resDosen.data || []);
      setMahasiswa(resMahasiswa.data || []);
      setMataKuliah(resMataKuliah.data || []);
    } catch (err) {
      toastError("Gagal mengambil data rencana studi");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const mataKuliahSudahDipakai = kelas.map((k) => k.mata_kuliah_id);
  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (m) => !mataKuliahSudahDipakai.includes(m.id)
  );

  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.max_sks || 0;

  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    if (!mhsId) {
      toastError("Pilih mahasiswa terlebih dahulu");
      return;
    }

    const matkul = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id);
    const sks = Number(matkul?.sks || 0);

    const totalSksMahasiswa = kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => Number(mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0))
      .reduce((acc, curr) => acc + curr, 0);

    const maxSks = getMaxSks(mhsId);

    if (maxSks > 0 && totalSksMahasiswa + sks > maxSks) {
      toastError(`SKS melebihi batas maksimal (${maxSks})`);
      return;
    }

    if (kelasItem.mahasiswa_ids?.includes(mhsId)) {
      toastError("Mahasiswa sudah terdaftar");
      return;
    }

    const updated = {
      ...kelasItem,
      mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), mhsId],
    };

    await updateKelas(kelasItem.id, updated);
    toastSuccess("Mahasiswa ditambahkan");
    setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
    fetchData();
  };

  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    const updated = {
      ...kelasItem,
      mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter((id) => id !== mhsId),
    };

    await updateKelas(kelasItem.id, updated);
    toastSuccess("Mahasiswa dihapus");
    fetchData();
  };

  const handleChangeDosen = async (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    if (!dsnId) {
      toastError("Pilih dosen terlebih dahulu");
      return;
    }

    const matkul = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id);
    const sks = Number(matkul?.sks || 0);

    const totalSksDosen = kelas
      .filter((k) => k.dosen_id === dsnId && k.id !== kelasItem.id)
      .map((k) =>
        Number(mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      )
      .reduce((acc, curr) => acc + curr, 0);

    const maxSksDosen = getDosenMaxSks(dsnId);

    if (maxSksDosen > 0 && totalSksDosen + sks > maxSksDosen) {
      toastError(`SKS dosen melebihi batas maksimal (${maxSksDosen})`);
      return;
    }

    const updated = {
      ...kelasItem,
      dosen_id: dsnId,
    };

    await updateKelas(kelasItem.id, updated);
    toastSuccess("Dosen pengampu diperbarui");
    setSelectedDsn((prev) => ({ ...prev, [kelasItem.id]: "" }));
    fetchData();
  };


  const handleDeleteKelas = async (kelasId) => {
    confirmDelete(async () => {
      await deleteKelas(kelasId);
      toastSuccess("Kelas dihapus");
      fetchData();
    });
  };

  const openAddModal = () => {
    setForm({ mata_kuliah_id: "", dosen_id: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Form tidak lengkap");
      return;
    }
    await storeKelas({ ...form, mahasiswa_ids: [] });
    setIsModalOpen(false);
    toastSuccess("Kelas ditambahkan");
    fetchData();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Rencana Studi
          </Heading>
          {user?.permission?.includes("rencana-studi.create") && (
            <Button onClick={openAddModal}>+ Tambah Kelas</Button>
          )}
        </div>

        {user?.permission?.includes("rencana-studi.read") && (
          <TableRencanaStudi
            kelas={kelas}
            mahasiswa={mahasiswa}
            dosen={dosen}
            mataKuliah={mataKuliah}
            selectedMhs={selectedMhs}
            setSelectedMhs={setSelectedMhs}
            selectedDsn={selectedDsn}
            setSelectedDsn={setSelectedDsn}
            handleAddMahasiswa={handleAddMahasiswa}
            handleDeleteMahasiswa={handleDeleteMahasiswa}
            handleChangeDosen={handleChangeDosen}
            handleDeleteKelas={handleDeleteKelas}
          />
        )}
      </Card>

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={handleChange}
        onSubmit={handleSubmit}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliahBelumAdaKelas}
      />
    </>
  );
};

export default RencanaStudi;
