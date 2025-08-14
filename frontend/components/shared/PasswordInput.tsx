"use client";

import { FormEvent, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const PasswordInput = ({
  className,
  onChangeCapture,
  placeholder = "",
  props,
}: {
  className?: string;
  onChangeCapture?: (event: FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  props: InputHTMLAttributes<HTMLInputElement>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={cn("relative inline-block w-full", className)}>
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className="pe-14 text-base"
        onChangeCapture={onChangeCapture}
        placeholder={placeholder}
        autoComplete="password"
      />
      <div
        className="absolute top-2 right-2 material-symbols-outlined fillhover cursor-pointer text-contrast-semidark"
        onClick={() => {
          setShowPassword((showPassword) => !showPassword);
        }}
      >
        {showPassword ? "visibility_off" : "visibility"}
      </div>
    </div>
  );
};

export default PasswordInput;
