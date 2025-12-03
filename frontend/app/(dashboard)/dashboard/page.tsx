'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { Users, Package, BookOpen, AlertCircle, Calendar } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DashboardStats {
  totalUsers: number
  blockedUsers: number
  totalMaterials: number
  activeLoans: number
  pendingReservations: number
  overdueLoans: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersRes = await api.get('/users?limit=1')
      const totalUsers = usersRes.data.pagination?.total || 0

      // Fetch blocked users
      const blockedRes = await api.get('/users?blocked=true&limit=1')
      const blockedUsers = blockedRes.data.pagination?.total || 0

      // Fetch materials
      const materialsRes = await api.get('/materials?limit=1')
      const totalMaterials = materialsRes.data.pagination?.total || 0

      // Fetch active loans
      const loansRes = await api.get('/loans?status=active&limit=1')
      const activeLoans = loansRes.data.pagination?.total || 0

      // Fetch overdue loans
      const overdueRes = await api.get('/loans?overdue=true&limit=1')
      const overdueLoans = overdueRes.data.pagination?.total || 0

      // Fetch reservations
      const reservationsRes = await api.get('/reservations?limit=1')
      const pendingReservations = reservationsRes.data.pagination?.total || 0

      setStats({
        totalUsers,
        blockedUsers,
        totalMaterials,
        activeLoans,
        pendingReservations,
        overdueLoans,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  const chartData = [
    { name: 'Usuários', value: stats?.totalUsers || 0 },
    { name: 'Materiais', value: stats?.totalMaterials || 0 },
    { name: 'Empréstimos', value: stats?.activeLoans || 0 },
    { name: 'Reservas', value: stats?.pendingReservations || 0 },
    { name: 'Atrasados', value: stats?.overdueLoans || 0 },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.blockedUsers || 0} bloqueados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materiais</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMaterials || 0}</div>
            <p className="text-xs text-muted-foreground">No acervo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empréstimos Ativos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeLoans || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.overdueLoans || 0} atrasados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReservations || 0}</div>
            <p className="text-xs text-muted-foreground">Aguardando liberação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Bloqueados</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats?.blockedUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">Com bloqueio ativo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geral</CardTitle>
            <CardDescription>Visão geral do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Comparação de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

