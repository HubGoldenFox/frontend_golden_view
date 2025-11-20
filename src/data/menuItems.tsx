import {
  BarChart2,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  FileText,
  Home,
  Phone,
  Settings,
  Shield,
  User,
  Users,
  UsersRound,
} from 'lucide-react'

interface MenuItem {
  id: string
  path: string
  title: string
  icon: React.ReactNode
  enabled?: boolean
  children?: MenuItem[]
}

export const menuAdmin: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <Home className="h-5 w-5" />,
    enabled: true,
  },

  {
    id: 'calls',
    title: 'Atendimentos',
    path: '/admin/atendimentos',
    icon: <Phone className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'enterprises',
    title: 'Empresas',
    path: '/admin/empresas',
    icon: <Building2 className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'users',
    title: 'Usuários',
    path: '/admin/usuarios',
    icon: <Users className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'roles',
    title: 'Papéis',
    path: '/admin/papeis',
    icon: <Shield className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'teams',
    title: 'Equipes',
    path: '/admin/equipes',
    icon: <UsersRound className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'schedule',
  //   title: 'Agenda',
  //   path: '/admin/schedule',
  //   icon: <Calendar size={20} />,
  //   enabled: true,
  // },
  // {
  //   id: 'trainings',
  //   title: 'Treinamentos',
  //   path: '/admin/trainings',
  //   icon: <BookOpen className="h-5 w-5" />,
  //   enabled: true,
  // },
  {
    id: 'analytics',
    title: 'Análises',
    path: '/admin/analises',
    icon: <Brain className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'reports',
    title: 'Relatórios',
    path: '/admin/relatorios',
    icon: <FileText className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'settings',
    title: 'Configurações',
    path: '/admin/configuracoes',
    icon: <Settings className="h-5 w-5" />,
    enabled: true,
  },
]

export const menuGestor: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: <Home className="h-5 w-5" />,
    enabled: true,
  },

  {
    id: 'calls',
    title: 'Atendimentos',
    path: '/admin/atendimentos',
    icon: <Phone className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'enterprises',
  //   title: 'Empresas',
  //   path: '/admin/empresas',
  //   icon: <Building2 className="h-5 w-5" />,
  //   enabled: true,
  // },
  {
    id: 'users',
    title: 'Usuários',
    path: '/admin/usuarios',
    icon: <Users className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'roles',
    title: 'Papéis',
    path: '/admin/papeis',
    icon: <Shield className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'teams',
    title: 'Equipes',
    path: '/admin/equipes',
    icon: <UsersRound className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'schedule',
  //   title: 'Agenda',
  //   path: '/admin/schedule',
  //   icon: <Calendar size={20} />,
  //   enabled: true,
  // },
  // {
  //   id: 'trainings',
  //   title: 'Treinamentos',
  //   path: '/admin/trainings',
  //   icon: <BookOpen className="h-5 w-5" />,
  //   enabled: true,
  // },
  {
    id: 'analytics',
    title: 'Análises',
    path: '/admin/analises',
    icon: <Brain className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'reports',
    title: 'Relatórios',
    path: '/admin/relatorios',
    icon: <FileText className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'settings',
  //   title: 'Configurações',
  //   path: '/admin/configuracoes',
  //   icon: <Settings className="h-5 w-5" />,
  //   enabled: true,
  // },
]

export const menuTenantAdmin = (path: string) => {
  return [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: `/${path}/admin/dashboard`,
      icon: <Home className="h-5 w-5" />,
      enabled: true,
    },

    {
      id: 'calls',
      title: 'Atendimentos',
      path: `/${path}/admin/atendimentos`,
      icon: <Phone className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'enterprises',
    //   title: 'Empresas',
    //   path: `/${path}/admin/empresas`,
    //   icon: <Building2 className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'users',
      title: 'Usuários',
      path: `/${path}/admin/usuarios`,
      icon: <Users className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'roles',
      title: 'Papéis',
      path: `/${path}/admin/papeis`,
      icon: <Shield className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'teams',
      title: 'Equipes',
      path: `/${path}/admin/equipes`,
      icon: <UsersRound className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'schedule',
    //   title: 'Agenda',
    //   path: '/admin/schedule',
    //   icon: <Calendar size={20} />,
    //   enabled: true,
    // },
    // {
    //   id: 'trainings',
    //   title: 'Treinamentos',
    //   path: '/admin/trainings',
    //   icon: <BookOpen className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'analytics',
      title: 'Análises',
      path: `/${path}/admin/analises`,
      icon: <Brain className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'reports',
      title: 'Relatórios',
      path: `/${path}/admin/relatorios`,
      icon: <FileText className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'settings',
      title: 'Configurações',
      path: `/${path}/admin/configuracoes`,
      icon: <Settings className="h-5 w-5" />,
      enabled: true,
    },
  ]
}

export const menuTenantGestor = (path: string) => {
  return [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: `/${path}/admin/dashboard`,
      icon: <Home className="h-5 w-5" />,
      enabled: true,
    },

    {
      id: 'calls',
      title: 'Atendimentos',
      path: `/${path}/admin/atendimentos`,
      icon: <Phone className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'users',
      title: 'Usuários',
      path: `/${path}/admin/usuarios`,
      icon: <Users className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'roles',
    //   title: 'Papéis',
    //   path: `/${path}/admin/papeis`,
    //   icon: <Shield className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'teams',
      title: 'Equipes',
      path: `/${path}/admin/equipes`,
      icon: <UsersRound className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'schedule',
    //   title: 'Agenda',
    //   path: '/admin/schedule',
    //   icon: <Calendar size={20} />,
    //   enabled: true,
    // },
    // {
    //   id: 'trainings',
    //   title: 'Treinamentos',
    //   path: '/admin/trainings',
    //   icon: <BookOpen className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'analytics',
      title: 'Análises',
      path: `/${path}/admin/analises`,
      icon: <Brain className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'reports',
      title: 'Relatórios',
      path: `/${path}/admin/relatorios`,
      icon: <FileText className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'settings',
    //   title: 'Configurações',
    //   path: `/${path}/admin/configuracoes`,
    //   icon: <Settings className="h-5 w-5" />,
    //   enabled: true,
    // },
  ]
}

export const menuAtendente = (path: string) => {
  return [
    {
      id: 'attendant',
      icon: <Home size={20} />,
      title: 'Início',
      path: `/${path}/attendant`,
      enabled: true,
    },
    {
      id: 'calls',
      icon: <Phone size={20} />,
      title: 'Atendimentos',
      path: `/${path}/attendant/calls`,
      enabled: true,
    },
    {
      id: 'performance',
      icon: <BarChart2 size={20} />,
      title: 'Desempenho',
      path: `/${path}/attendant/performance`,
      enabled: true,
    },
    {
      id: 'schedule',
      icon: <Calendar size={20} />,
      title: 'Agenda',
      path: `/${path}/attendant/schedule`,
      enabled: true,
    },
    {
      id: 'training',
      icon: <BookOpen size={20} />,
      title: 'Treinamento',
      path: `/${path}/attendant/training`,
      enabled: true,
    },
    {
      id: 'profile',
      icon: <User size={20} />,
      title: 'Perfil',
      path: `/${path}/attendant/profile`,
    },
  ]
}
