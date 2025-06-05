interface ProfileFieldProps {
  label?: string; // Opcional para que puedas pasar undefined sin error
  value?: string; // Opcional para que puedas pasar undefined sin error
}

// Componente reutilizable para mostrar campos
const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#22ec8a] mb-1">{label}</label>
      <p className="text-white border border-gray-700 rounded p-2 whitespace-pre-wrap break-words">{value || "—"}</p>
    </div>
  );
}

export default ProfileField;