'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  RefreshCw,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageCircle,
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

interface Carrinho {
  id: number
  cliente: { name: string; email: string; items: number }
  etapa: { atual: number; total: number; label: string }
  valor: number
  ultimaVisita: string
}

const mockCarrinhos: Carrinho[] = [
  { id: 1, cliente: { name: 'MAria', email: 'clarinhagomes021@gmail.com', items: 1 }, etapa: { atual: 1, total: 4, label: 'Abandonou nos dados pessoais' }, valor: 137.90, ultimaVisita: '01/04 às 18:55' },
  { id: 2, cliente: { name: 'dasdasdsad', email: 'asdsadsa@gmail.com', items: 1 }, etapa: { atual: 2, total: 4, label: 'Abandonou no endereço' }, valor: 137.90, ultimaVisita: '29/03 às 14:49' },
  { id: 3, cliente: { name: 'dasdas asdas', email: '', items: 1 }, etapa: { atual: 1, total: 4, label: 'Abandonou nos dados pessoais' }, valor: 197.90, ultimaVisita: '26/03 às 18:56' },
  { id: 4, cliente: { name: 'asdasdasd', email: 'asdasdasdas', items: 1 }, etapa: { atual: 1, total: 4, label: 'Abandonou nos dados pessoais' }, valor: 197.90, ultimaVisita: '26/03 às 16:54' },
  { id: 5, cliente: { name: 'dasdasdas', email: 'dasdasda@gmail.com', items: 1 }, etapa: { atual: 2, total: 4, label: 'Abandonou no endereço' }, valor: 197.90, ultimaVisita: '26/03 às 16:45' },
  { id: 6, cliente: { name: 'Pamela oliveira', email: 'paamysilva39@gmail.com', items: 1 }, etapa: { atual: 1, total: 4, label: 'Abandonou nos dados pessoais' }, valor: 29.90, ultimaVisita: '09/12 às 15:48' },
  { id: 7, cliente: { name: 'Amanda Camargo Bastos', email: 'pessoalamandabastos@gmail.com', items: 1 }, etapa: { atual: 2, total: 4, label: 'Abandonou no endereço' }, valor: 29.90, ultimaVisita: '09/12 às 11:21' },
  { id: 8, cliente: { name: 'Alexsandra PITHAN mendo', email: 'alexsandra.mendo@gmail.com', items: 1 }, etapa: { atual: 2, total: 4, label: 'Abandonou no endereço' }, valor: 137.90, ultimaVisita: '08/12 às 18:41' },
  { id: 9, cliente: { name: 'dsadas das das', email: 'dsadas@gmail.com', items: 1 }, etapa: { atual: 2, total: 4, label: 'Abandonou no endereço' }, valor: 29.90, ultimaVisita: '07/12 às 22:33' },
  { id: 10, cliente: { name: 'asdasda sadasd', email: 'dsadasdas@gmail.com', items: 1 }, etapa: { atual: 2, total: 4, label: 'Abandonou no endereço' }, valor: 29.90, ultimaVisita: '06/12 às 12:58' },
]

export function CarrinhosAbandonadosDashboard() {
  const [carrinhos] = useState<Carrinho[]>(mockCarrinhos)
  const [search, setSearch] = useState('')
  const [etapaFilter, setEtapaFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 10

  const filtered = carrinhos.filter(c => {
    const matchSearch = c.cliente.name.toLowerCase().includes(search.toLowerCase()) ||
                       c.cliente.email.toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  const totalCarrinhos = filtered.length
  const valorTotal = filtered.reduce((sum, c) => sum + c.valor, 0)
  const mediaPorCarrinho = totalCarrinhos > 0 ? valorTotal / totalCarrinhos : 0

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginatedCarrinhos = filtered.slice((page - 1) * perPage, page * perPage)

  function EtapaIndicator({ atual, total }: { atual: number; total: number }) {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < atual ? 'bg-emerald-400' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Carrinhos Abandonados</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-foreground/80">Visualize</span> e recupere carrinhos abandonados pelos clientes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <p className="text-xs text-foreground/80 mb-1">Total de Carrinhos</p>
              <p className="text-2xl font-bold text-foreground">{totalCarrinhos}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <p className="text-xs text-foreground/80 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">Média por Carrinho</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {mediaPorCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-9 rounded-xl bg-card/80 border-border/50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-card/80">
              <Calendar size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">dd/mm/aaaa</span>
            </div>
            <span className="text-sm text-muted-foreground">até</span>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 bg-card/80">
              <Calendar size={14} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">dd/mm/aaaa</span>
            </div>
          </div>
          <Select value={etapaFilter} onValueChange={setEtapaFilter}>
            <SelectTrigger className="w-[160px] rounded-xl bg-card/80 border-border/50">
              <SelectValue placeholder="Todas as etapas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todas as etapas</SelectItem>
              <SelectItem value="dados">Dados pessoais</SelectItem>
              <SelectItem value="endereco">Endereço</SelectItem>
              <SelectItem value="pagamento">Pagamento</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl gap-2">
            <Download size={16} />
            Baixar CSV
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl">
            <RefreshCw size={16} />
          </Button>
        </div>

        {/* Table */}
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-xs font-semibold uppercase text-foreground/80 pl-6">Cliente</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Etapa</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Valor</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Última visita</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCarrinhos.map(carrinho => (
                  <TableRow key={carrinho.id} className="border-border/30 hover:bg-muted/10 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center">
                          <ShoppingCart size={18} className="text-foreground/60" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{carrinho.cliente.name}</p>
                          <p className="text-xs text-foreground/60">
                            {carrinho.cliente.email && `${carrinho.cliente.email} · `}
                            {carrinho.cliente.items} item
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <EtapaIndicator atual={carrinho.etapa.atual} total={carrinho.etapa.total} />
                        <p className="text-xs text-foreground/80">{carrinho.etapa.label}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-cyan-400 font-medium">
                      R$ {carrinho.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{carrinho.ultimaVisita}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl h-9 w-9 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                      >
                        <MessageCircle size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-foreground/80">
            Mostrando {paginatedCarrinhos.length} de <span className="font-medium">{filtered.length} carrinhos</span>
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
            {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? 'default' : 'outline'}
                size="icon"
                className={`rounded-xl h-8 w-8 ${page === i + 1 ? 'bg-foreground text-background hover:bg-foreground/90' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
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
      </div>
    </ScrollArea>
  )
}
