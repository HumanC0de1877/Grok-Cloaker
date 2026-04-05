'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  Users,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Assinatura {
  id: string
  cliente: { name: string; email: string }
  plano: string
  valor: number
  status: 'Ativa' | 'Pausada' | 'Cancelada' | 'Pendente'
  proximaCobranca: string
  criadoEm: string
}

const mockAssinaturas: Assinatura[] = [
  { id: 'sub_001', cliente: { name: 'Maria Silva', email: 'maria@gmail.com' }, plano: 'Plano Mensal', valor: 49.90, status: 'Ativa', proximaCobranca: '15/04/2026', criadoEm: '15/01/2026' },
  { id: 'sub_002', cliente: { name: 'João Santos', email: 'joao@gmail.com' }, plano: 'Plano Anual', valor: 399.90, status: 'Ativa', proximaCobranca: '20/01/2027', criadoEm: '20/01/2026' },
  { id: 'sub_003', cliente: { name: 'Ana Costa', email: 'ana.costa@gmail.com' }, plano: 'Plano Mensal', valor: 49.90, status: 'Pausada', proximaCobranca: '-', criadoEm: '10/12/2025' },
  { id: 'sub_004', cliente: { name: 'Pedro Oliveira', email: 'pedro@outlook.com' }, plano: 'Plano Trimestral', valor: 129.90, status: 'Ativa', proximaCobranca: '01/05/2026', criadoEm: '01/02/2026' },
  { id: 'sub_005', cliente: { name: 'Carla Ferreira', email: 'carla@yahoo.com' }, plano: 'Plano Mensal', valor: 49.90, status: 'Cancelada', proximaCobranca: '-', criadoEm: '05/11/2025' },
]

export function AssinaturasDashboard() {
  const [assinaturas] = useState<Assinatura[]>(mockAssinaturas)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = assinaturas.filter(a => {
    const matchSearch = a.cliente.name.toLowerCase().includes(search.toLowerCase()) ||
                       a.cliente.email.toLowerCase().includes(search.toLowerCase()) ||
                       a.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status.toLowerCase() === statusFilter
    return matchSearch && matchStatus
  })

  const totalAssinaturas = assinaturas.length
  const assinaturasAtivas = assinaturas.filter(a => a.status === 'Ativa').length
  const receitaMensal = assinaturas.filter(a => a.status === 'Ativa').reduce((sum, a) => sum + a.valor, 0)

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginatedAssinaturas = filtered.slice((page - 1) * perPage, page * perPage)

  const statusColor: Record<Assinatura['status'], string> = {
    Ativa: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Pausada: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Cancelada: 'bg-red-500/15 text-red-400 border-red-500/30',
    Pendente: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Assinaturas</h1>
            <Badge variant="outline" className="rounded-full bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs">
              Beta
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Gerencie as assinaturas recorrentes dos seus clientes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                  <Users size={20} className="text-foreground/60" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total de Assinaturas</p>
                  <p className="text-2xl font-bold text-foreground">{totalAssinaturas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CreditCard size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assinaturas Ativas</p>
                  <p className="text-2xl font-bold text-emerald-400">{assinaturasAtivas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <TrendingUp size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Receita Recorrente</p>
                  <p className="text-2xl font-bold text-foreground">
                    R$ {receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State for Beta */}
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou ID..."
                  className="pl-9 rounded-xl bg-background/50 border-border/50"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] rounded-xl bg-background/50 border-border/50">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl gap-2">
                <Download size={16} />
                Exportar
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl">
                <RefreshCw size={16} />
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 bg-muted/20">
                    <TableHead className="text-xs font-semibold uppercase text-foreground/80">ID</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Plano</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Valor</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Status</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Próxima Cobrança</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Criado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssinaturas.map(assinatura => (
                    <TableRow key={assinatura.id} className="border-border/20 hover:bg-muted/10 transition-colors">
                      <TableCell className="text-foreground/80 font-medium text-sm">{assinatura.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{assinatura.cliente.name}</p>
                          <p className="text-xs text-foreground/60">{assinatura.cliente.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{assinatura.plano}</TableCell>
                      <TableCell className="text-cyan-400 font-medium text-sm">
                        R$ {assinatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full text-xs ${statusColor[assinatura.status]}`}>
                          {assinatura.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{assinatura.proximaCobranca}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{assinatura.criadoEm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-foreground/80">
                Mostrando {paginatedAssinaturas.length} de <span className="font-medium">{filtered.length} assinaturas</span>
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beta Notice */}
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-400">
            <span className="font-semibold">Funcionalidade em Beta:</span> O módulo de assinaturas está em fase de testes. 
            Algumas funcionalidades podem não estar disponíveis ou sofrer alterações.
          </p>
        </div>
      </div>
    </ScrollArea>
  )
}
