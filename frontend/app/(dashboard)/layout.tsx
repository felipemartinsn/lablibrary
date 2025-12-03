'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  Package,
  FileText,
  AlertCircle,
  Calendar,
  Settings,
  BarChart3,
  LogOut,
  ClipboardList,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, logout, isAuthenticated, loginFake } = useAuthStore()

  useEffect(() => {
    // Garante que sempre há um usuário fictício logado
    if (!isAuthenticated()) {
      loginFake()
    }
  }, [isAuthenticated, loginFake])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/users', label: 'Usuários', icon: Users },
    { href: '/materials', label: 'Materiais', icon: Package },
    { href: '/loans', label: 'Empréstimos', icon: BookOpen },
    { href: '/fines', label: 'Advertências', icon: AlertCircle },
    { href: '/reservations', label: 'Reservas', icon: Calendar },
    { href: '/settings', label: 'Configurações', icon: Settings },
    { href: '/audit-logs', label: 'Logs de Auditoria', icon: ClipboardList },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary">LabLibrary</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

