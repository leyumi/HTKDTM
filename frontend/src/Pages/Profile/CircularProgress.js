import React from 'react';

const CircularProgress = ({ value, maxValue, label, color }) => {
  const percentage = (value / maxValue) * 100;
  const strokeDasharray = `${percentage}, 100`;

  return (
    <div className="flex flex-col items-center">
      <svg className="w-32 h-32" viewBox="0 0 36 36">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="2"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
        <text x="18" y="20" textAnchor="middle" fontSize="8" fill="#333">
          {value}/{maxValue}
        </text>
      </svg>
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">{label}</span>
      </div>
    </div>
  );
};

export default CircularProgress;

