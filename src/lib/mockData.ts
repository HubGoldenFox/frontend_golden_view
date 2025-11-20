import { Company, Group, Report, User, UserRole } from '@/types/mockData'

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Acme Corp',
    cnpj: '12.345.678/0001-90',
    status: 'active',
    createdAt: new Date().toISOString(),
    themeColor: '#0f172a',
  },
  {
    id: 'c2',
    name: 'Globex Inc',
    cnpj: '98.765.432/0001-10',
    status: 'active',
    createdAt: new Date().toISOString(),
    themeColor: '#ea580c',
  },
]

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Diretoria',
    companyId: 'c1',
    createdAt: new Date().toISOString(),
    description: 'Acesso total aos relatórios financeiros.',
  },
  {
    id: 'g2',
    name: 'Vendas',
    companyId: 'c1',
    createdAt: new Date().toISOString(),
    description: 'Relatórios comerciais e metas.',
  },
  {
    id: 'g3',
    name: 'Operacional',
    companyId: 'c1',
    createdAt: new Date().toISOString(),
    description: 'Acompanhamento diário.',
  },
]

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'admin@nexreport.com',
    role: UserRole.ADMIN,
    groupIds: [],
  },
  {
    id: 'u2',
    name: 'Gestor Acme',
    email: 'gestor@acme.com',
    role: UserRole.COMPANY_ADMIN,
    companyId: 'c1',
    groupIds: [],
  },
  {
    id: 'u3',
    name: 'João Vendedor',
    email: 'joao@acme.com',
    role: UserRole.USER,
    companyId: 'c1',
    groupIds: ['g2'],
  }, // Apenas Vendas
  {
    id: 'u4',
    name: 'Maria Diretora',
    email: 'maria@acme.com',
    role: UserRole.USER,
    companyId: 'c1',
    groupIds: ['g1', 'g2'],
  }, // Diretoria e Vendas
]

// HTML de exemplo para um dashboard simples e bonito
const SAMPLE_HTML_DASHBOARD = `
<div style="font-family: sans-serif; color: #333; padding: 20px;">
  <h2 style="margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Status do Sistema Operacional</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center;">
      <h3 style="margin: 0; color: #166534; font-size: 14px; text-transform: uppercase;">Servidores Online</h3>
      <p style="font-size: 32px; font-weight: bold; color: #15803d; margin: 10px 0;">98.5%</p>
      <span style="font-size: 12px; color: #166534;">↑ 2% vs mês anterior</span>
    </div>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; text-align: center;">
      <h3 style="margin: 0; color: #1e40af; font-size: 14px; text-transform: uppercase;">Requisições/seg</h3>
      <p style="font-size: 32px; font-weight: bold; color: #1d4ed8; margin: 10px 0;">1,240</p>
      <span style="font-size: 12px; color: #1e40af;">Estável</span>
    </div>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; text-align: center;">
      <h3 style="margin: 0; color: #991b1b; font-size: 14px; text-transform: uppercase;">Incidentes</h3>
      <p style="font-size: 32px; font-weight: bold; color: #b91c1c; margin: 10px 0;">0</p>
      <span style="font-size: 12px; color: #991b1b;">Últimas 24h</span>
    </div>
  </div>
  <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
    <h4 style="margin-top: 0;">Log de Atividades Recentes</h4>
    <ul style="list-style: none; padding: 0; font-size: 14px;">
      <li style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">✅ 10:00 - Backup automático realizado com sucesso.</li>
      <li style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">✅ 09:45 - Deploy da versão v2.1.0 completado.</li>
      <li style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">⚠️ 08:30 - Latência detectada na região US-East (Resolvido).</li>
    </ul>
  </div>
</div>
`

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'r1',
    title: 'Retail Analysis Sample',
    description: 'Análise de vendas de varejo (Microsoft Sample).',
    category: 'Vendas',
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'powerbi',
    // Link público oficial da Microsoft para demonstração
    contentUrl:
      'https://app.powerbi.com/view?r=eyJrIjoiM2I0NGY3M2EtZGI0Ny00KDMyLWE4YjktNDQ4YjA4ZGQ2ZDM4IiwidCI6IjMyN2Y4YjFiLTk0Y2MtNDM2ZC1iMzQ1LTg2ODc5YjlhM2IyZSJ9',
    companyIds: ['c1'],
    groupIds: ['g1', 'g2'],
  },
  {
    id: 'r2',
    title: 'Regional Sales Analysis',
    description: 'Performance por região geográfica.',
    category: 'Financeiro',
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'powerbi',
    // Reutilizando o link de demo pois links públicos reais são escassos, mas simulando outro report
    contentUrl:
      'https://app.powerbi.com/view?r=eyJrIjoiM2I0NGY3M2EtZGI0Ny00KDMyLWE4YjktNDQ4YjA4ZGQ2ZDM4IiwidCI6IjMyN2Y4YjFiLTk0Y2MtNDM2ZC1iMzQ1LTg2ODc5YjlhM2IyZSJ9',
    companyIds: ['c1', 'c2'],
    groupIds: ['g1'],
  },
  {
    id: 'r3',
    title: 'Painel Operacional IT',
    description: 'Status dos servidores em tempo real (HTML Custom).',
    category: 'Operações',
    status: 'active',
    createdAt: new Date().toISOString(),
    type: 'custom',
    embedCode: SAMPLE_HTML_DASHBOARD,
    companyIds: ['c1'],
    groupIds: ['g3'],
  },
]
