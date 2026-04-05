'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  CreditCard,
  Search,
  ArrowRight,
  Shuffle,
  Info,
  Plus,
  GripVertical,
  ChevronDown,
  HelpCircle,
  X
} from 'lucide-react'

type TabType = 'gateways' | 'retentativa'

interface Gateway {
  id: string
  nome: string
  descricao: string
  icon: string
  cor: string
  tipo: 'nacional' | 'internacional'
}

interface RetentativaGateway {
  id: string
  nome: string
  tipo: 'principal' | 'retentativa'
  ordem: number
}

const gateways: Gateway[] = [
  {
    id: 'pagouai',
    nome: 'PAGOUAI',
    descricao: 'Aceite pagamentos de qualquer lugar do mundo em checkout ultra-rápido, análises em tempo real e integrações perfeitas.',
    icon: '🔵',
    cor: 'blue',
    tipo: 'nacional'
  },
  {
    id: 'pagarme',
    nome: 'PAGAR-ME',
    descricao: 'Pagamentos digitais para todo tipo de negócio Pagamentos digitais para todo tipo de negócio.',
    icon: '🟢',
    cor: 'green',
    tipo: 'nacional'
  },
  {
    id: 'mercadopago',
    nome: 'MERCADOPAGO',
    descricao: 'Mercado Pago é uma plataforma de pagamentos e um banco digital completo que oferece soluções financeiras para pessoas físicas e empresas.',
    icon: '💙',
    cor: 'cyan',
    tipo: 'nacional'
  },
  {
    id: 'kingpay',
    nome: 'KINGPAY',
    descricao: 'Maximize seu faturamento com taxas personalizadas para o seu negócio.',
    icon: '👑',
    cor: 'green',
    tipo: 'nacional'
  }
]

export function GatewaysDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('gateways')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null)
  
  // Gateway config state
  const [gatewayStatus, setGatewayStatus] = useState('inativo')
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [processCartao, setProcessCartao] = useState(false)
  const [processPix, setProcessPix] = useState(false)
  const [processBoleto, setProcessBoleto] = useState(false)
  const [habilitarJuros, setHabilitarJuros] = useState(true)
  const [juros, setJuros] = useState<{[key: string]: string}>({
    '1x': '0.00%', '2x': '0.00%', '3x': '0.00%',
    '4x': '0.00%', '5x': '0.00%', '6x': '0.00%',
    '7x': '0.00%', '8x': '0.00%', '9x': '0.00%',
    '10x': '0.00%', '11x': '0.00%', '12x': '0.00%',
  })

  // Retentativa state
  const [cartaoGateways] = useState<RetentativaGateway[]>([
    { id: '1', nome: 'VenoPay', tipo: 'principal', ordem: 1 },
    { id: '2', nome: 'Black Cat', tipo: 'retentativa', ordem: 2 }
  ])
  
  const [pixGateways] = useState<RetentativaGateway[]>([
    { id: '1', nome: 'VenoPay', tipo: 'principal', ordem: 1 }
  ])

  const filteredGateways = gateways.filter(g => 
    g.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfigureGateway = (gatewayId: string) => {
    setSelectedGateway(gatewayId)
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Formas de Pagamento</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os <span className="text-[#c4d0ff]">gateways de pagamento</span>, formas de pagamento e configurações de <span className="text-orange-500">retentativa</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('gateways')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              activeTab === 'gateways'
                ? 'bg-[#1a1a1f] border-[#c4d0ff]/30 text-white shadow-[0_0_10px_rgba(196,208,255,0.2)]'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-[#c4d0ff]/30 hover:shadow-[0_0_10px_rgba(196,208,255,0.1)]'
            }`}
          >
            <CreditCard size={16} />
            Gateways
            <span className="text-xs text-muted-foreground">Configure e ative gateways</span>
          </button>
          
          <button
            onClick={() => setActiveTab('retentativa')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              activeTab === 'retentativa'
                ? 'bg-[#1a1a1f] border-[#c4d0ff]/30 text-white shadow-[0_0_10px_rgba(196,208,255,0.2)]'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-[#c4d0ff]/30 hover:shadow-[0_0_10px_rgba(196,208,255,0.1)]'
            }`}
          >
            <Shuffle size={16} />
            Retentativa
            <span className="text-xs text-muted-foreground">Defina ordem de processamento</span>
          </button>
        </div>

        {activeTab === 'gateways' && (
          <>
            {/* Search */}
            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar Gateways"
                className="pl-9 bg-card border-border rounded-xl focus:border-[#c4d0ff]/50 focus:ring-[#c4d0ff]/20"
              />
            </div>

            {/* Gateways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredGateways.map((gateway) => (
                <div 
                  key={gateway.id}
                  className="bg-card border border-border rounded-2xl p-5 flex flex-col hover:border-[#c4d0ff]/30 hover:shadow-[0_0_15px_rgba(196,208,255,0.1)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-2xl">
                      {gateway.id === 'pagouai' && (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">P</span>
                        </div>
                      )}
                      {gateway.id === 'pagarme' && (
                        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">PM</span>
                        </div>
                      )}
                      {gateway.id === 'mercadopago' && (
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">MP</span>
                        </div>
                      )}
                      {gateway.id === 'kingpay' && (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">K</span>
                        </div>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-md"
                    >
                      Nacional
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    {gateway.nome}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-3">
                    {gateway.descricao}
                  </p>

                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl text-sm gap-2 justify-center hover:border-[#c4d0ff]/50 hover:shadow-[0_0_10px_rgba(196,208,255,0.15)]"
                    onClick={() => handleConfigureGateway(gateway.id)}
                  >
                    Configurar Gateway
                    <ArrowRight size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'retentativa' && (
          <>
            {/* Título */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">Configuração de Retentativa</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Configure a ordem de tentativa dos gateways para cada método de pagamento. Se um gateway falhar, o sistema tentará processar o pagamento no próximo da lista.
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-[#1a1a1f]/50 border border-[#c4d0ff]/20 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Info size={16} className="text-[#c4d0ff]" />
                <span className="text-sm font-medium text-white">
                  Como funciona a retentativa de pagamento?
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#c4d0ff] text-[#1a1a1f] text-xs flex items-center justify-center font-medium">1</span>
                    <span className="text-sm font-medium text-white">Gateway Principal</span>
                  </div>
                  <p className="text-xs text-gray-400 pl-8">
                    O <span className="text-orange-500">primeiro</span> gateway configurado sempre será a <span className="text-orange-500">primeira</span> tentativa de processamento do pagamento
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#c4d0ff] text-[#1a1a1f] text-xs flex items-center justify-center font-medium">2</span>
                    <span className="text-sm font-medium text-white">Retentativa</span>
                  </div>
                  <p className="text-xs text-gray-400 pl-8">
                    Em caso de falha, o sistema tentará processar automaticamente no próximo gateway da sequência
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-[#c4d0ff] text-[#1a1a1f] text-xs flex items-center justify-center font-medium">3</span>
                    <span className="text-sm font-medium text-white">Configuração</span>
                  </div>
                  <ul className="text-xs text-gray-400 pl-8 space-y-1">
                    <li className="flex items-center gap-1">
                      <GripVertical size={12} />
                      Arraste para reordenar
                    </li>
                    <li className="flex items-center gap-1">
                      <Plus size={12} />
                      Adicione mais gateways
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded border border-current"></span>
                      Remova se necessário
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Salvar Configurações */}
            <div className="flex justify-end mb-6">
              <Button className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 rounded-xl shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)]">
                Salvar configurações
              </Button>
            </div>

            {/* Cartão de Crédito */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-4">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Cartão de Crédito</h3>
                <p className="text-xs text-muted-foreground">
                  Arraste os <span className="text-orange-500">gateways</span> para <span className="text-[#c4d0ff]">reordenar</span> a sequência de <span className="text-orange-500">tentativas</span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {cartaoGateways.map((gw, index) => (
                  <div key={gw.id} className="flex items-center gap-2">
                    <div className="bg-muted/30 border border-border rounded-xl p-4 min-w-[120px] hover:border-[#c4d0ff]/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-medium text-[#c4d0ff]">
                          {gw.tipo === 'principal' ? 'Gateway Principal' : `Retentativa ${gw.ordem - 1}`}
                        </span>
                        <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                      </div>
                      <p className="text-sm font-medium text-orange-500">{gw.nome}</p>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-2 mx-auto"></div>
                    </div>
                    
                    {index < cartaoGateways.length - 1 && (
                      <div className="flex flex-col items-center text-xs text-muted-foreground">
                        <span>Falhou</span>
                        <div className="w-8 h-px bg-border my-1"></div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Adicionar Gateway */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center text-xs text-muted-foreground">
                    <span>Adicionar</span>
                    <div className="w-8 h-px bg-border my-1"></div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-dashed flex items-center gap-2 text-muted-foreground hover:text-foreground hover:border-[#c4d0ff]/30"
                  >
                    <Plus size={14} />
                    Adicionar gateway
                    <ChevronDown size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Pix */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-4">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Pix</h3>
                <p className="text-xs text-muted-foreground">
                  Arraste os <span className="text-orange-500">gateways</span> para <span className="text-[#c4d0ff]">reordenar</span> a sequência de <span className="text-orange-500">tentativas</span>
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {pixGateways.map((gw) => (
                  <div key={gw.id} className="flex items-center gap-2">
                    <div className="bg-muted/30 border border-border rounded-xl p-4 min-w-[120px] hover:border-[#c4d0ff]/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-medium text-[#c4d0ff]">
                          Gateway Principal
                        </span>
                        <GripVertical size={14} className="text-muted-foreground cursor-grab" />
                      </div>
                      <p className="text-sm font-medium text-orange-500">{gw.nome}</p>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30 mt-2 mx-auto"></div>
                    </div>
                  </div>
                ))}

                {/* Adicionar Gateway */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center text-xs text-muted-foreground">
                    <span>Adicionar</span>
                    <div className="w-8 h-px bg-border my-1"></div>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl border-dashed flex items-center gap-2 text-muted-foreground hover:text-foreground hover:border-[#c4d0ff]/30"
                  >
                    <Plus size={14} />
                    Adicionar gateway
                    <ChevronDown size={14} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Boleto */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">Boleto</h3>
                <p className="text-xs text-muted-foreground">
                  Arraste os <span className="text-orange-500">gateways</span> para <span className="text-[#c4d0ff]">reordenar</span> a sequência de <span className="text-orange-500">tentativas</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-dashed flex items-center gap-2 text-muted-foreground hover:text-foreground hover:border-[#c4d0ff]/30"
                >
                  <Plus size={14} />
                  Adicionar gateway
                  <ChevronDown size={14} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Configurar Gateway */}
      <Dialog open={selectedGateway !== null} onOpenChange={() => setSelectedGateway(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-card border-border p-0 rounded-2xl overflow-hidden">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold text-foreground">
                  {selectedGateway === 'pagouai' ? 'PagouAi' : 
                   selectedGateway === 'pagarme' ? 'Pagar-me' :
                   selectedGateway === 'mercadopago' ? 'MercadoPago' : 'KingPay'}
                </DialogTitle>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Status da integração</span>
                    <HelpCircle size={12} className="text-muted-foreground" />
                  </div>
                  <Select value={gatewayStatus} onValueChange={setGatewayStatus}>
                    <SelectTrigger className="w-[100px] h-8 rounded-lg text-xs border-[#c4d0ff]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inativo">Inativo</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Integre sua loja à {selectedGateway === 'pagouai' ? 'PagouAi' : selectedGateway}
              </p>
            </DialogHeader>

            <div className="space-y-4">
              {/* Está com dúvidas */}
              <div className="text-right">
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  Está com dúvidas? <HelpCircle size={12} />
                </p>
                <a href="#" className="text-xs text-[#c4d0ff] hover:underline">
                  Aprenda como integrar sua loja à {selectedGateway === 'pagouai' ? 'PagouAi' : selectedGateway}
                </a>
              </div>

              {/* Chave pública */}
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1.5">
                  Chave pública <HelpCircle size={12} className="text-muted-foreground" />
                </label>
                <Input
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  placeholder="Insira sua chave pública"
                  className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                />
              </div>

              {/* Chave secreta */}
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1.5">
                  Chave secreta <HelpCircle size={12} className="text-muted-foreground" />
                </label>
                <Input
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Insira sua chave secreta"
                  type="password"
                  className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                />
              </div>

              {/* Métodos de pagamento */}
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-3">
                  Métodos de pagamento <HelpCircle size={12} className="text-muted-foreground" />
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground flex items-center gap-1">
                      Processar cartão de crédito <HelpCircle size={12} className="text-muted-foreground" />
                    </span>
                    <Switch checked={processCartao} onCheckedChange={setProcessCartao} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground flex items-center gap-1">
                      Processar Pix <HelpCircle size={12} className="text-muted-foreground" />
                    </span>
                    <Switch checked={processPix} onCheckedChange={setProcessPix} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground flex items-center gap-1">
                      Processar Boleto <HelpCircle size={12} className="text-muted-foreground" />
                    </span>
                    <Switch checked={processBoleto} onCheckedChange={setProcessBoleto} />
                  </div>
                </div>
              </div>

              {/* Habilitar juros por parcela */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm font-medium text-foreground flex items-center gap-1">
                  Habilitar juros por parcela <HelpCircle size={12} className="text-muted-foreground" />
                </span>
                <Switch checked={habilitarJuros} onCheckedChange={setHabilitarJuros} />
              </div>

              {habilitarJuros && (
                <>
                  {/* Info box */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <Info size={14} className="text-blue-600 dark:text-blue-400 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Configure os juros para cada parcela. Para vendas sem juros, deixe o valor em 0,00%.
                      </p>
                    </div>
                  </div>

                  {/* Grid de juros */}
                  <div className="grid grid-cols-3 gap-3">
                    {['1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '11x', '12x'].map((parcela) => (
                      <div key={parcela}>
                        <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          Em {parcela} <HelpCircle size={10} className="text-muted-foreground" />
                        </label>
                        <Input
                          value={juros[parcela]}
                          onChange={(e) => setJuros({...juros, [parcela]: e.target.value})}
                          className="h-9 rounded-lg text-sm border-border"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Botão Salvar */}
            <Button 
              className="w-full mt-6 bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 rounded-xl shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)]"
            >
              Salvar alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}
