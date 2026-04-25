"use client";

import { useState } from "react";

const SliderSizes = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value || [0, 90000]);

  const handleChange = (e, index) => {
    const newValue = [...localValue];
    newValue[index] = Number(e.target.value);
    setLocalValue(newValue);
    if (onChange) onChange(e, newValue);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Slider Track */}
      <div className="relative w-full h-2 bg-gray-300 rounded-full">
        {/* Active Range */}
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{
            left: `${(localValue[0] / 90000) * 100}%`,
            width: `${((localValue[1] - localValue[0]) / 90000) * 100}%`,
          }}
        />
      </div>

      {/* Inputs / Handles */}
      <div className="flex justify-between">
        <input
          type="range"
          min={0}
          max={90000}
          value={localValue[0]}
          onChange={(e) => handleChange(e, 0)}
          className="w-full appearance-none bg-transparent pointer-events-auto relative z-10"
          style={{
            WebkitAppearance: "none",
          }}
        />
        <input
          type="range"
          min={0}
          max={90000}
          value={localValue[1]}
          onChange={(e) => handleChange(e, 1)}
          className="w-full appearance-none bg-transparent pointer-events-auto relative z-10"
          style={{
            WebkitAppearance: "none",
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-sm font-semibold text-gray-700">
        <span>₹{localValue[0]}</span>
        <span>₹{localValue[1]}</span>
      </div>
    </div>
  );
};

export default SliderSizes;
