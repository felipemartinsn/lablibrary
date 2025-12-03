'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: number
  name: string
  email: string
  registrationNumber: string
  userType: string
  fineCount: number
  active: boolean
  blockedUntil?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [search])

  const fetchUsers = async () => {
    try {
      const params: any = { limit: 50 }
      if (search) params.search = search
      const response = await api.get('/users', { params })
      setUsers(response.data.data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar usuários',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (user: User) => {
    if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Bloqueado</span>
    }
    if (!user.active) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Inativo</span>
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Ativo</span>
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <Button asChild>
          <Link href="/users/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou matrícula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Matrícula</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Advertências</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.registrationNumber}</td>
                    <td className="p-2 capitalize">{user.userType}</td>
                    <td className="p-2">
                      {user.fineCount > 0 && (
                        <span className="flex items-center text-orange-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {user.fineCount}
                        </span>
                      )}
                      {user.fineCount === 0 && <span>0</span>}
                    </td>
                    <td className="p-2">{getStatusBadge(user)}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/users/${user.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

