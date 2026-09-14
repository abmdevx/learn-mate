import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = forwardRef(
  (
    {
      type = "text",
      placeholder = "",
      required = false,
      isPassword = false,
      className = "",
      ...rest // will include name, onChange, onBlur, value, etc. from register
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
          {...rest} // ✅ spreads name, value, onChange, onBlur
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