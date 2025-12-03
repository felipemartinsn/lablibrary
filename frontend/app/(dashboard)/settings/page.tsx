'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Settings } from 'lucide-react'

interface SettingsData {
  maxFinesLimit: number
  blockDurationDays: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    maxFinesLimit: 3,
    blockDurationDays: 7,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings')
      setSettings(response.data.data)
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar configurações',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/settings', settings)
      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso',
      })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao salvar configurações',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <Settings className="w-6 h-6" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>
            Configure os limites e regras do sistema de gerenciamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxFinesLimit">Limite Máximo de Advertências</Label>
            <Input
              id="maxFinesLimit"
              type="number"
              min="1"
              value={settings.maxFinesLimit}
              onChange={(e) =>
                setSettings({ ...settings, maxFinesLimit: parseInt(e.target.value) })
              }
            />
            <p className="text-sm text-muted-foreground">
              Número máximo de advertências ativas antes de bloquear o usuário
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockDurationDays">Duração do Bloqueio (dias)</Label>
            <Input
              id="blockDurationDays"
              type="number"
              min="1"
              value={settings.blockDurationDays}
              onChange={(e) =>
                setSettings({ ...settings, blockDurationDays: parseInt(e.target.value) })
              }
            />
            <p className="text-sm text-muted-foreground">
              Número de dias que o usuário ficará bloqueado após atingir o limite
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

