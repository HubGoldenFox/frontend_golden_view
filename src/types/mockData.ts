export enum UserRole {
  ADMIN = 'ADMIN',
  COMPANY_ADMIN = 'COMPANY_ADMIN',
  USER = 'USER',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  companyId?: string
  groupIds: string[] // Changed from teamId to allow multiple groups
  avatar?: string
  password?: string
}

export interface Company {
  id: string
  name: string
  cnpj?: string
  status: 'active' | 'inactive'
  createdAt: string
  logoUrl?: string
  themeColor?: string
}

export interface Group {
  id: string
  name: string
  companyId: string
  createdAt: string
  description?: string // Added description for better UX
}

export type ReportIntegrationType = 'powerbi' | 'custom'

export interface Report {
  id: string
  path: string
  icon?: React.ReactNode
  title: string
  description: string
  category: string
  createdAt: string
  status: 'active' | 'archived'

  // Content
  type: ReportIntegrationType
  contentUrl?: string // URL direta para Power BI
  embedCode?: string // HTML Raw para customizados

  // Relations
  companyIds: string[]
  groupIds: string[] // Changed from teamIds to groupIds
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface DashboardStats {
  totalUsers: number
  totalCompanies: number
  totalReports: number
  activeGroups: number
}
