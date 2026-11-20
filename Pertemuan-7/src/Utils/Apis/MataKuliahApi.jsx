import axios from "@/Utils/AxiosInstance";

export const getAllMataKuliah = () => axios.get("/MataKuliah");
export const getMataKuliah = (id) => axios.get(`/MataKuliah/${id}`);
export const storeMataKuliah = (data) => axios.post("/MataKuliah", data);
export const updateMataKuliah = (id, data) => axios.put(`/MataKuliah/${id}`, data);
export const deleteMataKuliah = (id) => axios.delete(`/MataKuliah/${id}`);
