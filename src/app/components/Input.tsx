interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, type = "text" }) => {
  return (
    <div className="mb-4">
      <label className="block text-[#22ec8a] text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#777] p-2 rounded focus:border-[#22ec8a] transition-colors duration-200 outline-none"
      />
    </div>
  );
};

export default Input;
