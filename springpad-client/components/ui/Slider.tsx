"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import React from "react";

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onValueChange,
  className = "",
}: {
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange: (val: number[]) => void;
  className?: string;
}) {
  return (
    <RadixSlider.Root
      className={`relative flex items-center select-none touch-none w-full h-5 ${className}`}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onValueChange}
    >
      <RadixSlider.Track className="bg-yellow-200 relative grow rounded-full h-[4px]">
        <RadixSlider.Range className="absolute bg-yellow-500 rounded-full h-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block w-4 h-4 bg-yellow-500 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400" />
    </RadixSlider.Root>
  );
}