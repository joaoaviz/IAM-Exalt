import React, { useState, useEffect } from 'react';
import { Ghost, RefreshCw, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-9xl font-bold text-purple-600 mb-4 animate-bounce">404</h1>
        <p className="text-2xl text-gray-700 mb-8">Oops! Page not found</p>
        
        {/* Fun interactive element */}
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
          
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'} 
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </button>
          </div>
        </div>

        {/* Easter egg messages based on score */}
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