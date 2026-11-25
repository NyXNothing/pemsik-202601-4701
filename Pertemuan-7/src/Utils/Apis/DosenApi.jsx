import axios from "@/Utils/AxiosInstance";

// Ambil semua dosen
export const getAllDosen = () => axios.get("/Dosen");

// Ambil 1 dosen
export const getDosen = (id) => axios.get(`/Dosen/${id}`);

// Tambah dosen
export const storeDosen = (data) => axios.post("/Dosen", data);

// Update dosen
export const updateDosen = (id, data) => axios.put(`/Dosen/${id}`, data);

// Hapus dosen
export const deleteDosen = (id) => axios.delete(`/Dosen/${id}`);