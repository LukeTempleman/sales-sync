import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const AuthLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 relative">
          <button
            onClick={toggleTheme}
            className="absolute right-0 top-0 p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <h1 className="text-3xl font-bold text-primary">Sales-sync</h1>
          <p className="text-muted-foreground">Field sales operations management platform</p>
        </div>
        <div className="bg-card rounded-lg shadow-lg p-6 w-full">
          <Outlet />
        </div>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sales-sync. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;