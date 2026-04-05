'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  User,
  CreditCard,
  MapPin,
  Package,
  RefreshCw,
  Monitor,
  Smartphone,
  MapPinned,
  QrCode,
  Copy,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PedidoDetalhesProps {
  pedidoId: string
  onVoltar: () => void
}

export function PedidoDetalhes({ pedidoId, onVoltar }: PedidoDetalhesProps) {
  const [logsExpanded, setLogsExpanded] = useState(false)

  // Mock data para demonstração
  const pedido = {
    id: '#706de768',
    data: '01/04/24, 21:26',
    status: 'Pendente' as const,
    cliente: {
      nome: 'Lucsa 01',
      email: 'asdadassad@gmail.com',
      telefone: '(12) 34567-2560',
      cidade: 'Araruana, Rio de Janeiro',
      uf: 'RJ',
    },
    pagamento: {
      metodo: 'Pix',
      qrCode: true,
      comprovante: null,
      resumo: {
        subtotal: 107.90,
        desconto: 0,
        frete: 23.11,
        freteDescricao: 'Correios - PAC',
        total: 131.01,
      },
    },
    entrega: {
      endereco: 'Rua Vila Caetano nº, 23',
      bairro: 'Bairro Rui Moinho João',
      cidade: 'Santa Adélia dos Batos - RS',
      cep: '32649430',
      rastreioUrl: null,
    },
    produtos: [
      {
        nome: 'Faca Churrasco Artesanal Nossa Senhora Aparecida Terço + Bainha Grátis - Transparente',
        quantidade: 1,
        precoUnit: 107.90,
        total: 107.90,
      },
    ],
    resumoPedido: {
      subtotal: 107.90,
      frete: 23.11,
      freteDescricao: 'Correios - PAC',
      total: 131.01,
    },
    tentativasProcessamento: [
      {
        gateway: 'IntegraPay',
        status: 'Descartado',
        protocolo: 27,
        valor: 'R$31.01',
        data: '01/04/24, 21:26',
        mensagem: 'Aguardando Pagamento',
      },
    ],
    dispositivo: {
      navegador: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      enderecoIp: '104.192.103.25',
      resolucao: '1920x1080',
      fingerprint: '7f56e288417c624641b7a6....',
    },
    paginaInfo: {
      url: 'https://prismacheckout.corvex.io/c/demo/store/7880E039-f967-425a-9eb2-f5bc38f36e11',
      checkoutUrl: 'https://checkout.corvex.io/exp1',
    },
    localizacao: {
      cidade: 'Araruama',
      estado: 'Rio de Janeiro',
      pais: 'Brasil',
    },
    pixStatus: {
      copiado: false,
      mensagem: 'O código PIX ainda não foi copiado pelo cliente',
    },
    logs: [],
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVoltar}
              className="rounded-xl gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-foreground">{pedido.id}</h1>
                <Badge
                  variant="outline"
                  className="rounded-full text-xs bg-amber-500/15 text-amber-400 border-amber-500/30"
                >
                  {pedido.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{pedido.data}</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl gap-2 bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
            Pendente
          </Button>
        </div>

        {/* Main Grid - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Informações do Cliente */}
          <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User size={16} className="text-purple-400" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dados Pessoais</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <User size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{pedido.cliente.nome}</p>
                    <p className="text-xs text-muted-foreground">{pedido.cliente.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Contato</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Smartphone size={12} className="text-emerald-400" />
                    </div>
                    <span className="text-sm text-foreground">{pedido.cliente.telefone}</span>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-xl h-7 text-xs gap-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    <MessageCircle size={12} />
                    WhatsApp
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Localização</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MapPinned size={12} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{pedido.cliente.cidade}</p>
                    <p className="text-xs text-muted-foreground">{pedido.cliente.uf}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Pagamento */}
          <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CreditCard size={16} className="text-blue-400" />
                Detalhes do Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Método de Pagamento</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-xs">
                    <span className="text-emerald-400">$</span>
                  </div>
                  <span className="text-sm text-foreground">{pedido.pagamento.metodo}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">QR Code do Pix</p>
                <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1.5 w-full justify-start">
                  <QrCode size={14} />
                  Ver QR Code
                </Button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Comprovante de Pagamento</p>
                <p className="text-xs text-muted-foreground/60 italic">Sem comprovante de pagamento.</p>
              </div>

              <div className="pt-2 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Resumo do Pagamento</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {pedido.pagamento.resumo.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-foreground">-R$ {pedido.pagamento.resumo.desconto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{pedido.pagamento.resumo.freteDescricao}</span>
                    <span className="text-foreground">R$ {pedido.pagamento.resumo.frete.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/30">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-emerald-400 font-bold">R$ {pedido.pagamento.resumo.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço de Entrega */}
          <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin size={16} className="text-amber-400" />
                  Endereço de Entrega
                </CardTitle>
                <Button variant="outline" size="sm" className="rounded-xl h-7 text-xs gap-1">
                  Adicionar Rastreio
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Localização</p>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                    <MapPin size={12} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{pedido.entrega.endereco}</p>
                    <p className="text-xs text-muted-foreground">{pedido.entrega.bairro}</p>
                    <p className="text-xs text-muted-foreground">{pedido.entrega.cidade}</p>
                    <p className="text-xs text-muted-foreground">CEP: {pedido.entrega.cep}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Código de Rastreio</p>
                <p className="text-xs text-muted-foreground/60 italic">Nenhum código de rastreio cadastrado ainda</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Produtos do Pedido */}
        <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package size={16} className="text-purple-400" />
              Produtos do Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">Itens</p>
            <div className="rounded-xl border border-border/30 overflow-hidden mb-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 bg-muted/20">
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Produto</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-center">Quantidade</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">Preço Unit.</TableHead>
                    <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedido.produtos.map((produto, idx) => (
                    <TableRow key={idx} className="border-border/20">
                      <TableCell className="text-sm text-foreground max-w-md">{produto.nome}</TableCell>
                      <TableCell className="text-sm text-muted-foreground text-center">{produto.quantidade}</TableCell>
                      <TableCell className="text-sm text-muted-foreground text-right">R$ {produto.precoUnit.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-foreground font-medium text-right">R$ {produto.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="text-xs text-muted-foreground mb-3">Resumo do Pedido</p>
            <div className="space-y-2 text-sm max-w-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">R$ {pedido.resumoPedido.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{pedido.resumoPedido.freteDescricao}</span>
                <span className="text-foreground">R$ {pedido.resumoPedido.frete.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/30">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-emerald-400 font-bold">R$ {pedido.resumoPedido.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tentativas de Processamento */}
        <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <RefreshCw size={16} className="text-blue-400" />
              Tentativas de Processamento
            </CardTitle>
            <p className="text-xs text-muted-foreground">Histórico de tentativas de pagamento com diferentes gateways</p>
          </CardHeader>
          <CardContent>
            {pedido.tentativasProcessamento.map((tentativa, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/10 border border-border/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">IP</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{tentativa.gateway}</span>
                      <Badge variant="outline" className="rounded-full text-xs bg-amber-500/15 text-amber-400 border-amber-500/30">
                        {tentativa.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Protocolo: {tentativa.protocolo}</p>
                    <p className="text-xs text-muted-foreground">{tentativa.valor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{tentativa.data}</p>
                  <Badge variant="outline" className="rounded-full text-xs mt-1 bg-amber-500/10 text-amber-400 border-amber-500/20">
                    {tentativa.mensagem}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Informações do Dispositivo */}
        <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Monitor size={16} className="text-purple-400" />
              Informações do Dispositivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Navegador</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                      <Monitor size={12} className="text-blue-400" />
                    </div>
                    <p className="text-xs text-foreground break-all">{pedido.dispositivo.navegador}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Endereço IP</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 text-xs">IP</span>
                      </div>
                      <span className="text-sm text-foreground">{pedido.dispositivo.enderecoIp}</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl h-7 text-xs gap-1">
                      Bloquear
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Resolução de Tela</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center">
                      <Monitor size={12} className="text-purple-400" />
                    </div>
                    <span className="text-sm text-foreground">{pedido.dispositivo.resolucao}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Fingerprint</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center">
                      <Smartphone size={12} className="text-amber-400" />
                    </div>
                    <span className="text-xs text-foreground font-mono">{pedido.dispositivo.fingerprint}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Informações da Página</p>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">URL</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-xs">@</span>
                    </div>
                    <p className="text-xs text-foreground break-all">{pedido.paginaInfo.url}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Checkout URL</p>
                  <p className="text-xs text-foreground break-all">{pedido.paginaInfo.checkoutUrl}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPinned size={16} className="text-amber-400" />
              Localização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                <MapPinned size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{pedido.localizacao.cidade}</p>
                <p className="text-xs text-muted-foreground">{pedido.localizacao.estado}</p>
                <p className="text-xs text-muted-foreground">{pedido.localizacao.pais}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status do PIX */}
        <Card className="rounded-2xl bg-card/80 backdrop-blur-sm border-border/50 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-400" />
              Status do PIX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <AlertCircle size={14} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Código PIX Não Copiado</p>
                  <p className="text-xs text-muted-foreground">{pedido.pixStatus.mensagem}</p>
                </div>
              </div>
              <Badge variant="outline" className="rounded-full text-xs bg-amber-500/15 text-amber-400 border-amber-500/30">
                Pendente
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Logs de Integração */}
        <Card className="rounded-2xl bg-blue-500/5 border-blue-500/20 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw size={16} className="text-blue-400" />
                Logs de Integração
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl h-7 text-xs gap-1 text-blue-400"
                onClick={() => setLogsExpanded(!logsExpanded)}
              >
                {logsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                Abrir
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Histórico de tentativas de integração com serviços externos.{' '}
              <span className="text-blue-400 cursor-pointer">@ ver mais</span>
            </p>
          </CardHeader>
          {logsExpanded && (
            <CardContent>
              <div className="p-4 rounded-xl bg-muted/20 border border-border/20">
                <p className="text-xs text-muted-foreground mb-2">Nenhum resultado</p>
                <p className="text-xs text-muted-foreground">Clique em &quot;Abrir&quot; para visualizar os resultados</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1.5">
                  <Filter size={12} />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs gap-1.5">
                  <RotateCcw size={12} />
                  Reenviar
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </ScrollArea>
  )
}
