'use client'

import { Company, Group, Report, User } from '@/types/mockData'
import React, { createContext, useContext, useState } from 'react'
import {
  getInitialReports,
  INITIAL_COMPANIES,
  INITIAL_GROUPS,
  INITIAL_USERS,
} from '../lib/mockData'
import { generateId } from '../lib/utils'

interface DataContextType {
  users: User[]
  companies: Company[]
  groups: Group[]
  reports: Report[]

  // Actions
  addCompany: (data: Omit<Company, 'id' | 'createdAt'>) => void
  updateCompany: (id: string, data: Partial<Company>) => void

  addReport: (
    data: Omit<Report, 'id' | 'createdAt' | 'companyIds' | 'groupIds'>
  ) => void
  addBulkReports: (
    reports: Array<Omit<Report, 'id' | 'createdAt' | 'companyIds' | 'groupIds'>>
  ) => void
  assignReportToCompany: (reportId: string, companyId: string) => void

  // Group Logic
  toggleReportGroup: (reportId: string, groupId: string) => void // Toggle access

  addUser: (data: Omit<User, 'id'>) => void
  updateUser: (userId: string, data: Partial<User>) => void
  deleteUser: (userId: string) => void

  addGroup: (data: Omit<Group, 'id' | 'createdAt'>) => void
  updateGroup: (id: string, data: Partial<Group>) => void
  deleteGroup: (groupId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: React.PropsWithChildren) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS)
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES)
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS)
  const [reports, setReports] = useState<Report[]>(getInitialReports('admin'))

  // --- Companies ---
  const addCompany = (data: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      themeColor: '#4f46e5',
    }
    setCompanies([...companies, newCompany])
  }

  const updateCompany = (id: string, data: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    )
  }

  // --- Reports ---
  const addReport = (
    data: Omit<Report, 'id' | 'createdAt' | 'companyIds' | 'groupIds'>
  ) => {
    const newReport: Report = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      companyIds: [],
      groupIds: [],
    }
    setReports([...reports, newReport])
  }

  const addBulkReports = (
    newReportsData: Array<
      Omit<Report, 'id' | 'createdAt' | 'companyIds' | 'groupIds'>
    >
  ) => {
    const createdReports = newReportsData.map((data) => ({
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      companyIds: [],
      groupIds: [],
    }))
    setReports((prev) => [...prev, ...createdReports])
  }

  const assignReportToCompany = (reportId: string, companyId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId && !r.companyIds.includes(companyId)) {
          return { ...r, companyIds: [...r.companyIds, companyId] }
        }
        return r
      })
    )
  }

  const toggleReportGroup = (reportId: string, groupId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const exists = r.groupIds.includes(groupId)
          return {
            ...r,
            groupIds: exists
              ? r.groupIds.filter((id) => id !== groupId)
              : [...r.groupIds, groupId],
          }
        }
        return r
      })
    )
  }

  // --- Users ---
  const addUser = (data: Omit<User, 'id'>) => {
    const newUser: User = { ...data, id: generateId() }
    setUsers([...users, newUser])
  }

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...data } : u))
    )
  }

  const deleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  // --- Groups ---
  const addGroup = (data: Omit<Group, 'id' | 'createdAt'>) => {
    const newGroup: Group = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setGroups([...groups, newGroup])
  }

  const updateGroup = (id: string, data: Partial<Group>) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)))
  }

  const deleteGroup = (groupId: string) => {
    setGroups(groups.filter((g) => g.id !== groupId))
    // Also remove group from users
    setUsers((prev) =>
      prev.map((u) => ({
        ...u,
        groupIds: u.groupIds.filter((id) => id !== groupId),
      }))
    )
    // Also remove group from reports
    setReports((prev) =>
      prev.map((r) => ({
        ...r,
        groupIds: r.groupIds.filter((id) => id !== groupId),
      }))
    )
  }

  return (
    <DataContext.Provider
      value={{
        users,
        companies,
        groups,
        reports,
        addCompany,
        updateCompany,
        addReport,
        addBulkReports,
        assignReportToCompany,
        toggleReportGroup,
        addUser,
        updateUser,
        deleteUser,
        addGroup,
        updateGroup,
        deleteGroup,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
