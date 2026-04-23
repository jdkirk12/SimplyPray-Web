import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-[10px] rounded-[10px] border bg-white
            text-ink placeholder:text-ink-soft font-sans text-sm
            focus:outline-none focus:border-primary-500
            transition-colors duration-200
            ${error ? "border-danger" : "border-sanctuary-hairline"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
