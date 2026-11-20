import axios from "@/Utils/AxiosInstance";

// Ambil semua mahasiswa
export const getAllMahasiswa = () => axios.get("/Mahasiswa");

// Ambil 1 mahasiswa
export const getMahasiswa = (id) => axios.get(`/Mahasiswa/${id}`);

// Tambah mahasiswa
export const storeMahasiswa = (data) => axios.post("/Mahasiswa", data);

// Update mahasiswa
export const updateMahasiswa = (id, data) => axios.put(`/Mahasiswa/${id}`, data);

// Hapus mahasiswa
export const deleteMahasiswa = (id) => axios.delete(`/Mahasiswa/${id}`);
