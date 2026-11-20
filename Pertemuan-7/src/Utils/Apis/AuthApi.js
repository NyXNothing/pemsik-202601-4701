import axios from "@/Utils/AxiosInstance";

export const login = async ( email, password ) => {
    const res = await axios.get("/user", { params: { email } });
    const user = res.data[0];

    if (!user) throw new Error("Email tidak ditemukan");
    if (user.password !== password) throw new Error("Password salah");

    return user;
};

export const register = async (userData) => {
  // Cek apakah email sudah dipakai
  const check = await axios.get("/user", { params: { email: userData.email } });
  if (check.data.length > 0) {
    throw new Error("Email sudah terdaftar!");
  }

  // Simpan user baru dengan role & permission default
  const newUser = {
    ...userData,
    role: "mahasiswa",
    permission: [
      "dashboard.page",
      "mahasiswa.page",
      "mahasiswa.read",
      "dosen.page",
      "dosen.read",
      "matakuliah.page",
      "matakuliah.read"
    ],
  };

  const res = await axios.post("/user", newUser);
  return res.data;
};
