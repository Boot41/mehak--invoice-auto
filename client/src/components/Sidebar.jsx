import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  Mail, 
  FileText, 
  Settings, 
  LogOut,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">InvoiceAuto</h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/processed" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <FileCheck className="mr-3 h-5 w-5" />
            Processed Invoices
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;