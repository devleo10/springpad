"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 select-text ${className}`}
      style={{ userSelect: "text" }}
    />
  );
}
