import Swal from "sweetalert2";

export const confirmAction = async ({
  title = "Apakah Anda yakin?",
  text = "Tindakan ini tidak dapat dibatalkan!",
  confirmButtonText = "Ya, Lanjutkan!",
  cancelButtonText = "Batal",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};
