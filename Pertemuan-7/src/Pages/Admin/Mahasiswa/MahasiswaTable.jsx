import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MahasiswaTable = ({ data = [], onEdit, onDelete, onDetail, getTotalSks }) => {

  const { user } = useAuthStateContext();
  // ✅ Pastikan rows selalu berbentuk array agar .map() tidak pernah error
  const rows = Array.isArray(data) ? data : [];

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Aksi</th>
          <th className="py-2 px-4 text-center">Max SKS</th>
          <th className="py-2 px-4 text-center">SKS Terpakai</th>
        </tr>
      </thead>
      <tbody>
{data.map((mhs, index) => {
    const totalSks = getTotalSks(mhs.id);
    
    return (
      <tr key={mhs.nim} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
        <td className="py-2 px-4">{mhs.nim}</td>
        <td className="py-2 px-4">{mhs.name}</td>
        <td className="py-2 px-4 text-center">{mhs.max_sks || "-"}</td>
        <td className="py-2 px-4 text-center">{totalSks}</td>
        <td className="py-2 px-4 text-center space-x-2">
          <Button onClick={() => onDetail(mhs.id)}>Detail</Button>
          {user.permission.includes("mahasiswa.update") && (
          <Button size="sm" variant="warning" onClick={() => onEdit(mhs)}>
            Edit
          </Button>
          )}

          {user.permission.includes("mahasiswa.delete") && (
          <Button size="sm" variant="danger" onClick={() => onDelete(mhs.id)}>
            Hapus
          </Button>
          )}
        </td>
      </tr>
    );
  })}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
