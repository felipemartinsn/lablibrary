'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import api from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Plus, Search, Package } from 'lucide-react'
import Link from 'next/link'

interface Material {
  id: number
  internalCode: string
  title: string
  thematicArea: string
  materialType: string
  quantityTotal: number
  quantityAvailable: number
  conditionStatus: string
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchMaterials()
  }, [search])

  const fetchMaterials = async () => {
    try {
      const params: any = { limit: 50 }
      if (search) params.search = search
      const response = await api.get('/materials', { params })
      setMaterials(response.data.data || [])
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao carregar materiais',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getConditionBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      damaged: 'bg-yellow-100 text-yellow-800',
      maintenance: 'bg-orange-100 text-orange-800',
      lost: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    )
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Materiais</h1>
        <Button asChild>
          <Link href="/materials/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Material
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar por título, código ou área temática..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {material.internalCode}
                      </p>
                    </div>
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="capitalize">{material.materialType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Área:</span>
                      <span>{material.thematicArea}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Disponível:</span>
                      <span>
                        {material.quantityAvailable} / {material.quantityTotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Condição:</span>
                      {getConditionBadge(material.conditionStatus)}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                      <Link href={`/materials/${material.id}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

