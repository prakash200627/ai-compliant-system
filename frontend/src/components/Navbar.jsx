import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-lg font-bold text-indigo-600 tracking-tight">
                ComplaintDesk
              </Link>
            </div>
            
            {/* Navigation links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive('/') && location.pathname === '/'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              
              <Link
                to="/complaints"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                  isActive('/complaints')
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                My Complaints
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150 ${
                    isActive('/admin')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          
          {/* User Email & Logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            )}
            
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation links */}
      <div className="sm:hidden border-t border-gray-200 bg-gray-50 px-4 py-2 flex justify-around">
        <Link
          to="/"
          className={`text-xs font-semibold px-2 py-1 rounded ${
            location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/complaints"
          className={`text-xs font-semibold px-2 py-1 rounded ${
            location.pathname.startsWith('/complaints') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
          }`}
        >
          My Complaints
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className={`text-xs font-semibold px-2 py-1 rounded ${
              location.pathname.startsWith('/admin') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
            }`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
