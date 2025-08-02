"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardContent({ children, className = "", ...rest }: CardContentProps) {
  return (
    <div className={`flex flex-col gap-4 p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Attach CardContent as a static property of Card
Card.Content = CardContent;
