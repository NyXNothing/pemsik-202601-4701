import axios from "@/Utils/AxiosInstance";

export const getAllDosen = () => axios.get("/Dosen");
export const getDosen = (id) => axios.get(`/Dosen/${id}`);
export const storeDosen = (data) => axios.post("/Dosen", data);
export const updateDosen = (id, data) => axios.put(`/Dosen/${id}`, data);
export const deleteDosen = (id) => axios.delete(`/Dosen/${id}`);
