import { useNavigate } from "react-router-dom";
import Button from "@/Pages/Admin/Components/Button";
import { confirmAction } from "@/Helpers/SwalHelper";
import { showSuccess } from "@/Helpers/ToastHelper";

const Header = () => {
  const navigate = useNavigate();

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = async () => {
    const isConfirmed = await confirmAction({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    });

    if (isConfirmed) {
      localStorage.removeItem("user");
      showSuccess("Berhasil logout!");
      navigate("/");
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">Mahasiswa</h1>
        <div className="relative">
          <Button
            onClick={toggleProfileMenu}
            className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"
          />
          <div
            id="profileMenu"
            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden"
          >
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
