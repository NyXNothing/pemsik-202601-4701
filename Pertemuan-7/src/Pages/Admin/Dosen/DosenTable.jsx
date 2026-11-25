import Button from "@/Pages/Admin/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const DosenTable = ({ data = [], onEdit, onDelete }) => {
  const { user } = useAuthStateContext();

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIDN</th>
          <th className="py-2 px-4 text-left">Nama Dosen</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((dsn, index) => (
          <tr key={dsn.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
            <td className="py-2 px-4">{dsn.nidn || dsn.nip || "-"}</td>
            <td className="py-2 px-4">{dsn.name || dsn.nama || "-"}</td>
            <td className="py-2 px-4 text-center space-x-2">
              {user?.permission?.includes("dosen.update") && (
                <Button size="sm" variant="warning" onClick={() => onEdit(dsn)}>
                  Edit
                </Button>
              )}
              {user?.permission?.includes("dosen.delete") && (
                <Button size="sm" variant="danger" onClick={() => onDelete(dsn.id)}>
                  Hapus
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DosenTable;
