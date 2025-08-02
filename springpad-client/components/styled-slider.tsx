import React, { forwardRef } from "react";

interface StyledSliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledSlider = forwardRef<HTMLInputElement, StyledSliderProps>(
  ({ min, max, step = 1, value, onChange, ...rest }, ref) => {
    // avoid division by zero
    const range = max - min;
    const percent = range > 0 ? Math.min(100, Math.max(0, ((value - min) / range) * 100)) : 0;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 appearance-none rounded-lg focus:outline-none"
            style={{
              background: `linear-gradient(to right, #fcd34d ${percent}%, #e5e7eb ${percent}%)`,
            }}
            {...rest}
          />
        </div>
        <style jsx>{`
          input[type="range"] {
            padding: 0;
            margin: 0;
            background: transparent;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ca8a04;
            border: 3px solid white;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            margin-top: -7px;
          }
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ca8a04;
            border: 3px solid white;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
            cursor: pointer;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            height: 8px;
            border-radius: 999px;
          }
          input[type="range"]::-moz-range-track {
            height: 8px;
            border-radius: 999px;
          }
        `}</style>
      </div>
    );
  }
);
StyledSlider.displayName = "StyledSlider";

export default StyledSlider;
