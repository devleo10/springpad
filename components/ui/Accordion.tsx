"use client";

import React, { useState } from "react";

export function Accordion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
}

export function AccordionItem({ value, title, children }: { value: string; title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-yellow-500 rounded-md">
      <button
        className="w-full text-left px-4 py-2 font-semibold bg-yellow-100 hover:bg-yellow-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
      {isOpen && <div className="p-4 bg-yellow-50 text-sm">{children}</div>}
    </div>
  );
}