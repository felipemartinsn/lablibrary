'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, BookOpen, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface Loan {
  id: number
  userId: number
  materialId: number
  loanDate: string
  dueDate: string
  returnDate?: string
  status: string
  user: { name: string; email: string }
  material: { title: string; internalCode: string }
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans?limit=50')
      setLoans(response.data.data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar empréstimos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReturn = async (loanId: number) => {
    try {
      await api.post(`/loans/${loanId}/return`, {})
      toast({
        title: 'Sucesso',
        description: 'Material devolvido com sucesso',
      })
      fetchLoans()
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao devolver material',
        variant: 'destructive',
      })
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Empréstimos</h1>
        <Button asChild>
          <Link href="/loans/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Empréstimo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Material</th>
                  <th className="text-left p-2">Usuário</th>
                  <th className="text-left p-2">Data Empréstimo</th>
                  <th className="text-left p-2">Vencimento</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{loan.material.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {loan.material.internalCode}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{loan.user.name}</div>
                        <div className="text-sm text-muted-foreground">{loan.user.email}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      {format(new Date(loan.loanDate), 'dd/MM/yyyy')}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center">
                        {format(new Date(loan.dueDate), 'dd/MM/yyyy')}
                        {loan.status === 'active' && isOverdue(loan.dueDate) && (
                          <AlertCircle className="w-4 h-4 text-red-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      {loan.status === 'active' && isOverdue(loan.dueDate) ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                          Atrasado
                        </span>
                      ) : loan.status === 'active' ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          Devolvido
                        </span>
                      )}
                    </td>
                    <td className="p-2">
                      {loan.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturn(loan.id)}
                        >
                          Devolver
                        </Button>
                      )}
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

