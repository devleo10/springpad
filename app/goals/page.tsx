"use client";
import React from 'react';
import Link from 'next/link';
import Image from "next/image";

const goals = [
  { name: "Dream Home", path: "/goals/dream-home", image: "/goals/dream-home.png" },
  { name: "Wealth Creation", path: "/goals/wealth-creation", image: "/goals/wealth-creation.png" },
  { name: "Retirement", path: "/goals/retirement", image: "/goals/retirement.png" },
  { name: "Child's Education", path: "/goals/child-education", image: "/goals/child-education.png" },
  { name: "Child's Wedding", path: "/goals/child-wedding", image: "/goals/child-wedding.png" },
  { name: "Emergency", path: "/goals/emergency", image: "/goals/emergency.png" },
];

export default function GoalsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Financial Goals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {goals.map(goal => (
          <Link key={goal.name} href={goal.path} className="block border rounded-lg shadow hover:shadow-lg transition p-4 bg-white">
            <Image src={goal.image} alt={goal.name} width={320} height={160} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold text-center">{goal.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
