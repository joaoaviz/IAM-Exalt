import React, { useState } from 'react';
import { Users, Info, Shield, FileText, ShoppingCart, CheckCircle, ArrowRight, RotateCw } from 'lucide-react';

interface RBACChallengeProps {
  onSuccess: () => void;
}

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface UserAssignments {
  [key: string]: '1' | '2' | '3';
}

export const RBACChallenge: React.FC<RBACChallengeProps> = ({ onSuccess }) => {
  const [draggedUser, setDraggedUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userAssignments, setUserAssignments] = useState<UserAssignments>({});
  const [showVerification, setShowVerification] = useState(false);
  const [completedUsers, setCompletedUsers] = useState<string[]>([]);

  const users: User[] = [
    {
      id: '1',
      name: 'Thomas Martin',
      role: 'Sales Manager',
      email: 'thomas.martin@exalt.com',
      avatar: 'TM'
    },
    {
      id: '2',
      name: 'Sophie Dubois',
      role: 'Director',
      email: 'sophie.dubois@exalt.com',
      avatar: 'SD'
    },
    {
      id: '3',
      name: 'Philippe Legrand',
      role: 'Consultant',
      email: 'philippe.legrand@exalt.com',
      avatar: 'PL'
    }
  ];

  const roles: Role[] = [
    {
      id: '1',
      name: 'Consultant',
      description: 'Accès en lecture seule aux données clients et produits',
      permissions: [
        'Voir les clients',
        'Voir les produits'
      ]
    },
    {
      id: '2',
      name: 'Sales Manager',
      description: 'Gestion des clients et commandes, lecture des produits',
      permissions: [
        'Voir les clients',
        'Modifier les clients',
        'Voir les produits',
        'Créer des commandes'
      ]
    },
    {
      id: '3',
      name: 'Director',
      description: 'Accès complet à toutes les fonctionnalités',
      permissions: [
        'Voir les clients',
        'Modifier les clients',
        'Voir les produits',
        'Modifier les produits',
        'Créer des commandes',
        'Annuler des commandes'
      ]
    }
  ];

  const expectedAssignments: UserAssignments = {
    '1': '2', // Thomas Martin -> Sales Manager
    '2': '3', // Sophie Dubois -> Director
    '3': '1'  // Philippe Legrand -> Consultant
  };

  const handleDragStart = (userId: string) => {
    setDraggedUser(userId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (roleId: string) => {
    if (draggedUser) {
      setUserAssignments(prev => ({ ...prev, [draggedUser]: roleId as '1' | '2' | '3' }));
      setDraggedUser(null);
      
      // Mark user as completed
      if (!completedUsers.includes(draggedUser)) {
        setCompletedUsers(prev => [...prev, draggedUser]);
      }
    }
  };

  const handleVerify = () => {
    setShowVerification(true);
    const allCorrect = Object.entries(expectedAssignments).every(
      ([userId, expectedRole]) => userAssignments[userId] === expectedRole
    );
    if (allCorrect) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const handleReset = () => {
    setUserAssignments({});
    setShowVerification(false);
    setCompletedUsers([]);
    setDraggedUser(null);
  };

  const handleUnassignUser = (userId: string) => {
    if (!showVerification) {
      setUserAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[userId];
        return newAssignments;
      });
      setCompletedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleUserClick = (userId: string) => {
    if (!showVerification && !userAssignments[userId]) {
      setSelectedUser(selectedUser === userId ? null : userId);
    }
  };

  const handleRoleClick = (roleId: string) => {
    if (selectedUser && !showVerification) {
      setUserAssignments(prev => ({ ...prev, [selectedUser]: roleId as '1' | '2' | '3' }));
      setSelectedUser(null);
      
      if (!completedUsers.includes(selectedUser)) {
        setCompletedUsers(prev => [...prev, selectedUser]);
      }
    }
  };

  const getPermissionIcon = (permission: string) => {
    if (permission.includes('clients')) return <Users className="h-4 w-4" />;
    if (permission.includes('produits')) return <FileText className="h-4 w-4" />;
    if (permission.includes('commandes')) return <ShoppingCart className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-blue-800 font-medium text-sm sm:text-base">L'approche RBAC</h3>
            <p className="text-blue-700 mt-1 text-sm sm:text-base">
              Le contrôle d'accès basé sur les rôles (RBAC) simplifie la gestion des permissions en les attribuant à des rôles plutôt qu'à des utilisateurs individuels.
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <p className="text-blue-700 text-sm">Héritage: Les rôles peuvent hériter des permissions d'autres rôles, créant une hiérarchie naturelle.</p>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <p className="text-blue-700 text-sm">Moindre privilège: Chaque utilisateur reçoit uniquement les accès nécessaires à sa fonction.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center flex-1">
          <Users className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600">
            Progression: {completedUsers.length}/3 utilisateurs assignés
          </span>
          <div className="flex-1 mx-2 sm:mx-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(completedUsers.length / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
        {showVerification && !Object.entries(expectedAssignments).every(
          ([userId, expectedRole]) => userAssignments[userId] === expectedRole
        ) && (
          <button
            onClick={handleReset}
            className="px-3 sm:px-4 py-2 bg-gray-500 text-white text-xs sm:text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
          >
            <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Réessayer</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6">
        {/* Users List */}
        <div className="sm:col-span-4">
          <div className="flex items-center mb-3 sm:mb-4">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2 flex-shrink-0" />
            <h2 className="text-base sm:text-lg font-medium">Utilisateurs à assigner</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {users.map(user => {
              const isAssigned = userAssignments[user.id];
              const isCorrect = showVerification && userAssignments[user.id] === expectedAssignments[user.id];
              const isSelected = selectedUser === user.id;
              
              return (
                <div
                  key={user.id}
                  draggable={!isAssigned && !showVerification}
                  onDragStart={() => handleDragStart(user.id)}
                  onClick={() => handleUserClick(user.id)}
                  className={`p-3 sm:p-4 rounded-lg border transition-all ${
                    isAssigned 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'border-gray-200 hover:border-blue-500 cursor-pointer'
                  } ${draggedUser === user.id || isSelected ? 'border-blue-500 bg-blue-50' : ''}`}
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
                    {isAssigned && showVerification && (
                      isCorrect 
                        ? <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                        : <div className="text-red-500 font-medium text-sm sm:text-base">✗</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roles List */}
        <div className="sm:col-span-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2 flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-medium">Rôles et permissions</h2>
            </div>
            {completedUsers.length === users.length && !showVerification && (
              <button
                onClick={handleVerify}
                className="px-3 sm:px-4 py-2 bg-green-500 text-white text-xs sm:text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                Vérifier les assignations
              </button>
            )}
          </div>
          <div className="space-y-4 sm:space-y-6">
            {roles.map(role => {
              const assignedUsers = users.filter(user => userAssignments[user.id] === role.id);
              
              return (
                <div
                  key={role.id}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(role.id)}
                  onClick={() => handleRoleClick(role.id)}
                  className={`bg-gray-50 p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    draggedUser || selectedUser ? 'border-blue-300 bg-blue-50 cursor-pointer' : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">{role.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{role.description}</p>
                    </div>
                    {assignedUsers.length > 0 && (
                      <div className="flex -space-x-2">
                        {assignedUsers.map(user => (
                          <div
                            key={user.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnassignUser(user.id);
                            }}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-600 ${
                              showVerification ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 hover:border-blue-500'
                            } transition-all`}
                            title={showVerification ? undefined : "Cliquez pour retirer l'utilisateur"}
                          >
                            {user.avatar}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {role.permissions.map(permission => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 bg-white p-2 rounded"
                      >
                        {getPermissionIcon(permission)}
                        <span className="line-clamp-1">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed bottom-4 left-0 right-0 text-center px-4 pointer-events-none">
          <div className="bg-blue-600 text-white py-2 px-4 rounded-lg inline-block text-sm">
            Sélectionnez un rôle pour {users.find(u => u.id === selectedUser)?.name}
          </div>
        </div>
      )}
    </div>
  );
}; 