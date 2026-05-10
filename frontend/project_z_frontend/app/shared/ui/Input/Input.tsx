import React, { useId, useState, type ComponentProps } from "react";

interface InputProps
  extends Omit<ComponentProps<"input">, "onChange" | "onBlur"> {
  children?: string;
  name?: string;
  value: string | number;
  type?: React.HTMLInputTypeAttribute;
  pattern?: string;
  onChange: (value: string) => void;
  error?: string | boolean | null;
  isValid?: "valid" | "neutral" | "invalid";
  onBlur?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  children,
  name,
  value,
  type = "text",
  pattern,
  onChange,
  onBlur,
  error,
  isValid = "neutral",
  ...props
}) => {
  const id = useId();

  const isError = error || isValid === "invalid";
  const isSuccess = isValid === "valid";

  const getBorderColor = () => {
    if (isError) return "border-danger text-danger focus:border-danger-hover";
    if (isSuccess) return "border-success text-success focus:border-success";
    return "border-border focus:border-primary";
  };

  const getLabelColor = () => {
    if (isError) return "text-danger peer-focus:text-danger-hover";
    if (isSuccess) return "text-success peer-focus:text-success";
    return "text-foreground-muted peer-focus:text-primary";
  };

  return (
    <div className="relative">
      <input
        id={id}
        className={`peer p-3 focus:ring-0 border rounded-md w-full placeholder:text-sm placeholder:text-foreground-muted focus:outline-0 ${getBorderColor()}`}
        type={type}
        name={name}
        placeholder={children}
        pattern={pattern}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          if (onBlur) onBlur(e.target.value);
        }}
        {...props}
      />
      <label
        htmlFor={id}
        className={`block peer-placeholder-shown:hidden absolute text-xs -top-2 left-4 bg-background px-2 ${getLabelColor()}`}
      >
        {name}
      </label>

      {isError && (
        <p className="text-danger w-full px-4 my-1 text-sm ">
          {typeof error === "string" ? error : "Invalid format"}
        </p>
      )}
    </div>
  );
};

export default Input;
