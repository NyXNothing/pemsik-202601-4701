import axios from "@/Utils/AxiosInstance";

// Ambil semua mata kuliah
export const getAllMataKuliah = () => axios.get("/MataKuliah");

// Ambil satu mata kuliah
export const getMataKuliah = (id) => axios.get(`/MataKuliah/${id}`);

// Tambah mata kuliah
export const storeMataKuliah = (data) => axios.post("/MataKuliah", data);

// Update mata kuliah
export const updateMataKuliah = (id, data) => axios.put(`/MataKuliah/${id}`, data);

// Hapus mata kuliah
export const deleteMataKuliah = (id) => axios.delete(`/MataKuliah   /${id}`);