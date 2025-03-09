import React, { useState, useEffect } from 'react';
import { Key, Lock, AlertCircle, CheckCircle, User, Shield, ArrowRight, Mail, Music, Hash, Send, Search, Loader2, Gauge } from 'lucide-react';

interface FederatedIdentityChallengeProps {
  onSuccess: () => void;
}

interface App {
  id: string;
  name: string;
  brand: {
    logo: React.ReactNode;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    style: 'spotify' | 'gmail' | 'slack';
  };
  passwordRequirements: {
    minLength: number;
    requiresUppercase: boolean;
    requiresNumbers: boolean;
    requiresSymbols: boolean;
    requiresNoCommonWords: boolean;
  };
}

interface WarningPopupProps {
  message: string;
  onClose: () => void;
}

const WarningPopup: React.FC<WarningPopupProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-start mb-4">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Attention !</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Compris
          </button>
        </div>
      </div>
    </div>
  );
};

const SSOProcessModal: React.FC<{ provider: string; onComplete: () => void }> = ({ provider, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isExiting, setIsExiting] = useState(false);

  React.useEffect(() => {
    const timings = [2000, 2500, 2500, 2000]; // Longer timings for better readability
    let currentStep = 1;

    const timer = setInterval(() => {
      if (currentStep < 4) {
        currentStep++;
        setStep(currentStep);
      } else {
        setIsExiting(true);
        setTimeout(() => {
          clearInterval(timer);
          onComplete();
        }, 1000);
      }
    }, timings[currentStep - 1]);

    return () => clearInterval(timer);
  }, [onComplete]);

  const getStepIcon = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return <Send className="h-12 w-12 text-blue-500 animate-pulse transform transition-transform hover:scale-110" />;
      case 2:
        return (
          <div className="relative">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 animate-ping" />
          </div>
        );
      case 3:
        return <CheckCircle className="h-12 w-12 text-green-500 animate-bounce" />;
      case 4:
        return (
          <div className="relative">
            <Shield className="h-12 w-12 text-green-500 animate-pulse" />
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 animate-ping" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStepMessage = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return `Connexion sécurisée à ${provider} en cours...`;
      case 2:
        return "Vérification de votre identité...";
      case 3:
        return `${provider} a validé votre identité !`;
      case 4:
        return "Accès accordé ! Configuration de votre espace...";
      default:
        return "";
    }
  };

  return (
    <div className={`fixed inset-0 bg-black transition-opacity duration-500 flex items-center justify-center z-50
      ${isExiting ? 'bg-opacity-0' : 'bg-opacity-60'}`}>
      <div className={`bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-500
        ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="space-y-8">
          {/* Step Icon */}
          <div className={`transition-all duration-500 transform
            ${step === 1 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 absolute'}`}>
            <div className="flex items-center justify-center">
              {getStepIcon(step)}
            </div>
          </div>

          {/* Step Message */}
          <div className="min-h-[3rem]">
            <p className="text-center text-lg text-gray-800 font-medium transition-all duration-500
              animate-fadeIn">
              {getStepMessage(step)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(step / 4) * 100}%`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 transform
                  ${i <= step ? 'bg-blue-500 scale-100' : 'bg-gray-200 scale-75'}
                  ${i === step ? 'ring-4 ring-blue-100' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FrustrationGauge: React.FC<{ level: number }> = ({ level }) => {
  const rotation = -90 + (level * 180 / 100);
  
  return (
    <div className={`relative w-48 ${level === 100 ? 'animate-shake' : ''}`}>
      {/* Percentage at the top */}
      <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl font-medium
        ${level === 100 ? 'text-red-600 font-bold animate-bounce' : ''}`}>
        {level}%
      </div>

      {/* Gauge */}
      <div className="mt-8">
        <svg className="w-full h-32" viewBox="0 0 200 120">
          {/* Background Arc */}
          <path
            d="M20,100 A 80,80 0 0,1 180,100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Colored Arc */}
          <path
            d="M20,100 A 80,80 0 0,1 180,100"
            fill="none"
            stroke="url(#frustrationGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - level / 100)}
            className={`transition-all duration-300 ease-out ${level === 100 ? 'animate-pulse' : ''}`}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="frustrationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Needle */}
          <g transform={`rotate(${rotation}, 100, 100)`} 
             className="transition-transform duration-300 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="40"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="4" fill="black" />
          </g>
        </svg>
      </div>

      {/* Labels at the bottom */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2">
        <span className="text-sm font-medium text-[#22c55e]">Calme</span>
        <span className="text-sm font-medium text-[#ef4444]">Frustré</span>
      </div>

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
          }
          .animate-shake {
            animation: shake 0.2s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export const FederatedIdentityChallenge: React.FC<FederatedIdentityChallengeProps> = ({ onSuccess }) => {
  const [phase, setPhase] = useState<1 | 2>(1);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [frustrationLevel, setFrustrationLevel] = useState(0);
  const [showFederatedOption, setShowFederatedOption] = useState(false);
  const [accounts, setAccounts] = useState<Record<string, { username: string; password: string }>>({});
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [usedPasswords, setUsedPasswords] = useState<Set<string>>(new Set());
  const [showWarning, setShowWarning] = useState(false);
  
  // Add password-related state at component level
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [meetsRequirements, setMeetsRequirements] = useState({
    length: false,
    uppercase: false,
    numbers: false,
    symbols: false,
    noCommonWords: false
  });

  // Reset password state when changing apps
  useEffect(() => {
    setPassword('');
    setIsPasswordValid(false);
    setMeetsRequirements({
      length: false,
      uppercase: false,
      numbers: false,
      symbols: false,
      noCommonWords: false
    });
  }, [currentAppIndex]);

  const apps: App[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      brand: {
        logo: <Music className="h-8 w-8 text-green-500" />,
        primaryColor: 'bg-green-500',
        secondaryColor: 'text-green-500',
        backgroundColor: 'bg-black',
        style: 'spotify'
      },
      passwordRequirements: {
        minLength: 8,
        requiresUppercase: false,
        requiresNumbers: true,
        requiresSymbols: false,
        requiresNoCommonWords: false
      }
    },
    {
      id: 'gmail',
      name: 'Gmail',
      brand: {
        logo: <Mail className="h-8 w-8 text-red-500" />,
        primaryColor: 'bg-blue-500',
        secondaryColor: 'text-blue-500',
        backgroundColor: 'bg-white',
        style: 'gmail'
      },
      passwordRequirements: {
        minLength: 10,
        requiresUppercase: true,
        requiresNumbers: true,
        requiresSymbols: true,
        requiresNoCommonWords: false
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      brand: {
        logo: <Hash className="h-8 w-8 text-purple-500" />,
        primaryColor: 'bg-purple-500',
        secondaryColor: 'text-purple-500',
        backgroundColor: 'bg-white',
        style: 'slack'
      },
      passwordRequirements: {
        minLength: 12,
        requiresUppercase: true,
        requiresNumbers: true,
        requiresSymbols: true,
        requiresNoCommonWords: true
      }
    }
  ];

  const handleCreateAccount = (appId: string, username: string, password: string) => {
    // Check if password was already used
    if (usedPasswords.has(password)) {
      setShowWarning(true);
      return;
    }

    // Add password to used passwords set
    setUsedPasswords(prev => new Set([...prev, password]));
    
    setAccounts(prev => ({
      ...prev,
      [appId]: { username, password }
    }));
    setFrustrationLevel(prev => Math.min(prev + 20, 100));
    
    if (currentAppIndex < apps.length - 1) {
      setCurrentAppIndex(prev => prev + 1);
    } else {
      setTimeout(() => {
        setShowFederatedOption(true);
      }, 1000);
    }
  };

  const handleFederatedLogin = () => {
    setPhase(2);
    setTimeout(() => {
      onSuccess();
    }, 6000);
  };

  const validatePassword = (password: string, requirements: App['passwordRequirements']): boolean => {
    if (password.length < requirements.minLength) return false;
    if (requirements.requiresUppercase && !/[A-Z]/.test(password)) return false;
    if (requirements.requiresNumbers && !/[0-9]/.test(password)) return false;
    if (requirements.requiresSymbols && !/[!@#$%^&*]/.test(password)) return false;
    if (requirements.requiresNoCommonWords && /password|123456|admin/i.test(password)) return false;
    return true;
  };

  const getPasswordRequirements = (app: App): string[] => {
    const reqs = [];
    reqs.push(`Au moins ${app.passwordRequirements.minLength} caractères`);
    if (app.passwordRequirements.requiresUppercase) reqs.push('Au moins une majuscule');
    if (app.passwordRequirements.requiresNumbers) reqs.push('Au moins un chiffre');
    if (app.passwordRequirements.requiresSymbols) reqs.push('Au moins un caractère spécial (!@#$%^&*)');
    if (app.passwordRequirements.requiresNoCommonWords) reqs.push('Pas de mots communs');
    return reqs;
  };

  const renderLoginForm = (app: App) => {
    const handleInputChange = () => {
      setFrustrationLevel(prev => {
        const newLevel = Math.min(prev + 2, 100);
        if (newLevel === 100 && window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
        return newLevel;
      });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPassword = e.target.value;
      setPassword(newPassword);
      handleInputChange();
      
      // Update requirements status based on the current app's requirements
      const currentApp = apps[currentAppIndex];
      setMeetsRequirements({
        length: newPassword.length >= currentApp.passwordRequirements.minLength,
        uppercase: !currentApp.passwordRequirements.requiresUppercase || /[A-Z]/.test(newPassword),
        numbers: !currentApp.passwordRequirements.requiresNumbers || /[0-9]/.test(newPassword),
        symbols: !currentApp.passwordRequirements.requiresSymbols || /[!@#$%^&*]/.test(newPassword),
        noCommonWords: !currentApp.passwordRequirements.requiresNoCommonWords || !/password|123456|admin/i.test(newPassword)
      });

      // Check if all requirements are met
      setIsPasswordValid(validatePassword(newPassword, currentApp.passwordRequirements));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const username = formData.get('username') as string;
      
      if (isPasswordValid) {
        handleCreateAccount(app.id, username, password);
      }
    };

    switch (app.brand.style) {
      case 'spotify':
        return (
          <div className="bg-black text-white p-8 rounded-lg max-w-md mx-auto">
            <div className="flex justify-center mb-8">
              {app.brand.logo}
              <h2 className="text-2xl font-bold ml-2">Spotify</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adresse e-mail ou nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#121212] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Email ou nom d'utilisateur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-[#121212] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Mot de passe"
                />
                <div className="mt-2 space-y-1">
                  {getPasswordRequirements(app).map((req, index) => {
                    const reqKey = Object.keys(meetsRequirements)[index];
                    const isValid = meetsRequirements[reqKey as keyof typeof meetsRequirements];
                    return (
                      <p key={index} className={`text-xs flex items-center ${isValid ? 'text-green-500' : 'text-gray-400'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${isValid ? 'text-green-500' : 'text-gray-500'}`} />
                        {req}
                      </p>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                disabled={!isPasswordValid}
                className={`w-full py-3 px-4 font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black
                  ${isPasswordValid ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-gray-600 cursor-not-allowed text-gray-300'}`}
              >
                Se connecter
              </button>
            </form>
          </div>
        );

      case 'gmail':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {app.brand.logo}
              </div>
              <h2 className="text-2xl">Se connecter</h2>
              <p className="text-gray-600 mt-2">Continuer vers Gmail</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="username"
                  required
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Email ou téléphone"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Entrez votre mot de passe"
                />
                <div className="mt-2 space-y-1">
                  {getPasswordRequirements(app).map((req, index) => {
                    const isValid = Object.values(meetsRequirements)[index];
                    return (
                      <p key={index} className={`text-xs flex items-center ${isValid ? 'text-blue-500' : 'text-gray-600'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${isValid ? 'text-blue-500' : 'text-gray-400'}`} />
                        {req}
                      </p>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                disabled={!isPasswordValid}
                className={`w-full py-2 px-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${isPasswordValid ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
              >
                Suivant
              </button>
            </form>
          </div>
        );

      case 'slack':
        return (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {app.brand.logo}
              </div>
              <h2 className="text-3xl font-bold text-black">Connectez-vous à Slack</h2>
              <p className="text-gray-600 mt-2">Nous suggérons d'utiliser l'adresse email que vous utilisez au travail.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre adresse email
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="nom@travail.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Votre mot de passe"
                />
                <div className="mt-2 space-y-1">
                  {getPasswordRequirements(app).map((req, index) => {
                    const isValid = Object.values(meetsRequirements)[index];
                    return (
                      <p key={index} className={`text-xs flex items-center ${isValid ? 'text-purple-500' : 'text-gray-600'}`}>
                        <CheckCircle className={`h-3 w-3 mr-1 ${isValid ? 'text-purple-500' : 'text-gray-400'}`} />
                        {req}
                      </p>
                    );
                  })}
                </div>
              </div>
              <button
                type="submit"
                disabled={!isPasswordValid}
                className={`w-full py-2 px-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  ${isPasswordValid ? 'bg-purple-700 hover:bg-purple-800 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
              >
                Se connecter avec email
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
      {showWarning && (
        <WarningPopup
          message="Pour votre sécurité, n'utilisez jamais le même mot de passe pour différents comptes. Chaque compte doit avoir un mot de passe unique."
          onClose={() => setShowWarning(false)}
        />
      )}
      {/* Info Banner */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-blue-800 font-medium text-sm sm:text-base">Identité Fédérée</h3>
            <p className="text-blue-700 mt-1 text-sm sm:text-base">
              Découvrez comment l'identité fédérée simplifie la gestion des comptes tout en renforçant la sécurité.
            </p>
          </div>
        </div>
      </div>

      {phase === 1 ? (
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
          {/* Current App Registration */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              {!showFederatedOption ? (
                <div className="flex justify-center">
                  {renderLoginForm(apps[currentAppIndex])}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#2B3A4D]">Boond</h2>
                    <p className="text-[#FFA500] font-medium">Manager</p>
                  </div>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-600 mb-6">Connectez-vous avec votre compte d'entreprise</p>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedProvider('Google');
                          setShowSSOModal(true);
                          setFrustrationLevel(0);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA+VBMVEX////pQjU0qFNChfT6uwU0f/O4zvs6gfSJr/j6twDoOisjePPoNSXpPjDrWU/oLRr+9vZ7pff/vAAUoUAkpEn0ran619b82pT7wgD+68j947H/+e7//PafvPm/0vuBw5Df7+P63tz3xcPxl5HnJQ7qUEXxj4n4z83zoJzqSz/vgXrucWrsY1r1tbHrSBPoOjbvcSr0kx74rRH80XntZC3xhSPmGRr86+r4sk/936EJcfPS3/yowvnbwVKjsTjx9f5urEjkuBu9tC+ErkJyvoRRpj2az6hWs23j6/0emX2z2btAiuI8k8AyqkE5nZU1pGxCiOxVmtHJ5M+PSt3WAAACGElEQVRIieWSa3fSQBCGk20CJRcW2AWKxgJtqCmieNdatV5SUtFq5f//GJeE7CXJJOT4TZ+PO+c58+7MaNr/SWd60mecTDs1pMFp28dODPZnZw/369TXseXqHNfCblDdte84krTDwUFFwnMnJyXm+bSsmZ/vlcb1+6A2x5C1xYeyPgIyJlhtYDjzjOYyZA3oFighLYxni8UMY6dCG/jy9KzTQfI8DXSnTNN0kcl1lNE9dlxYC8TnnEVmAJ02qHlPllyb58vgmQ2Np0tYgzGMo2ex6IKRihi1mPhcZyYuO8McL4yYl0vrrI6mJZpx9Or1mzqa10rFt8p7o5ArXh+lXutC8d6ZBdiXvH6PeyPFsw8KMBu8fsG9+3t473l9yD1vD+/BX3v1cgqv3lzE/8A9NCUK5sn33vugeN1DQTcVTbG/9M56H+lEAzg2d54t7iW5657xCdEx5PF+B9Lj9oO9z4hBgIZX6YyaXfmZaV9QQkU781h+Hra+7jQaFv6Or8RW3r1rhErES641D9XKigox8jJaQxyAfZOpIQm6kiuT6BvfujqVuEpkkY43u+d1RBBF35v55aVJidKSEBRFiJAk/+0PM3NjgjFFMLc/WVYzlzImLBPprzvzrlBjHUmZSH8DmqatS0QSZtcjTxUBWSlZw1bckhaYlISTcm1rIqKolJJxtRWnXUVscTFsjWFFwoy7WTM2+zX69/gDaLcy7SET9nsAAAAASUVORK5CYII=" alt="Google" className="w-5 h-5" />
                        <span className="text-gray-700">Se connecter avec Google</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedProvider('Microsoft');
                          setShowSSOModal(true);
                          setFrustrationLevel(0);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-5 h-5" />
                        <span className="text-gray-700">Se connecter avec Microsoft</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedProvider('Ping ID');
                          setShowSSOModal(true);
                          setFrustrationLevel(0);
                        }}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIACgAKAMBEQACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAADBwIFBgT/xAAxEAACAQIEAgUNAQAAAAAAAAABAgMABAUGERIHMSFBUWGxEyIjNnFydHWBkaGyszP/xAAbAQABBQEBAAAAAAAAAAAAAAADAAECBAYFB//EACkRAAICAQIEBAcAAAAAAAAAAAABAgMRBTEEIWFxEzKBwRIUIjM0QXL/2gAMAwEAAhEDEQA/AMyTpXOPSwTtTjZAs1PgbIF2qQwFmpyLZZ6hpEU8iwB+poaJTeItm/4jZPwfAMHtbnDopkllvEhYvMzeaVYnn7BViyuMVlGc07UuIvtlGx8km9i6xjJGR8FgjuMVM1tFJII1d7h9CxBOnR3A1KVdcdynVqXH3PEOb7IoM38N7ODBnxjLN1JNCkflWhZw4ePTXcjDu6dDrr29VRlWksxLnB6vY7PCvXTPXqK/WhnecixRvTRe+vjUUTtf0McXGX1cw/5lF+r1Zu8pjtI+9L+X7AeOPqtZ/Hp/OSmu2QTRPyH290d3CzcOH1sbr/L023dy2bm/HOnq8gDVMfOS+HoIFT5oqutjV5O1ZAsqM3JWBP3pFixZi0MXiNnfBcwYPaWuHPOZYr1Jm3xFRtCsD4ii2TUlhGd0/Tr6LJSmv00XeMZ+yPjNulvikVxcxRyCRUeBtAwBGvPsJqUrIS3KdencbS8w5PuZ3N3Ey3u8GbB8tWUlpbunkmlkVU2x8tqKCdAR0a9Q6uyMrMrCRb4XS5Rs8S55e/r1FmTQzrth2bWkXWyBpA2yJNIG2RJpAmyJpA2z/9k=" alt="Ping ID" className="w-5 h-5" />
                        <span className="text-gray-700">Se connecter avec Ping ID</span>
                      </button>
                    </div>
                    <div className="flex items-center justify-center mt-8">
                      <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04cy41OS04IDggMy41OSA4IDggMy41OSA4LTMuNTkgOHptMC0xNGMtMy4zMSAwLTYgMi42OS02IDZzMi42OSA2IDYgNi0yLjY5IDYtNi0yLjY5LTYtNi02em0wIDEwYy0yLjIxIDAtNC0xLjc5LTQtNHMxLjc5LTQgNC00IDQgMS43OSA0IDQtMS43OSA0LTQgNHoiIGZpbGw9IiNGRkE1MDAiLz48L3N2Zz4=" alt="Boond" className="w-8 h-8" />
                      <span className="ml-2 text-sm text-gray-600">Work differently with <span className="text-[#2B3A4D] font-medium">BoondManager</span></span>
                    </div>
                    <div className="text-center">
                      <button className="text-sm text-gray-600 hover:text-gray-800">
                        Help
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frustration Gauge */}
          <div className="lg:w-64 mt-8 lg:mt-0">
            <h4 className="text-center text-sm text-gray-600 mb-8">Niveau de frustration</h4>
            <div className="bg-white rounded-lg py-8">
              <div className="relative flex justify-center">
                <FrustrationGauge level={frustrationLevel} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <div className="bg-green-50 p-6 rounded-lg">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-green-800 mb-2">
              Félicitations !
            </h2>
            <p className="text-green-700">
              Vous venez de découvrir la puissance de l'identité fédérée.
              Un seul compte sécurisé pour accéder à toutes vos applications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Expérience Utilisateur</h3>
              <p className="text-blue-700 text-sm">
                Plus besoin de gérer de multiples identifiants et mots de passe
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-medium text-indigo-800 mb-2">Sécurité Renforcée</h3>
              <p className="text-indigo-700 text-sm">
                Une identité unique et forte, gérée de manière centralisée
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-800 mb-2">Efficacité Opérationnelle</h3>
              <p className="text-purple-700 text-sm">
                Réduction des coûts de gestion et support IT
              </p>
            </div>
          </div>
        </div>
      )}

      {showSSOModal && (
        <SSOProcessModal
          provider={selectedProvider}
          onComplete={() => {
            setShowSSOModal(false);
            handleFederatedLogin();
          }}
        />
      )}
    </div>
  );
}; 