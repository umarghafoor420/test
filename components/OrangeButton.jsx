import React from 'react';

const OrangeButton = ({ children, onClick, disabled, className = '', type = 'button', ...props }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      bg-orange-600
      text-white
      font-semibold
      rounded-full
      shadow-md
      px-6
      py-2.5
      transition
      duration-200
      ease-in-out
      hover:bg-orange-700
      focus:outline-none
      focus:ring-2
      focus:ring-orange-400
      focus:ring-offset-2
      disabled:opacity-60
      disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export default OrangeButton;
