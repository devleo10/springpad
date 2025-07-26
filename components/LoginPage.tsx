"use client";
import React, { useState } from "react";
import { LoginModal } from "./LoginModal";

export default function LoginPage() {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginModal open={open} onClose={() => setOpen(false)} />
      {!open && (
        <button
          className="mt-8 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] rounded-lg font-semibold shadow"
          onClick={() => setOpen(true)}
        >
          Open Login Modal
        </button>
      )}
    </div>
  );
}
