import {
  BarChart2,
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Files,
  FileText,
  Home,
  Layers,
  LayoutDashboard,
  Phone,
  Settings,
  Shield,
  User,
  UserCircle,
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

export const menuAdmin = (path: string) => {
  return [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: `/${path}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
      enabled: true,
    },

    {
      id: 'companies',
      title: 'Empresas',
      path: `/${path}/empresas`,
      icon: <Building2 className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'users',
      title: 'Usuários',
      path: `/${path}/usuarios`,
      icon: <UserCircle className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'reports',
      title: 'Gestão Relatórios',
      path: `/${path}/relatorios`,
      icon: <Files className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'teams',
      title: 'Grupos Globais',
      path: `/${path}/grupos`,
      icon: <Layers className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'settings',
      title: 'Configurações',
      path: `/${path}/configuracoes`,
      icon: <Settings className="h-5 w-5" />,
      enabled: true,
    },
  ]
}

export const menuGestor: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    path: '/dashboard',
    icon: <Home className="h-5 w-5" />,
    enabled: true,
  },

  {
    id: 'calls',
    title: 'Atendimentos',
    path: '/atendimentos',
    icon: <Phone className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'enterprises',
  //   title: 'Empresas',
  //   path: '/empresas',
  //   icon: <Building2 className="h-5 w-5" />,
  //   enabled: true,
  // },
  {
    id: 'users',
    title: 'Usuários',
    path: '/usuarios',
    icon: <Users className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'roles',
    title: 'Papéis',
    path: '/papeis',
    icon: <Shield className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'teams',
    title: 'Equipes',
    path: '/equipes',
    icon: <UsersRound className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'schedule',
  //   title: 'Agenda',
  //   path: '/schedule',
  //   icon: <Calendar size={20} />,
  //   enabled: true,
  // },
  // {
  //   id: 'trainings',
  //   title: 'Treinamentos',
  //   path: '/trainings',
  //   icon: <BookOpen className="h-5 w-5" />,
  //   enabled: true,
  // },
  {
    id: 'analytics',
    title: 'Análises',
    path: '/analises',
    icon: <Brain className="h-5 w-5" />,
    enabled: true,
  },
  {
    id: 'reports',
    title: 'Relatórios',
    path: '/relatorios',
    icon: <FileText className="h-5 w-5" />,
    enabled: true,
  },
  // {
  //   id: 'settings',
  //   title: 'Configurações',
  //   path: '/configuracoes',
  //   icon: <Settings className="h-5 w-5" />,
  //   enabled: true,
  // },
]

export const menuTenantAdmin = (path: string) => {
  return [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: `/${path}/dashboard`,
      icon: <Home className="h-5 w-5" />,
      enabled: true,
    },

    {
      id: 'calls',
      title: 'Atendimentos',
      path: `/${path}/atendimentos`,
      icon: <Phone className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'enterprises',
    //   title: 'Empresas',
    //   path: `/${path}/empresas`,
    //   icon: <Building2 className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'users',
      title: 'Usuários',
      path: `/${path}/usuarios`,
      icon: <Users className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'roles',
      title: 'Papéis',
      path: `/${path}/papeis`,
      icon: <Shield className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'teams',
      title: 'Equipes',
      path: `/${path}/equipes`,
      icon: <UsersRound className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'schedule',
    //   title: 'Agenda',
    //   path: '/schedule',
    //   icon: <Calendar size={20} />,
    //   enabled: true,
    // },
    // {
    //   id: 'trainings',
    //   title: 'Treinamentos',
    //   path: '/trainings',
    //   icon: <BookOpen className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'analytics',
      title: 'Análises',
      path: `/${path}/analises`,
      icon: <Brain className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'reports',
      title: 'Relatórios',
      path: `/${path}/relatorios`,
      icon: <FileText className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'settings',
      title: 'Configurações',
      path: `/${path}/configuracoes`,
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
      path: `/${path}/dashboard`,
      icon: <Home className="h-5 w-5" />,
      enabled: true,
    },

    {
      id: 'calls',
      title: 'Atendimentos',
      path: `/${path}/atendimentos`,
      icon: <Phone className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'users',
      title: 'Usuários',
      path: `/${path}/usuarios`,
      icon: <Users className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'roles',
    //   title: 'Papéis',
    //   path: `/${path}/papeis`,
    //   icon: <Shield className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'teams',
      title: 'Equipes',
      path: `/${path}/equipes`,
      icon: <UsersRound className="h-5 w-5" />,
      enabled: true,
    },
    // {
    //   id: 'schedule',
    //   title: 'Agenda',
    //   path: '/schedule',
    //   icon: <Calendar size={20} />,
    //   enabled: true,
    // },
    // {
    //   id: 'trainings',
    //   title: 'Treinamentos',
    //   path: '/trainings',
    //   icon: <BookOpen className="h-5 w-5" />,
    //   enabled: true,
    // },
    {
      id: 'analytics',
      title: 'Análises',
      path: `/${path}/analises`,
      icon: <Brain className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: 'reports',
      title: 'Relatórios',
      path: `/${path}/relatorios`,
      icon: <FileText className="h-5 w-5" />,
      enabled: true,
    },
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
