import { LoginChallenge } from '../components/challenges/LoginChallenge';
import { AuthorizationChallenge } from '../components/challenges/AuthorizationChallenge';
import { PermissionsChallenge } from '../components/challenges/PermissionsChallenge';
import { RBACChallenge } from '../components/challenges/RBACChallenge';
import { LeastPrivilegeChallenge } from '../components/challenges/LeastPrivilegeChallenge';
import { FederatedIdentityChallenge } from '../components/challenges/FederatedIdentityChallenge';

export const challenges = [
  {
    id: 'auth',
    title: 'Authentication',
    description: "Découvrez l'importance de l'authentification forte",
    principle: "L'authentification est le processus de vérification de l'identité d'un utilisateur. Dans ce défi, vous devez trouver les identifiants en exploitant les faiblesses de sécurité.",
    completed: false,
    component: LoginChallenge,
    content: {
      intro: "Vous êtes face à une page de connexion vulnérable. Trouvez les identifiants en utilisant les indices fournis. Le nom d'utilisateur et le mot de passe sont liés à notre entreprise!",
      simulation: {
        type: "login",
        username: "exalt",
        password: "shield"
      },
      lessons: [
        "Les mots de passe faibles sont facilement devinables",
        "Les messages d'erreur détaillés peuvent révéler des informations sensibles",
        "L'absence de rate limiting permet les attaques par force brute",
        "Le manque de CAPTCHA facilite l'automatisation des attaques",
        "Les indices de sécurité peuvent compromettre les credentials"
      ]
    }
  },
  {
    id: 'authz',
    title: 'Autorisation',
    description: "Comprendre les différents niveaux d'accès",
    principle: "L'autorisation détermine ce qu'un utilisateur authentifié peut faire",
    completed: false,
    component: AuthorizationChallenge,
    content: {
      intro: "Vous êtes connecté en tant qu'utilisateur standard. Explorez l'interface et trouvez un moyen d'accéder au panneau d'administration.",
      simulation: {
        type: "interface",
        role: "user",
        vulnerabilities: [
          {
            type: "directAccess",
            path: "/admin",
            hint: "Essayez de modifier l'URL"
          },
          {
            type: "hiddenElement",
            selector: "#adminPanel",
            hint: "Inspectez le code source"
          }
        ]
      },
      lessons: [
        "Ne jamais faire confiance uniquement à l'interface utilisateur pour la sécurité",
        "Vérifier les autorisations côté serveur pour chaque requête",
        "Implémenter une matrice de contrôle d'accès claire",
        "Principe du moindre privilège: donner uniquement les accès nécessaires"
      ]
    }
  },
  {
    id: 'identity',
    title: 'Identité Fédérée',
    description: 'La gestion centralisée des identités numériques',
    principle: "L'identité fédérée permet de centraliser et de sécuriser l'authentification à travers plusieurs systèmes.",
    completed: false,
    component: FederatedIdentityChallenge,
    content: {
      intro: "Découvrez comment configurer un système d'identité fédérée pour sécuriser l'accès à vos applications. Vous allez comprendre les avantages de la centralisation des identités et l'importance d'une gestion unifiée des accès.",
      simulation: {
        type: "federated"
      },
      lessons: [
        "La gestion centralisée des identités réduit les risques de sécurité",
        "Le Single Sign-On (SSO) améliore l'expérience utilisateur tout en renforçant la sécurité",
        "Une validation rigoureuse des identités est essentielle",
        "La surveillance des activités suspectes est facilitée par la centralisation"
      ]
    }
  },
  {
    id: 'access-control',
    title: 'Contrôle d\'Accès',
    description: "Maîtriser les contrôles d'accès",
    principle: "Le contrôle d'accès gère qui peut accéder à quoi",
    completed: false,
    content: {
      intro: "Vous êtes dans une bibliothèque numérique. Certains documents sont restreints. Trouvez les failles dans le système de contrôle d'accès.",
      simulation: {
        type: "library",
        documents: [
          {
            id: "doc1",
            title: "Document Public",
            access: "public"
          },
          {
            id: "doc2",
            title: "Document Confidentiel",
            access: "restricted",
            vulnerability: "parameterTampering"
          }
        ]
      },
      lessons: [
        "Validation des paramètres de requête",
        "Vérification des droits à chaque niveau",
        "Journalisation des tentatives d'accès",
        "Principe de défense en profondeur"
      ]
    }
  },
  {
    id: 'rbac',
    title: 'RBAC',
    description: "Comprendre les rôles et les permissions",
    principle: "Le RBAC attribue des permissions basées sur les rôles",
    completed: false,
    component: RBACChallenge,
    content: {
      intro: "Vous devez configurer un système RBAC pour une entreprise. Attribuez les bons rôles et permissions aux utilisateurs.",
      simulation: {
        type: "rbac",
        roles: [
          {
            name: "user",
            permissions: ["read"]
          },
          {
            name: "editor",
            permissions: ["read", "write"]
          },
          {
            name: "admin",
            permissions: ["read", "write", "delete"]
          }
        ],
        challenge: "Trouvez la configuration optimale"
      },
      lessons: [
        "Séparation des privilèges",
        "Héritage des rôles",
        "Principe de moindre privilège",
        "Audit des attributions de rôles"
      ]
    }
  },
  {
    id: 'permissions',
    title: 'Permissions',
    description: "Gérer les privilèges utilisateurs",
    principle: "Les permissions définissent les actions autorisées",
    completed: false,
    component: PermissionsChallenge,
    content: {
      intro: "Explorez un système de fichiers virtuel et trouvez les failles dans les permissions des fichiers.",
      simulation: {
        type: "filesystem",
        files: [
          {
            path: "/public/doc.txt",
            permissions: "644"
          },
          {
            path: "/private/secret.txt",
            permissions: "600",
            vulnerability: "symbolicLink"
          }
        ]
      },
      lessons: [
        "Comprendre les permissions UNIX",
        "Protection contre les liens symboliques",
        "Isolation des ressources sensibles",
        "Audit régulier des permissions"
      ]
    }
  },
  {
    id: 'least-privilege',
    title: 'Moindre Privilège',
    description: "Appliquer le principe du moindre privilège",
    principle: "Donner uniquement les accès nécessaires à chaque rôle",
    completed: false,
    component: LeastPrivilegeChallenge,
    content: {
      intro: "Vous devez configurer les permissions pour différents rôles en suivant le principe du moindre privilège. Trouvez le juste équilibre entre sécurité et fonctionnalité.",
      simulation: {
        type: "privileges",
        roles: [
          {
            name: "developer",
            requiredPrivileges: ["deploy_code", "review_code", "read_logs"]
          },
          {
            name: "auditor",
            requiredPrivileges: ["read_logs", "view_expenses"]
          },
          {
            name: "hr_manager",
            requiredPrivileges: ["create_users", "approve_expenses", "view_expenses"]
          },
          {
            name: "sysadmin",
            requiredPrivileges: ["monitor_systems", "configure_systems", "backup_data", "restore_data"]
          }
        ]
      },
      lessons: [
        "Identification des privilèges minimaux nécessaires",
        "Réduction des surfaces d'attaque",
        "Compartimentalisation des services",
        "Surveillance des élévations de privilèges"
      ]
    }
  }
];