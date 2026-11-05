import { useState, forwardRef, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      type = "text",
      placeholder = "",
      required = false,
      isPassword = false,
      className = "",
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className="relative w-full">
        <input
          ref={ref} // ✅ now RHF can control it
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          required={required}
          className={`${className} w-full px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none text-sm`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }
);

export default InputField;