import { useNavigate } from "react-router-dom";
import Button from "@/Pages/Admin/Components/Button";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (nim) => {
    onDelete(nim);
  };

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {mahasiswa.map((mhs, index) => (
          <tr
            key={mhs.nim}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{mhs.nim}</td>
            <td className="py-2 px-4">{mhs.nama}</td>
            <td className="py-2 px-4 text-center space-x-2">
              <Button onClick={() => navigate(`/admin/mahasiswa/${mhs.nim}`)}>
                Detail
              </Button>
              <Button
                size="sm"
                variant="warning"
                onClick={() => openEditModal(mhs.nim)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(mhs.nim)}
              >
                Hapus
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
