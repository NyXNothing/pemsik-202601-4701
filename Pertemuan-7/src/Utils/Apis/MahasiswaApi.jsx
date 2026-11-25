import axios from "@/Utils/AxiosInstance";


export const getAllMahasiswa = (params = {}) =>
    axios.get("/Mahasiswa", {params});

// Ambil 1 mahasiswa
export const getMahasiswa = (id) => axios.get(`/Mahasiswa/${id}`);

// Tambah mahasiswa
export const storeMahasiswa = (data) => axios.post("/Mahasiswa", data);

// Update mahasiswa
export const updateMahasiswa = (id, data) => axios.put(`/Mahasiswa/${id}`, data);

// Hapus mahasiswa
export const deleteMahasiswa = (id) => axios.delete(`/Mahasiswa/${id}`);


