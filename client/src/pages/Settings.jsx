import React, { useState, useEffect } from 'react';
import { Save, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

function Settings() {
  const { currentUser, logout } = useAuth();
  const { addNotification } = useNotifications();
  
  const [settings, setSettings] = useState({
    emailSync: {
      frequency: 'hourly',
      autoProcess: true
    },
    notifications: {
      email: true,
      browser: true,
      newInvoice: true,
      approvalRequired: true
    },
    display: {
      theme: 'light',
      resultsPerPage: 10
    }
  });
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleCheckboxChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };
  
  const handleSaveSettings = () => {
    localStorage.setItem('settings', JSON.stringify(settings));
    addNotification('Settings saved successfully!', 'success');
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-500">
            Manage your account and application preferences
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {/* Account Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {currentUser?.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Sync Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Email Sync Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sync-frequency" className="block text-sm font-medium text-gray-700">
                    Sync frequency
                  </label>
                  <select
                    id="sync-frequency"
                    name="sync-frequency"
                    value={settings.emailSync.frequency}
                    onChange={(e) => handleInputChange('emailSync', 'frequency', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="manual">Manual only</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="auto-process"
                    name="auto-process"
                    type="checkbox"
                    checked={settings.emailSync.autoProcess}
                    onChange={() => handleCheckboxChange('emailSync', 'autoProcess')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-process" className="ml-3 block text-sm font-medium text-gray-700">
                    Automatically process new invoices
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={() => handleCheckboxChange('notifications', 'email')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                    Email notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="browser-notifications"
                    name="browser-notifications"
                    type="checkbox"
                    checked={settings.notifications.browser}
                    onChange={() => handleCheckboxChange('notifications', 'browser')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="browser-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                    Browser notifications
                  </label>
                </div>
                
                <div className="pl-7 space-y-4 border-l-2 border-gray-100 ml-2">
                  <div className="flex items-center">
                    <input
                      id="new-invoice-notifications"
                      name="new-invoice-notifications"
                      type="checkbox"
                      checked={settings.notifications.newInvoice}
                      onChange={() => handleCheckboxChange('notifications', 'newInvoice')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="new-invoice-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                      New invoice received
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="approval-notifications"
                      name="approval-notifications"
                      type="checkbox"
                      checked={settings.notifications.approvalRequired}
                      onChange={() => handleCheckboxChange('notifications', 'approvalRequired')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="approval-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                      Approval required
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={settings.display.theme}
                    onChange={(e) => handleInputChange('display', 'theme', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="results-per-page" className="block text-sm font-medium text-gray-700">
                    Results per page
                  </label>
                  <select
                    id="results-per-page"
                    name="results-per-page"
                    value={settings.display.resultsPerPage}
                    onChange={(e) => handleInputChange('display', 'resultsPerPage', parseInt(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </button>
            
            <button
              type="button"
              onClick={handleSaveSettings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;