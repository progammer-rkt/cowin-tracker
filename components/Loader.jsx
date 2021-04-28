import React from 'react';

function Loader() {
  return (
    <div
      style={{ top: '-1rem !important'}}
      className="absolute left-0 flex items-center justify-center w-full h-full mt-0 mb-0 bg-gray-700 border-black rounded-md opacity-80"
    >
      <svg
        className="w-12 h-12 text-white animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
  );
}

export default Loader;
