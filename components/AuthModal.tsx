"use client";
import React from "react";
import { Card } from "./ui/Card";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";

export default function AuthModal({ open, onClose, mode, setMode }: {
  open: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-auto animate-modal-pop">
        <Card className="p-0 overflow-hidden rounded-2xl shadow-2xl border-0">
          <div className="flex justify-between items-center border-b px-6 py-3 bg-gradient-to-r from-[#fffbe6] to-[#fff]">
            <div className="flex gap-2">
              <button
                className={`font-semibold px-4 py-2 rounded-xl transition-all duration-150 ${mode === 'login' ? 'bg-[#ffb400]/20 text-[#ff8c00] shadow' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                className={`font-semibold px-4 py-2 rounded-xl transition-all duration-150 ${mode === 'signup' ? 'bg-[#ffb400]/20 text-[#ff8c00] shadow' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setMode('signup')}
              >
                Sign Up
              </button>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-2xl text-gray-400 hover:text-[#ff8c00] focus:outline-none">
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
          <div className="p-4 sm:p-6 bg-white">
            {mode === 'login' ? <LoginPage hideLogo /> : <SignupPage hideLogo />}
          </div>
        </Card>
      </div>
      <style jsx global>{`
        .animate-fade-in { animation: fadeInBg 0.25s; }
        .animate-modal-pop { animation: modalPop 0.25s cubic-bezier(.4,2,.6,1); }
        @keyframes fadeInBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.95) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}</style>
    </div>
  );
}
