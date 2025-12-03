'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { ClipboardList } from 'lucide-react'
import { format } from 'date-fns'

interface AuditLog {
  id: number
  userId?: number
  entity: string
  actionType: string
  timestamp: string
  details: string
  user?: { name: string; email: string }
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await api.get('/audit-logs?limit=100')
      setLogs(response.data.data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar logs de auditoria',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
        <ClipboardList className="w-6 h-6" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Data/Hora</th>
                  <th className="text-left p-2">Entidade</th>
                  <th className="text-left p-2">Ação</th>
                  <th className="text-left p-2">Usuário</th>
                  <th className="text-left p-2">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {log.entity}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="p-2">
                      {log.user ? (
                        <div>
                          <div className="font-medium">{log.user.name}</div>
                          <div className="text-sm text-muted-foreground">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sistema</span>
                      )}
                    </td>
                    <td className="p-2">
                      <details className="cursor-pointer">
                        <summary className="text-sm text-muted-foreground">Ver detalhes</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(JSON.parse(log.details), null, 2)}
                        </pre>
                      </details>
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

