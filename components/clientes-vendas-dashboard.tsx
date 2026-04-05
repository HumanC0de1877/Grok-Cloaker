'use client'

import { useState } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
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

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  documento: string
  tipoDocumento: 'CPF' | 'CNPJ'
  pedidos: number
  ultimoPedido: string
}

const mockClientes: Cliente[] = [
  { id: 1, nome: 'Alexsandra PITHAN mendo', email: 'alexsandra.mendo@gmail.com', telefone: '5551981359413', documento: '74304330578', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '04 de dezembro de 2025' },
  { id: 2, nome: 'Amanda Camargo Bastos', email: 'pessoalamandabastos@gmail.com', telefone: '5542999360352', documento: '10540664936', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '09 de dezembro de 2025' },
  { id: 3, nome: 'Andressa santos', email: 'andressateste1226@gmail.com', telefone: '5577999199672', documento: '61640367802', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '09 de dezembro de 2025' },
  { id: 4, nome: 'Angela Kofferman Figueira', email: 'Angelakfigueira@yahoo.com', telefone: '5547988087153', documento: '18322901666', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '09 de dezembro de 2025' },
  { id: 5, nome: 'asd asd', email: 'dasdasd@gmail.com', telefone: '5522999621855', documento: '80792191250', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '30 de novembro de 2025' },
  { id: 6, nome: 'asd dasda', email: 'ghost01@gmail.com', telefone: '5522999621855', documento: '26467292863', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '01 de dezembro de 2025' },
  { id: 7, nome: 'ASD SADASDAS', email: 'jhdashjohasj@gmail.com', telefone: '5522999621855', documento: '12441821091', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '04 de dezembro de 2025' },
  { id: 8, nome: 'asda sdas d', email: 'asdas@gmail.com', telefone: '5522999621855', documento: '13466974186', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '07 de janeiro de 2026' },
  { id: 9, nome: 'Breno santos', email: 'eubrenosantoss@gmail.com', telefone: '5517991301328', documento: '87977051958', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '30 de novembro de 2025' },
  { id: 10, nome: 'Breno santos', email: 'eubrenosantoss@gmail.com', telefone: '5517991301328', documento: '19664100188', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '30 de novembro de 2025' },
  { id: 11, nome: 'Carlos Silva', email: 'carlos.silva@gmail.com', telefone: '5511999887766', documento: '12345678901', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '15 de janeiro de 2026' },
  { id: 12, nome: 'Fernanda Lima', email: 'fernanda.lima@hotmail.com', telefone: '5521988776655', documento: '98765432100', tipoDocumento: 'CPF', pedidos: 3, ultimoPedido: '20 de janeiro de 2026' },
  { id: 13, nome: 'Gabriel Oliveira', email: 'gabriel.oliveira@gmail.com', telefone: '5531977665544', documento: '11122233344', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '25 de dezembro de 2025' },
  { id: 14, nome: 'Helena Costa', email: 'helena.costa@outlook.com', telefone: '5541966554433', documento: '55566677788', tipoDocumento: 'CPF', pedidos: 4, ultimoPedido: '28 de janeiro de 2026' },
  { id: 15, nome: 'Igor Santos', email: 'igor.santos@gmail.com', telefone: '5551955443322', documento: '99988877766', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '10 de janeiro de 2026' },
  { id: 16, nome: 'Julia Ferreira', email: 'julia.ferreira@yahoo.com', telefone: '5561944332211', documento: '33322211100', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '05 de fevereiro de 2026' },
  { id: 17, nome: 'Lucas Pereira', email: 'lucas.pereira@gmail.com', telefone: '5571933221100', documento: '77788899900', tipoDocumento: 'CPF', pedidos: 5, ultimoPedido: '01 de fevereiro de 2026' },
  { id: 18, nome: 'Mariana Alves', email: 'mariana.alves@hotmail.com', telefone: '5581922110099', documento: '44455566677', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '18 de janeiro de 2026' },
  { id: 19, nome: 'Nicolas Souza', email: 'nicolas.souza@gmail.com', telefone: '5591911009988', documento: '22233344455', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '22 de dezembro de 2025' },
  { id: 20, nome: 'Olivia Rodrigues', email: 'olivia.rodrigues@outlook.com', telefone: '5511900998877', documento: '66677788899', tipoDocumento: 'CPF', pedidos: 3, ultimoPedido: '12 de janeiro de 2026' },
  { id: 21, nome: 'Pedro Martins', email: 'pedro.martins@gmail.com', telefone: '5521899887766', documento: '88899900011', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '08 de janeiro de 2026' },
  { id: 22, nome: 'Rafaela Santos', email: 'rafaela.santos@yahoo.com', telefone: '5531888776655', documento: '00011122233', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '03 de fevereiro de 2026' },
  { id: 23, nome: 'Samuel Costa', email: 'samuel.costa@hotmail.com', telefone: '5541877665544', documento: '11100099988', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '27 de dezembro de 2025' },
  { id: 24, nome: 'Tatiana Lima', email: 'tatiana.lima@gmail.com', telefone: '5551866554433', documento: '55544433322', tipoDocumento: 'CPF', pedidos: 4, ultimoPedido: '30 de janeiro de 2026' },
  { id: 25, nome: 'Ulisses Ferreira', email: 'ulisses.ferreira@outlook.com', telefone: '5561855443322', documento: '99977755533', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '14 de janeiro de 2026' },
  { id: 26, nome: 'Vanessa Alves', email: 'vanessa.alves@gmail.com', telefone: '5571844332211', documento: '33311199977', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '19 de janeiro de 2026' },
  { id: 27, nome: 'William Pereira', email: 'william.pereira@yahoo.com', telefone: '5581833221100', documento: '77755533311', tipoDocumento: 'CPF', pedidos: 3, ultimoPedido: '24 de janeiro de 2026' },
  { id: 28, nome: 'Ximena Souza', email: 'ximena.souza@hotmail.com', telefone: '5591822110099', documento: '44422200088', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '06 de fevereiro de 2026' },
  { id: 29, nome: 'Yago Rodrigues', email: 'yago.rodrigues@gmail.com', telefone: '5511811009988', documento: '22200088866', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '02 de fevereiro de 2026' },
  { id: 30, nome: 'Zara Martins', email: 'zara.martins@outlook.com', telefone: '5521800998877', documento: '66644422200', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '09 de fevereiro de 2026' },
  { id: 31, nome: 'Arthur Santos', email: 'arthur.santos@gmail.com', telefone: '5531799887766', documento: '88866644422', tipoDocumento: 'CPF', pedidos: 5, ultimoPedido: '11 de fevereiro de 2026' },
  { id: 32, nome: 'Beatriz Costa', email: 'beatriz.costa@yahoo.com', telefone: '5541788776655', documento: '00088866644', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '07 de fevereiro de 2026' },
  { id: 33, nome: 'Cauã Lima', email: 'caua.lima@hotmail.com', telefone: '5551777665544', documento: '11188800066', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '04 de fevereiro de 2026' },
  { id: 34, nome: 'Daniela Ferreira', email: 'daniela.ferreira@gmail.com', telefone: '5561766554433', documento: '55588811100', tipoDocumento: 'CPF', pedidos: 3, ultimoPedido: '13 de fevereiro de 2026' },
  { id: 35, nome: 'Eduardo Alves', email: 'eduardo.alves@outlook.com', telefone: '5571755443322', documento: '99588855511', tipoDocumento: 'CPF', pedidos: 1, ultimoPedido: '10 de fevereiro de 2026' },
  { id: 36, nome: 'Fabiana Pereira', email: 'fabiana.pereira@yahoo.com', telefone: '5581744332211', documento: '33588899955', tipoDocumento: 'CPF', pedidos: 2, ultimoPedido: '15 de fevereiro de 2026' },
  { id: 37, nome: 'Gustavo Souza', email: 'gustavo.souza@gmail.com', telefone: '5591733221100', documento: '77588833399', tipoDocumento: 'CPF', pedidos: 4, ultimoPedido: '17 de fevereiro de 2026' },
]

export function ClientesVendasDashboard() {
  const [clientes] = useState<Cliente[]>(mockClientes)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.telefone.includes(search) ||
    c.documento.includes(search)
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginatedClientes = filtered.slice((page - 1) * perPage, page * perPage)

  function getPedidosBadgeColor(pedidos: number) {
    if (pedidos >= 5) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
    if (pedidos >= 3) return 'bg-blue-500/15 text-blue-500 border-blue-500/30'
    if (pedidos >= 2) return 'bg-amber-500/15 text-amber-500 border-amber-500/30'
    return 'bg-orange-500/15 text-orange-500 border-orange-500/30'
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        </div>

        {/* Main Content */}
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-9 rounded-xl bg-background/50 border-border/50"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 bg-muted/20">
                    <TableHead className="text-xs font-semibold uppercase text-foreground/80">Cliente</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Telefone</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Documento</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Pedidos</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Último Pedido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClientes.map(cliente => (
                    <TableRow key={cliente.id} className="border-border/20 hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{cliente.nome}</p>
                          <p className="text-xs text-cyan-500">{cliente.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-medium">
                        {cliente.telefone}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-foreground font-medium">{cliente.documento}</p>
                          <p className="text-xs text-orange-500">{cliente.tipoDocumento}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`rounded-full text-xs ${getPedidosBadgeColor(cliente.pedidos)}`}
                        >
                          {cliente.pedidos} pedido{cliente.pedidos !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {cliente.ultimoPedido}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Mostrar</span>
                <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(Number(v)); setPage(1) }}>
                  <SelectTrigger className="w-16 h-8 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>de <span className="text-cyan-500 font-medium">{filtered.length} clientes</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-8 w-8"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página <span className="font-medium text-foreground">{page}</span> de <span className="font-medium text-foreground">{totalPages}</span>
                </span>
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
