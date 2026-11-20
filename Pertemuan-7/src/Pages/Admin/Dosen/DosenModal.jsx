import Button from "@/Pages/Admin/Components/Button";

const DosenModal = ({ isOpen, isEdit, form, onChange, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          {isEdit ? "Edit Data Dosen" : "Tambah Data Dosen"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIDN</label>
            <input
              type="text"
              name="nidn"
              value={form.nidn}
              onChange={onChange}
              placeholder="Masukkan NIDN"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Dosen</label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={onChange}
              placeholder="Masukkan nama dosen"
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DosenModal;
