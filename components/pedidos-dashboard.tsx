'use client'

import { useState } from 'react'
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  Columns3,
  Check,
  MoreHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PedidoDetalhes } from './pedido-detalhes'

interface Pedido {
  id: string
  cliente: { name: string; email: string }
  pais: string
  data: string
  total: number
  status: 'Pendente' | 'Pago' | 'Enviado' | 'Entregue' | 'Cancelado'
  pagamento: 'Pago' | 'Pendente' | 'Falhou'
  formaEntrega: string
  rastreio: 'pendente' | 'enviado' | 'entregue'
  pixCopiado: boolean
  comprovante: boolean
}

const mockPedidos: Pedido[] = [
  { id: '706de768', cliente: { name: 'lucsa sn', email: 'dasdadab@gmail.com' }, pais: 'BR', data: '01/04/2026, 21:26', total: 131.01, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'pendente', pixCopiado: false, comprovante: false },
  { id: '84abbc18', cliente: { name: 'dasdasasdas', email: 'dasdas@gmail.com' }, pais: 'BR', data: '30/03/2026, 02:17', total: 270.55, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'pendente', pixCopiado: false, comprovante: false },
  { id: 'c7ad0a6e', cliente: { name: 'asdasdsaa', email: 'adsad@gmail.com' }, pais: 'BR', data: '29/03/2026, 17:55', total: 131.01, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'enviado', pixCopiado: true, comprovante: false },
  { id: '215e81c4', cliente: { name: 'dasdas', email: 'adasdas@gmail.com' }, pais: 'BR', data: '29/03/2026, 14:59', total: 131.01, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'pendente', pixCopiado: false, comprovante: false },
  { id: 'be0732ac', cliente: { name: 'dasdasdas', email: 'dasdasz0@gmail.com' }, pais: 'BR', data: '29/03/2026, 14:57', total: 131.01, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'pendente', pixCopiado: true, comprovante: false },
  { id: '04682557', cliente: { name: 'dsadasdsa', email: 'dasdas@gmail.com' }, pais: 'BR', data: '29/03/2026, 14:54', total: 131.01, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'enviado', pixCopiado: true, comprovante: false },
  { id: 'd51b4029', cliente: { name: 'lucas santos', email: 'asdsdas@gmail.com' }, pais: 'BR', data: '29/03/2026, 14:49', total: 139.55, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'pendente', pixCopiado: true, comprovante: false },
  { id: '5d9a958f', cliente: { name: 'Julia Silva Alves', email: 'instahype20@gmail.com' }, pais: 'BR', data: '28/03/2026, 23:39', total: 123.41, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'enviado', pixCopiado: true, comprovante: false },
  { id: '346348b1', cliente: { name: 'teste oi', email: 'teste@gmail.com' }, pais: 'BR', data: '27/03/2026, 21:02', total: 188.01, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'enviado', pixCopiado: true, comprovante: false },
  { id: '706e5667', cliente: { name: 'lucassantos', email: 'mariabrito@gmail.cosom' }, pais: 'BR', data: '27/01/2026, 14:58', total: 29.90, status: 'Pendente', pagamento: 'Pago', formaEntrega: 'Correios - PAC', rastreio: 'pendente', pixCopiado: false, comprovante: false },
]

const allColumns = [
  { id: 'id', label: 'ID' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'pais', label: 'País' },
  { id: 'data', label: 'Data' },
  { id: 'total', label: 'Total' },
  { id: 'status', label: 'Status' },
  { id: 'pagamento', label: 'Pagamento' },
  { id: 'formaEntrega', label: 'Forma de entrega' },
  { id: 'rastreio', label: 'Rastreio' },
  { id: 'pixCopiado', label: 'PIX Copiado' },
  { id: 'comprovante', label: 'Comprovante' },
  { id: 'acoes', label: 'Ações' },
]

export function PedidosDashboard() {
  const [pedidos] = useState<Pedido[]>(mockPedidos)
  const [search, setSearch] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map(c => c.id))
  const [page, setPage] = useState(1)
  const [selectedPedido, setSelectedPedido] = useState<string | null>(null)
  const perPage = 10

  const filtered = pedidos.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cliente.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginatedPedidos = filtered.slice((page - 1) * perPage, page * perPage)

  function toggleColumn(col: string) {
    setVisibleColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  }

  function isColumnVisible(col: string) {
    return visibleColumns.includes(col)
  }

  const statusColor: Record<Pedido['status'], string> = {
    Pendente: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Pago: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Enviado: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Entregue: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Cancelado: 'bg-red-500/15 text-red-400 border-red-500/30',
  }

  const pagamentoColor: Record<Pedido['pagamento'], string> = {
    Pago: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Pendente: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Falhou: 'bg-red-500/15 text-red-400 border-red-500/30',
  }

  // Se um pedido está selecionado, mostra os detalhes
  if (selectedPedido) {
    return (
      <PedidoDetalhes 
        pedidoId={selectedPedido} 
        onVoltar={() => setSelectedPedido(null)} 
      />
    )
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os pedidos da sua loja</p>
        </div>

        {/* Main Card */}
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Lista de pedidos</CardTitle>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl gap-2">
                      <Columns3 size={16} />
                      Colunas
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl w-48">
                    <DropdownMenuLabel>Mostrar colunas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allColumns.map(col => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        checked={isColumnVisible(col.id)}
                        onCheckedChange={() => toggleColumn(col.id)}
                      >
                        {col.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="rounded-xl gap-2">
                  <Download size={16} />
                  Baixar CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, nome, email..."
                  className="pl-9 rounded-xl bg-background/50 border-border/50"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  <Filter size={14} />
                  Status
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  <Filter size={14} />
                  Pagamento
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  Comprovante
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  PIX Copiado
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  Período
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  Ordenar
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5 h-9">
                  <MoreHorizontal size={14} />
                  Mais Filtros
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 bg-muted/20">
                    {isColumnVisible('id') && (
                      <TableHead className="text-xs font-semibold uppercase text-foreground/80 whitespace-nowrap">ID</TableHead>
                    )}
                    {isColumnVisible('cliente') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Cliente</TableHead>
                    )}
                    {isColumnVisible('pais') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">País</TableHead>
                    )}
                    {isColumnVisible('data') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Data</TableHead>
                    )}
                    {isColumnVisible('total') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Total</TableHead>
                    )}
                    {isColumnVisible('status') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Status</TableHead>
                    )}
                    {isColumnVisible('pagamento') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Pagamento</TableHead>
                    )}
                    {isColumnVisible('formaEntrega') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Forma de Entrega</TableHead>
                    )}
                    {isColumnVisible('rastreio') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Rastreio</TableHead>
                    )}
                    {isColumnVisible('pixCopiado') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">PIX Copiado</TableHead>
                    )}
                    {isColumnVisible('comprovante') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">Comprovante</TableHead>
                    )}
                    {isColumnVisible('acoes') && (
                      <TableHead className="text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap text-right">Ações</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPedidos.map(pedido => (
                    <TableRow key={pedido.id} className="border-border/20 hover:bg-muted/10 transition-colors">
                      {isColumnVisible('id') && (
                        <TableCell className="text-foreground/80 font-medium text-sm">{pedido.id}</TableCell>
                      )}
                      {isColumnVisible('cliente') && (
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground text-sm">{pedido.cliente.name}</p>
                            <p className="text-xs text-foreground/60">{pedido.cliente.email}</p>
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('pais') && (
                        <TableCell>
                          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-green-600">
                            <svg viewBox="0 0 32 22" className="w-5 h-3.5">
                              <rect fill="#009c3b" width="32" height="22"/>
                              <polygon fill="#ffdf00" points="16,2 30,11 16,20 2,11"/>
                              <circle fill="#002776" cx="16" cy="11" r="5"/>
                            </svg>
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('data') && (
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{pedido.data}</TableCell>
                      )}
                      {isColumnVisible('total') && (
                        <TableCell className="text-foreground font-medium text-sm whitespace-nowrap">
                          R$ {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                      )}
                      {isColumnVisible('status') && (
                        <TableCell>
                          <Badge variant="outline" className={`rounded-full text-xs ${statusColor[pedido.status]}`}>
                            {pedido.status}
                          </Badge>
                        </TableCell>
                      )}
                      {isColumnVisible('pagamento') && (
                        <TableCell>
                          <Badge variant="outline" className={`rounded-full text-xs ${pagamentoColor[pedido.pagamento]}`}>
                            {pedido.pagamento}
                          </Badge>
                        </TableCell>
                      )}
                      {isColumnVisible('formaEntrega') && (
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{pedido.formaEntrega}</TableCell>
                      )}
                      {isColumnVisible('rastreio') && (
                        <TableCell>
                          {pedido.rastreio === 'enviado' ? (
                            <Check size={16} className="text-emerald-400" />
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible('pixCopiado') && (
                        <TableCell>
                          {pedido.pixCopiado ? (
                            <Check size={16} className="text-emerald-400" />
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible('comprovante') && (
                        <TableCell>
                          {pedido.comprovante ? (
                            <Check size={16} className="text-emerald-400" />
                          ) : (
                            <span className="text-muted-foreground/40 text-xs">—</span>
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible('acoes') && (
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground"
                            onClick={() => setSelectedPedido(pedido.id)}
                          >
                            <Eye size={14} />
                            Ver
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-foreground/80">
                Mostrando {paginatedPedidos.length} de <span className="font-medium">{filtered.length} resultados</span>
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
      </div>
    </ScrollArea>
  )
}
