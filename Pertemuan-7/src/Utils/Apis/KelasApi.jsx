import axios from "@/Utils/AxiosInstance";

// Ambil semua kelas
export const getAllKelas = () => axios.get("/Kelas");

// Ambil 1 kelas
export const getKelas = (id) => axios.get(`/Kelas/${id}`);

// Tambah kelas baru
export const storeKelas = (data) => axios.post("/Kelas", data);

// Update kelas
export const updateKelas = (id, data) => axios.put(`/Kelas/${id}`, data);

// Hapus kelas
export const deleteKelas = (id) => axios.delete(`/Kelas/${id}`);