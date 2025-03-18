import React from 'react';
import { Button as ShadButton } from '@/components/ui/button';
import "../styles/App.css";

const Button = ({ onClick, children }) => {
  return (
    <ShadButton
      onClick={onClick}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
    >
      {children}
    </ShadButton>
  );
};

export default Button;
