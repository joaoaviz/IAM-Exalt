import React, { useState } from 'react';
import { AlertCircle, Shield } from 'lucide-react';

interface LoginChallengeProps {
  onSuccess: () => void;
}

export const LoginChallenge: React.FC<LoginChallengeProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameAttempts, setUsernameAttempts] = useState(0);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [error, setError] = useState<{ type: 'username' | 'password' | null; message: string; hint: string }>({ 
    type: null, 
    message: '',
    hint: '' 
  });

  const getHint = (type: 'username' | 'password', attempts: number): string => {
    if (type === 'username') {
      if (attempts >= 15) return "🔍 What about the name of our company?";
      if (attempts >= 10) return "🏢 Notre nom est synonyme d'élévation...";
      if (attempts >= 5) return "💡 Regardez notre logo d'entreprise";
      return "";
    } else {
      if (attempts >= 15) return "🛡️ What about our entity?";
      if (attempts >= 10) return "🔐 Ce qui nous protège...";
      if (attempts >= 5) return "🤔 Notre symbole de protection";
      return "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.toLowerCase() !== 'exalt') {
      setUsernameAttempts(prev => prev + 1);
      setError({ 
        type: 'username',
        message: "Nom d'utilisateur incorrect.",
        hint: getHint('username', usernameAttempts + 1)
      });
      return;
    }

    if (password.toLowerCase() !== 'shield') {
      setPasswordAttempts(prev => prev + 1);
      setError({ 
        type: 'password',
        message: "Mot de passe incorrect.",
        hint: getHint('password', passwordAttempts + 1)
      });
      return;
    }

    onSuccess();
  };

  const totalAttempts = usernameAttempts + passwordAttempts;

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-indigo-100">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-full">
            <Shield className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Connexion Administrateur</h3>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Challenge de Sécurité: Trouvez les identifiants d'accès!
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
              placeholder="Entrez le nom d'utilisateur"
            />
            {error.type === 'username' && (
              <div className="mt-2">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error.message}
                </p>
                {error.hint && (
                  <p className="text-sm text-amber-600 mt-1">
                    {error.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-md border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
              placeholder="Entrez le mot de passe"
            />
            {error.type === 'password' && (
              <div className="mt-2">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  {error.message}
                </p>
                {error.hint && (
                  <p className="text-sm text-amber-600 mt-1">
                    {error.hint}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
            Nombre total de tentatives: {totalAttempts}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Vulnérabilités de sécurité présentes:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
            <li>Pas de politique de mot de passe fort</li>
            <li>Absence de limitation de tentatives (rate limiting)</li>
            <li>Pas de verrouillage de compte</li>
            <li>Absence de CAPTCHA</li>
            <li>Messages d'erreur trop descriptifs</li>
            <li>Pas d'authentification à deux facteurs (2FA)</li>
            <li>Indices de sécurité révélateurs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};