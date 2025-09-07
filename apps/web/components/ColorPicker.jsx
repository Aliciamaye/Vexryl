import React, { useState, useEffect, useRef } from "react";

const COLORS = [
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Green
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#111827", // Dark
  "#F3F4F6"  // Light
];

const ColorPicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleColorClick = (color) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="mb-4" ref={pickerRef}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          className="flex items-center w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-6 h-6 rounded mr-2"
            style={{ backgroundColor: value || COLORS[0] }}
          />
          <span>{value || "Select color"}</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-2">
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    color === value ? "ring-2 ring-purple-500 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
