import { useState, useEffect } from "react";
import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";
import Button from "@/Pages/Admin/Components/Button";
import UserModal from "./UserModal";
import { getAllUsers, updateUser } from "@/Utils/Apis/UserApi";
import { confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const User = () => {
  const { user: currentUser, setUser: setCurrentUser } = useAuthStateContext();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toastError("Gagal mengambil data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (targetUser) => {
    setForm({
      ...targetUser,
      permission: targetUser.permission || [],
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (e) => {
    setForm((prev) => ({ ...prev, role: e.target.value }));
  };

  const handlePermissionToggle = (perm) => {
    setForm((prev) => {
      const exists = prev.permission.includes(perm);
      const updatedPermissions = exists
        ? prev.permission.filter((p) => p !== perm)
        : [...prev.permission, perm];
      return { ...prev, permission: updatedPermissions };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    confirmUpdate(async () => {
      try {
        await updateUser(form.id, form);
        toastSuccess("Role & Permission berhasil diperbarui");

        // Jika admin mengedit akunnya sendiri, langsung perbarui session context
        if (currentUser?.id === form.id) {
          setCurrentUser(form);
        }

        setIsModalOpen(false);
        fetchUsers();
      } catch (err) {
        toastError("Gagal memperbarui user");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2" className="mb-0 text-left">
            Manajemen Role & Permission User
          </Heading>
        </div>

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Jumlah Permission</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4 capitalize font-semibold">{u.role}</td>
                <td className="py-2 px-4">{u.permission?.length || 0} akses</td>
                <td className="py-2 px-4 text-center">
                  {currentUser?.permission?.includes("user.update") && (
                    <Button size="sm" variant="warning" onClick={() => openEditModal(u)}>
                      Ubah Role & Permission
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <UserModal
        isOpen={isModalOpen}
        form={form}
        onRoleChange={handleRoleChange}
        onPermissionToggle={handlePermissionToggle}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default User;
