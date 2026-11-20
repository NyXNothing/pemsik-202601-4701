import Button from "@/Pages/Admin/Components/Button";

const ALL_PERMISSIONS = [
  "dashboard.page",
  "mahasiswa.page", "mahasiswa.create", "mahasiswa.read", "mahasiswa.update", "mahasiswa.delete",
  "dosen.page", "dosen.create", "dosen.read", "dosen.update", "dosen.delete",
  "matakuliah.page", "matakuliah.create", "matakuliah.read", "matakuliah.update", "matakuliah.delete",
  "user.page", "user.update",
];

const UserModal = ({ isOpen, form, onRoleChange, onPermissionToggle, onClose, onSubmit }) => {
  if (!isOpen || !form) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Edit Role & Permission ({form.email})
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Pilih Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={onRoleChange}
              className="w-full border rounded px-3 py-2 bg-white"
            >
              <option value="admin">admin</option>
              <option value="mahasiswa">mahasiswa</option>
            </select>
          </div>

          {/* Centang Permission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permission (Hak Akses)
            </label>
            <div className="grid grid-cols-2 gap-2 border rounded p-3 bg-gray-50 max-h-60 overflow-y-auto">
              {ALL_PERMISSIONS.map((perm) => (
                <label key={perm} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.permission?.includes(perm) || false}
                    onChange={() => onPermissionToggle(perm)}
                    className="rounded text-blue-600"
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
