import React, { useState } from 'react';
import { Users, Info, Shield, Eye, Edit, FileText, Trash2, ShoppingCart, CheckCircle, X, ArrowRight } from 'lucide-react';

interface PermissionsChallengeProps {
  onSuccess: () => void;
}

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface UserCompletion {
  id: string;
  completed: boolean;
  isCorrect?: boolean;
  score?: number;
  total?: number;
}

export const PermissionsChallenge: React.FC<PermissionsChallengeProps> = ({ onSuccess }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showRBACExplanation, setShowRBACExplanation] = useState(false);
  const [userCompletions, setUserCompletions] = useState<UserCompletion[]>([
    { id: '1', completed: false },
    { id: '2', completed: false },
    { id: '3', completed: false }
  ]);
  const [showVerificationResult, setShowVerificationResult] = useState(false);
  
  const users: User[] = [
    {
      id: '1',
      name: 'Thomas Martin',
      role: 'Consultant',
      email: 't.martin@example.com',
      avatar: 'TM'
    },
    {
      id: '2',
      name: 'Sophie Dubois',
      role: 'Digital Sales Manager',
      email: 's.dubois@example.com',
      avatar: 'SD'
    },
    {
      id: '3',
      name: 'Philippe Legrand',
      role: 'Directeur Général',
      email: 'p.legrand@example.com',
      avatar: 'PL'
    }
  ];

  const expectedPatterns = {
    // Consultant: Read-only access to clients and products
    '1': {
      read_clients: true,
      write_clients: false,
      read_products: true,
      write_products: false,
      create_orders: false,
      cancel_orders: false
    },
    // Sales Manager: Can read/write clients, read products, create orders
    '2': {
      read_clients: true,
      write_clients: true,
      read_products: true,
      write_products: false,
      create_orders: true,
      cancel_orders: false
    },
    // Director: Full access
    '3': {
      read_clients: true,
      write_clients: true,
      read_products: true,
      write_products: true,
      create_orders: true,
      cancel_orders: true
    }
  };

  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({
    '1': [
      {
        id: 'read_clients',
        name: 'Lecture données clients',
        description: 'Permet de consulter les informations clients',
        category: 'Clients',
        enabled: false
      },
      {
        id: 'write_clients',
        name: 'Modification données clients',
        description: 'Permet de modifier les informations clients',
        category: 'Clients',
        enabled: false
      },
      {
        id: 'read_products',
        name: 'Lecture données produits',
        description: 'Permet de consulter le catalogue produits',
        category: 'Produits',
        enabled: false
      },
      {
        id: 'write_products',
        name: 'Modification données produits',
        description: 'Permet de modifier le catalogue produits',
        category: 'Produits',
        enabled: false
      },
      {
        id: 'create_orders',
        name: 'Création commandes',
        description: 'Permet de créer des commandes',
        category: 'Commandes',
        enabled: false
      },
      {
        id: 'cancel_orders',
        name: 'Annulation commandes',
        description: "Permet d'annuler des commandes",
        category: 'Commandes',
        enabled: false
      }
    ],
    '2': [
      {
        id: 'read_clients',
        name: 'Lecture données clients',
        description: 'Permet de consulter les informations clients',
        category: 'Clients',
        enabled: false
      },
      {
        id: 'write_clients',
        name: 'Modification données clients',
        description: 'Permet de modifier les informations clients',
        category: 'Clients',
        enabled: false
      },
      {
        id: 'read_products',
        name: 'Lecture données produits',
        description: 'Permet de consulter le catalogue produits',
        category: 'Produits',
        enabled: false
      },
      {
        id: 'write_products',
        name: 'Modification données produits',
        description: 'Permet de modifier le catalogue produits',
        category: 'Produits',
        enabled: false
      },
      {
        id: 'create_orders',
        name: 'Création commandes',
        description: 'Permet de créer des commandes',
        category: 'Commandes',
        enabled: false
      },
      {
        id: 'cancel_orders',
        name: 'Annulation commandes',
        description: "Permet d'annuler des commandes",
        category: 'Commandes',
        enabled: false
      }
    ],
    '3': [
      {
        id: 'read_clients',
        name: 'Lecture données clients',
        description: 'Permet de consulter les informations clients',
        category: 'Clients',
        enabled: false
      },
      {
        id: 'write_clients',
        name: 'Modification données clients',
        description: 'Permet de modifier les informations clients',
        category: 'Clients',
        enabled: false
      },
      {
        id: 'read_products',
        name: 'Lecture données produits',
        description: 'Permet de consulter le catalogue produits',
        category: 'Produits',
        enabled: false
      },
      {
        id: 'write_products',
        name: 'Modification données produits',
        description: 'Permet de modifier le catalogue produits',
        category: 'Produits',
        enabled: false
      },
      {
        id: 'create_orders',
        name: 'Création commandes',
        description: 'Permet de créer des commandes',
        category: 'Commandes',
        enabled: false
      },
      {
        id: 'cancel_orders',
        name: 'Annulation commandes',
        description: "Permet d'annuler des commandes",
        category: 'Commandes',
        enabled: false
      }
    ]
  });

  const handlePermissionToggle = (userId: string, permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [userId]: prev[userId].map(permission => 
        permission.id === permissionId 
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    }));
  };

  const checkUserPermissions = (userId: string): boolean => {
    const userPerms = permissions[userId];
    const expected = expectedPatterns[userId as keyof typeof expectedPatterns];
    return userPerms.every(permission => 
      permission.enabled === expected[permission.id as keyof typeof expected]
    );
  };

  const handleSave = () => {
    if (!selectedUser) return;

    const completedCount = userCompletions.filter(uc => uc.completed).length;
    const isLastUser = completedCount === 2;
    
    if (isLastUser) {
      // Calculate scores for all users
      const allResults = users.map(user => {
        const userPerms = permissions[user.id];
        const correctCount = userPerms.reduce((count, perm) => {
          const expectedValue = expectedPatterns[user.id as keyof typeof expectedPatterns][perm.id as keyof typeof expectedPatterns['1']];
          return count + (perm.enabled === expectedValue ? 1 : 0);
        }, 0);
        
        return {
          id: user.id,
          completed: true,
          isCorrect: correctCount === userPerms.length,
          score: correctCount,
          total: userPerms.length
        };
      });
      
      setUserCompletions(allResults);
      setShowVerificationResult(true);
      
      const allCorrect = allResults.every(result => result.isCorrect);
      if (allCorrect) {
        setTimeout(() => {
          setShowRBACExplanation(true);
          onSuccess();
        }, 1500);
      }
    } else {
      // Mark user as completed and show results
      setUserCompletions(prev => 
        prev.map(uc => 
          uc.id === selectedUser ? { 
            ...uc, 
            completed: true,
            score: permissions[selectedUser].reduce((count, perm) => {
              const expectedValue = expectedPatterns[selectedUser as keyof typeof expectedPatterns][perm.id as keyof typeof expectedPatterns['1']];
              return count + (perm.enabled === expectedValue ? 1 : 0);
            }, 0),
            total: permissions[selectedUser].length
          } : uc
        )
      );

      // Find next uncompleted user
      const nextUser = users.find(user => 
        !userCompletions.find(uc => uc.id === user.id)?.completed &&
        user.id !== selectedUser
      );

      if (nextUser) {
        setSelectedUser(nextUser.id);
      }
    }
  };

  const handleReset = () => {
    setUserCompletions([
      { id: '1', completed: false },
      { id: '2', completed: false },
      { id: '3', completed: false }
    ]);
    setShowVerificationResult(false);
    setSelectedUser('1');
    setPermissions(prev => {
      const resetPerms = { ...prev };
      Object.keys(resetPerms).forEach(userId => {
        resetPerms[userId] = resetPerms[userId].map(perm => ({ ...perm, enabled: false }));
      });
      return resetPerms;
    });
  };

  const completedCount = userCompletions.filter(uc => uc.completed).length;
  const isLastUser = completedCount === 2;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-blue-800 font-medium text-sm sm:text-base">À propos de cette approche</h3>
            <p className="text-blue-700 mt-1 text-sm sm:text-base">
              Cette page illustre l'approche traditionnelle de gestion des accès via une interface de type "Active Directory". 
              Les autorisations sont attribuées directement aux utilisateurs de manière individuelle.
            </p>
            <p className="text-blue-700 mt-2 text-sm sm:text-base">
              Bien que simple à comprendre, cette approche peut devenir difficile à maintenir lorsque le nombre d'utilisateurs 
              et de permissions augmente. Découvrez l'approche RBAC dans l'onglet suivant pour une gestion plus efficace.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600">
            Progression: {completedCount}/3 utilisateurs configurés
          </span>
        </div>
        <div className="flex-1 mx-0 sm:mx-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-xs sm:text-sm text-gray-500 hover:text-gray-700"
        >
          Tout réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
        {/* Users List */}
        <div className="sm:col-span-4">
          <div className="flex items-center mb-3 sm:mb-4">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium">Utilisateurs</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-colors ${
                  selectedUser === user.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
                      {user.avatar}
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">{user.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{user.role}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {userCompletions.find(uc => uc.id === user.id)?.completed && (
                    showVerificationResult ? (
                      <div className={`flex items-center ${
                        userCompletions.find(uc => uc.id === user.id)?.isCorrect 
                          ? 'text-green-500' 
                          : 'text-gray-500'
                      }`}>
                        <span className="text-xs sm:text-sm font-medium">
                          {userCompletions.find(uc => uc.id === user.id)?.score}/
                          {userCompletions.find(uc => uc.id === user.id)?.total}
                        </span>
                      </div>
                    ) : (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    )
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions List */}
        <div className="sm:col-span-8">
          {selectedUser ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2 flex-shrink-0" />
                  <h2 className="text-base sm:text-lg font-medium">
                    Autorisations pour {users.find(u => u.id === selectedUser)?.name}
                  </h2>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {!showVerificationResult && (
                    <>
                      <button
                        onClick={() => {
                          setPermissions(prev => ({
                            ...prev,
                            [selectedUser]: prev[selectedUser].map(perm => ({ ...perm, enabled: false }))
                          }));
                        }}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-800"
                      >
                        Tout refuser
                      </button>
                      <button 
                        onClick={handleSave}
                        className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                          isLastUser 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white rounded-lg transition-colors`}
                      >
                        {isLastUser ? 'Vérifier mes réponses' : 'Sauvegarder'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {permissions[selectedUser].map(permission => {
                  const userCompletion = userCompletions.find(uc => uc.id === selectedUser);
                  const expectedValue = expectedPatterns[selectedUser as keyof typeof expectedPatterns][permission.id as keyof typeof expectedPatterns['1']];
                  const showResults = userCompletion?.completed || showVerificationResult;
                  
                  return (
                    <div key={permission.id} className={`bg-gray-50 p-3 sm:p-4 rounded-lg ${
                      showResults ? 
                        (permission.enabled === expectedValue ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500')
                        : ''
                    }`}>
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            {permission.category === 'Clients' && <Users className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />}
                            {permission.category === 'Produits' && <FileText className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />}
                            {permission.category === 'Commandes' && <ShoppingCart className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />}
                            <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{permission.name}</h3>
                            <Info className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{permission.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{permission.category}</p>
                          {showResults && (
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                              <span className={`flex items-center ${expectedValue ? 'text-green-600' : 'text-red-600'}`}>
                                Attendu: {expectedValue ? 'Autorisé' : 'Refusé'}
                              </span>
                              <span className={`flex items-center ${permission.enabled === expectedValue ? 'text-green-600' : 'text-red-600'}`}>
                                Réponse: {permission.enabled ? 'Autorisé' : 'Refusé'}
                              </span>
                            </div>
                          )}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={permission.enabled}
                            onChange={() => !showVerificationResult && handlePermissionToggle(selectedUser, permission.id)}
                            disabled={showVerificationResult}
                          />
                          <div className={`w-11 h-6 ${showVerificationResult ? 'opacity-50' : ''} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-32 sm:h-full flex items-center justify-center text-gray-500 text-sm sm:text-base">
              <p>Sélectionnez un utilisateur pour gérer ses autorisations</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Button */}
      {showVerificationResult && (
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onSuccess}
            className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white text-sm sm:text-base rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span>Découvrir l'approche RBAC</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      )}

      {/* RBAC Explanation Modal */}
      {showRBACExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Félicitations ! Découvrons maintenant l'approche RBAC</h2>
            
            <div className="prose max-w-none text-sm sm:text-base">
              <div className="bg-green-50 border-l-4 border-green-400 p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-green-700">
                  Vous avez correctement configuré les permissions pour chaque utilisateur. Cependant, cette approche présente plusieurs limitations.
                </p>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Limitations de l'approche actuelle</h3>
              <ul className="space-y-2 mb-4 sm:mb-6">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                  <span>Gestion manuelle des permissions pour chaque utilisateur</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                  <span>Risque d'incohérence dans l'attribution des permissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                  <span>Difficulté à maintenir une politique de sécurité cohérente</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                  <span>Complexité croissante avec le nombre d'utilisateurs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 