import React, { useState } from 'react';
import { Users, Info, Shield, FileText, Code, Database, CheckCircle, AlertTriangle, X, Check } from 'lucide-react';

interface LeastPrivilegeChallengeProps {
  onSuccess: () => void;
}

interface Role {
  id: string;
  name: string;
  description: string;
  requiredTasks: string[];
}

interface Task {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: keyof typeof taskIcons;
}

const taskIcons = {
  'read_logs': FileText,
  'write_logs': FileText,
  'create_users': Users,
  'delete_users': Users,
  'approve_expenses': Database,
  'view_expenses': Database,
  'deploy_code': Code,
  'review_code': Code,
  'backup_data': Database,
  'restore_data': Database,
  'monitor_systems': Shield,
  'configure_systems': Shield,
} as const;

export const LeastPrivilegeChallenge: React.FC<LeastPrivilegeChallengeProps> = ({ onSuccess }) => {
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>({
    developer: [],
    auditor: [],
    hr_manager: [],
    sysadmin: []
  });
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, { tooMany: boolean; tooFew: boolean }>>({});

  const roles: Role[] = [
    {
      id: 'developer',
      name: 'Développeur',
      description: 'Développe et déploie le code',
      requiredTasks: ['deploy_code', 'review_code', 'read_logs']
    },
    {
      id: 'auditor',
      name: 'Auditeur',
      description: 'Examine les logs et les dépenses',
      requiredTasks: ['read_logs', 'view_expenses']
    },
    {
      id: 'hr_manager',
      name: 'Responsable RH',
      description: 'Gère les utilisateurs et les dépenses',
      requiredTasks: ['create_users', 'approve_expenses', 'view_expenses']
    },
    {
      id: 'sysadmin',
      name: 'Administrateur Système',
      description: 'Maintient l\'infrastructure',
      requiredTasks: ['monitor_systems', 'configure_systems', 'backup_data', 'restore_data']
    }
  ];

  const tasks: Task[] = [
    { id: 'read_logs', name: 'Lecture des logs', description: 'Voir les journaux système', category: 'Logs', icon: 'read_logs' },
    { id: 'write_logs', name: 'Écriture des logs', description: 'Modifier les journaux système', category: 'Logs', icon: 'write_logs' },
    { id: 'create_users', name: 'Créer des utilisateurs', description: 'Ajouter de nouveaux utilisateurs', category: 'Users', icon: 'create_users' },
    { id: 'delete_users', name: 'Supprimer des utilisateurs', description: 'Supprimer des utilisateurs existants', category: 'Users', icon: 'delete_users' },
    { id: 'approve_expenses', name: 'Approuver les dépenses', description: 'Valider les notes de frais', category: 'Finance', icon: 'approve_expenses' },
    { id: 'view_expenses', name: 'Voir les dépenses', description: 'Consulter les notes de frais', category: 'Finance', icon: 'view_expenses' },
    { id: 'deploy_code', name: 'Déployer le code', description: 'Mettre en production', category: 'Code', icon: 'deploy_code' },
    { id: 'review_code', name: 'Réviser le code', description: 'Examiner les changements', category: 'Code', icon: 'review_code' },
    { id: 'backup_data', name: 'Sauvegarder les données', description: 'Créer des backups', category: 'System', icon: 'backup_data' },
    { id: 'restore_data', name: 'Restaurer les données', description: 'Restaurer depuis backup', category: 'System', icon: 'restore_data' },
    { id: 'monitor_systems', name: 'Monitorer les systèmes', description: 'Surveiller la santé système', category: 'System', icon: 'monitor_systems' },
    { id: 'configure_systems', name: 'Configurer les systèmes', description: 'Modifier la configuration', category: 'System', icon: 'configure_systems' }
  ];

  const handleTogglePermission = (roleId: string, taskId: string) => {
    if (showResults) return;

    setRolePermissions(prev => {
      const newPermissions = { ...prev };
      if (newPermissions[roleId].includes(taskId)) {
        newPermissions[roleId] = newPermissions[roleId].filter(p => p !== taskId);
      } else {
        newPermissions[roleId] = [...newPermissions[roleId], taskId];
      }
      return newPermissions;
    });
  };

  const handleVerify = () => {
    const newFeedback: Record<string, { tooMany: boolean; tooFew: boolean }> = {};
    let allCorrect = true;

    roles.forEach(role => {
      const assignedPerms = rolePermissions[role.id];
      const requiredPerms = role.requiredTasks;
      
      // Check if all required permissions are assigned
      const hasAllRequired = requiredPerms.every(perm => assignedPerms.includes(perm));
      
      // Check if there are any unnecessary permissions
      const hasUnnecessary = assignedPerms.some(perm => !requiredPerms.includes(perm));
      
      newFeedback[role.id] = {
        tooMany: hasUnnecessary,
        tooFew: !hasAllRequired
      };

      if (hasUnnecessary || !hasAllRequired) {
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);
    setShowResults(true);

    if (allCorrect) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const handleReset = () => {
    setRolePermissions({
      developer: [],
      auditor: [],
      hr_manager: [],
      sysadmin: []
    });
    setShowResults(false);
    setFeedback({});
  };

  const getTaskIcon = (iconName: keyof typeof taskIcons) => {
    const IconComponent = taskIcons[iconName];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-blue-800 font-medium text-sm sm:text-base">Principe du moindre privilège</h3>
            <p className="text-blue-700 mt-1 text-sm sm:text-base">
              Chaque rôle doit avoir uniquement les permissions nécessaires à l'accomplissement de ses tâches - ni plus, ni moins.
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <p className="text-blue-700 text-sm">Trop de permissions augmente les risques de sécurité.</p>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <X className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <p className="text-blue-700 text-sm">Trop peu de permissions empêche les utilisateurs de travailler.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900">Assignez les permissions minimales nécessaires</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleVerify}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
          >
            Vérifier
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {roles.map(role => (
          <div 
            key={role.id}
            className={`bg-gray-50 p-3 sm:p-4 rounded-lg border-2 ${
              showResults
                ? feedback[role.id]?.tooMany
                  ? 'border-red-300'
                  : feedback[role.id]?.tooFew
                    ? 'border-orange-300'
                    : 'border-green-300'
                : 'border-transparent'
            }`}
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{role.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{role.description}</p>
                {showResults && (
                  <div className="mt-2">
                    {feedback[role.id]?.tooMany && (
                      <p className="text-red-600 text-xs sm:text-sm flex items-center">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Trop de permissions accordées
                      </p>
                    )}
                    {feedback[role.id]?.tooFew && (
                      <p className="text-orange-600 text-xs sm:text-sm flex items-center">
                        <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Permissions insuffisantes
                      </p>
                    )}
                    {!feedback[role.id]?.tooMany && !feedback[role.id]?.tooFew && (
                      <p className="text-green-600 text-xs sm:text-sm flex items-center">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Permissions optimales
                      </p>
                    )}
                  </div>
                )}
              </div>
              {showResults && !feedback[role.id]?.tooMany && !feedback[role.id]?.tooFew && (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
              )}
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleTogglePermission(role.id, task.id)}
                  className={`
                    flex items-center p-2 rounded cursor-pointer transition-all text-xs sm:text-sm
                    ${rolePermissions[role.id].includes(task.id)
                      ? 'bg-blue-100 hover:bg-blue-200'
                      : 'bg-white hover:bg-gray-100'
                    }
                    ${showResults && role.requiredTasks.includes(task.id) && 'ring-2 ring-green-300'}
                  `}
                >
                  {getTaskIcon(task.icon)}
                  <span className="ml-2 text-gray-600 line-clamp-1">{task.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 