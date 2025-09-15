import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Sales-sync</h1>
          <p className="text-gray-600">Field sales operations management platform</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 w-full">
          <Outlet />
        </div>
        <div className="text-center mt-8 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sales-sync. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;