import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Code2, Globe, ChevronLeft, ChevronRight, RotateCw, X, Minus, Square, XCircle, Users, FileText, DollarSign, Clock, ChartBar, Bell, Settings, Calendar, Lock, Key, Ghost, Home } from 'lucide-react';

interface AuthorizationChallengeProps {
  onSuccess: () => void;
}

const PopupMessage: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    onClick={onClose}
  >
    <div 
      className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all duration-300 scale-100 animate-bounce"
      onClick={e => e.stopPropagation()}
    >
      <p className="text-lg text-center font-medium text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="mt-4 w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
      >
        Ok, got it! 😅
      </button>
    </div>
  </div>
);

const SimulatedNotFound: React.FC<{ onNavigate: (url: string) => void }> = ({ onNavigate }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: Math.max(0, Math.min(90, prev.x + (Math.random() - 0.5) * 20)),
        y: Math.max(0, Math.min(90, prev.y + (Math.random() - 0.5) * 20))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGhostClick = () => {
    setScore(prev => prev + 1);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1000);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-purple-100 to-pink-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-9xl font-bold text-purple-600 mb-4 animate-bounce">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Oops! Page not found</p>
        
        <div className="relative h-64 bg-white rounded-lg shadow-xl mb-8 overflow-hidden">
          <div 
            className="absolute transition-all duration-300 cursor-pointer"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            onClick={handleGhostClick}
          >
            <Ghost 
              className="h-12 w-12 text-purple-500 hover:text-purple-600 transform hover:scale-110 transition-transform"
              style={{ transform: `rotate(${Math.sin(Date.now() / 1000) * 20}deg)` }}
            />
          </div>
          
          {showMessage && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-purple-600 animate-ping">
              +1
            </div>
          )}
          
          <div className="absolute bottom-4 right-4 bg-purple-100 px-3 py-1 rounded-full">
            Score: {score}
          </div>
          
          <p className="absolute top-4 left-4 text-gray-500">
            Catch the ghost! 👻
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-lg">
            The page you're looking for might have moved to another dimension...
          </p>
          
          <button
            onClick={() => onNavigate('https://entreprise.locale/dashboard')}
            className="mt-6 inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {score > 0 && (
          <div className="mt-8 text-gray-600 italic">
            {score === 1 && "Nice catch! But can you catch more? 🎯"}
            {score >= 5 && score < 10 && "You're getting good at this! 🌟"}
            {score >= 10 && "Ghost hunter extraordinaire! 👑"}
          </div>
        )}
      </div>
    </div>
  );
};

export const AuthorizationChallenge: React.FC<AuthorizationChallengeProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState('https://entreprise.locale/dashboard');
  const [showInspector, setShowInspector] = useState(false);
  const [inspectorText, setInspectorText] = useState('<button id="adminButton" disabled="true" class="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">\n  Admin Access\n</button>');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [show404, setShow404] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url === 'https://entreprise.locale/admin') {
      setShowAdminPage(true);
      setShow404(false);
      setError(null);
      setUrl('https://entreprise.locale/admin');
    } else if (url === 'https://entreprise.locale/dashboard') {
      setShowAdminPage(false);
      setShow404(false);
      setError(null);
      setUrl('https://entreprise.locale/dashboard');
    } else {
      setError('Page not found');
      setShowAdminPage(false);
      setShow404(true);
      setUrl(url);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent real context menu
    const target = e.target as HTMLElement;
    if (target.id === 'adminButton') {
      setShowInspector(true);
    }
  };

  const handleInspectorSubmit = () => {
    if (inspectorText.includes('disabled="false"')) {
      setIsButtonEnabled(true);
    }
    setShowInspector(false);
  };

  const handleAdminClick = () => {
    if (isButtonEnabled) {
      setShowAdminPage(true);
      setUrl('https://entreprise.locale/admin');
    }
  };

  const handleExitAdmin = () => {
    setShowAdminPage(false);
    setUrl('https://entreprise.locale/dashboard');
    setIsButtonEnabled(false);
    setInspectorText('<button id="adminButton" disabled="true" class="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">\n  Admin Access\n</button>');
  };

  const getAdminContent = () => (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-red-600">Admin Control Panel</h2>
          <p className="text-gray-600">⚠️ Restricted Access Area</p>
        </div>
        <button
          onClick={() => {
            handleExitAdmin();
            
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* Sensitive Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Management</h3>
          <div className="space-y-3">
            <button 
              onClick={onSuccess}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between"
            >
              <span>Reset All User Passwords</span>
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={onSuccess}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between"
            >
              <span>Grant Super Admin Rights</span>
              <Shield className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={onSuccess}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between"
            >
              <span>View All User Data</span>
              <Users className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Configuration</h3>
          <div className="space-y-3">
            <button 
              onClick={onSuccess}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between"
            >
              <span>Database Connection Settings</span>
              <FileText className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={onSuccess}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between"
            >
              <span>Security Protocols Override</span>
              <Lock className="h-5 w-5 text-gray-500" />
            </button>
            <button 
              onClick={onSuccess}
              className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded flex items-center justify-between"
            >
              <span>API Keys Management</span>
              <Key className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Sensitive Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Logs</h3>
          <div className="space-y-2 text-sm">
            {[
              { time: '2024-03-15 14:23', event: 'Failed login attempt - IP: 192.168.1.105' },
              { time: '2024-03-15 14:20', event: 'Database backup initiated' },
              { time: '2024-03-15 14:15', event: 'Firewall rules updated' },
              { time: '2024-03-15 14:10', event: 'New admin user created: superadmin2' },
            ].map((log, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded">
                <p className="text-red-600 font-mono">{log.time}</p>
                <p className="text-gray-700">{log.event}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-2 border-red-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sensitive Data</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-semibold text-gray-700">Database Credentials</p>
              <p className="font-mono text-sm text-gray-600">USER: admin_root</p>
              <p className="font-mono text-sm text-gray-600">PASS: ********</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-semibold text-gray-700">API Keys</p>
              <p className="font-mono text-sm text-gray-600">PROD_KEY: sk_live_********</p>
              <p className="font-mono text-sm text-gray-600">TEST_KEY: sk_test_********</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-semibold text-gray-700">Backup Server</p>
              <p className="font-mono text-sm text-gray-600">SSH: backup@192.168.1.100</p>
              <p className="font-mono text-sm text-gray-600">PORT: 22</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Security Vulnerability Exposed!</h3>
            <div className="mt-2 text-red-700">
              <p>You've gained unauthorized access to the admin panel by:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Manipulating HTML attributes through inspection</li>
                <li>Bypassing client-side security controls</li>
                <li>Accessing restricted functionality without proper authentication</li>
              </ul>
              <p className="mt-2">In a secure application, this should not be possible due to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Server-side authentication checks</li>
                <li>Proper session management</li>
                <li>Role-based access control (RBAC)</li>
                <li>API endpoint protection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const showMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  return (
    <div className="h-[600px] bg-gray-100 rounded-lg overflow-hidden p-4">
      {/* Browser UI */}
      <div className="flex flex-col rounded-lg overflow-hidden border-2 border-gray-200 bg-white h-full">
        {/* Browser Controls */}
        <div className="bg-gray-200 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <button 
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
              onClick={() => showMessage("Really? All the work I had, and you want to leave??? 😭")}
            >
              <XCircle className="h-2 w-2 text-red-800 opacity-0 hover:opacity-100" />
            </button>
            <button 
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
              onClick={() => showMessage("This is a fake browser, do you really think I would write the code for that? 😅")}
            >
              <Minus className="h-2 w-2 text-yellow-800 opacity-0 hover:opacity-100" />
            </button>
            <button 
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
              onClick={() => showMessage("This is a fake browser, do you really think I would write the code for that? 😅")}
            >
              <Square className="h-2 w-2 text-green-800 opacity-0 hover:opacity-100" />
            </button>
          </div>
        </div>

        {/* URL Bar */}
        <div className="bg-gray-100 border-b border-gray-200 p-2">
          <form onSubmit={handleUrlSubmit} className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <button 
                type="button" 
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => showMessage("This is a fake browser, do you really think I would write the code for that? 😅")}
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                type="button" 
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => showMessage("This is a fake browser, do you really think I would write the code for that? 😅")}
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                type="button" 
                className="p-1 hover:bg-gray-200 rounded"
                onClick={() => showMessage("This is a fake browser, do you really think I would write the code for that? 😅")}
              >
                <RotateCw className="h-5 w-5 text-gray-600" />
              </button>
              {show404 && (
                <button
                  type="button"
                  onClick={() => {
                    setUrl('https://entreprise.locale/dashboard');
                    setShow404(false);
                    setShowAdminPage(false);
                    setError(null);
                  }}
                  className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  <Home className="h-4 w-4 mr-1" />
                  <span className="text-sm">Back to Dashboard</span>
                </button>
              )}
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full text-sm text-gray-600 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-50 overflow-auto" onContextMenu={handleContextMenu}>
          {show404 ? (
            <SimulatedNotFound onNavigate={(newUrl) => {
              setUrl(newUrl);
              setShow404(false);
              setShowAdminPage(false);
              setError(null);
            }} />
          ) : showAdminPage ? (
            getAdminContent()
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                  <p className="text-gray-600">Welcome back, Administrator</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    <Bell className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    id="adminButton"
                    disabled={!isButtonEnabled}
                    onClick={handleAdminClick}
                    className={`px-4 py-2 rounded ${
                      isButtonEnabled 
                        ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' 
                        : 'bg-gray-400 cursor-not-allowed'
                    } text-white`}
                  >
                    Admin Access
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Users</p>
                      <h3 className="text-2xl font-bold text-gray-800">2,451</h3>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-2">+12% from last month</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Active Projects</p>
                      <h3 className="text-2xl font-bold text-gray-800">124</h3>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-2">+5% from last week</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Revenue</p>
                      <h3 className="text-2xl font-bold text-gray-800">$52,147</h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-red-600 text-sm mt-2">-3% from yesterday</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Time Spent</p>
                      <h3 className="text-2xl font-bold text-gray-800">142h</h3>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-green-600 text-sm mt-2">On track</p>
                </div>
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Activity Overview</h4>
                    <button className="text-gray-500 hover:text-gray-700">
                      <ChartBar className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="h-48 flex items-end justify-around">
                    {[65, 45, 75, 35, 85, 55, 45].map((height, index) => (
                      <div key={index} className="w-8 bg-indigo-200 rounded-t" style={{height: `${height}%`}}>
                        <div 
                          className="bg-indigo-600 w-full rounded-t transition-all duration-300 hover:bg-indigo-700"
                          style={{height: `${height * 0.7}%`}}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-gray-600">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">Recent Activity</h4>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Calendar className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { user: 'Alice Smith', action: 'Created new project', time: '2 min ago' },
                      { user: 'Bob Johnson', action: 'Updated dashboard', time: '15 min ago' },
                      { user: 'Carol Williams', action: 'Deployed v2.0.0', time: '1 hour ago' },
                      { user: 'David Brown', action: 'Added new feature', time: '2 hours ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">{activity.user[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                            <p className="text-xs text-gray-500">{activity.action}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!isButtonEnabled && (
                <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-yellow-700">
                    Hint: Right-click the admin button and inspect the element to modify its properties.
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Inspector Modal */}
      {showInspector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Element Inspector</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowInspector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={inspectorText}
                onChange={(e) => setInspectorText(e.target.value)}
                className="w-full h-48 font-mono text-sm bg-gray-900 text-green-400 p-4 rounded"
                spellCheck="false"
              />
              <div className="mt-4 text-sm text-gray-600">
                <p>Hint: Try changing the "disabled" attribute to "false"</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleInspectorSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Message */}
      {showPopup && (
        <PopupMessage 
          message={popupMessage} 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </div>
  );
};