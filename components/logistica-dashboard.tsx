'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Save,
  Plus,
  Settings,
  ExternalLink,
  Clock,
  Truck
} from 'lucide-react'

interface MetodoFrete {
  id: string
  nome: string
  ativo: boolean
  prazoMin: number
  prazoMax: number
  preco: number
}

export function LogisticaDashboard() {
  const [fretes, setFretes] = useState<MetodoFrete[]>([
    { id: '1', nome: 'Correios - PAC', ativo: true, prazoMin: 7, prazoMax: 15, preco: 0 },
    { id: '2', nome: 'Correios - Sedex', ativo: true, prazoMin: 5, prazoMax: 8, preco: 21.34 },
    { id: '3', nome: 'FRETE FULL', ativo: true, prazoMin: 2, prazoMax: 5, preco: 42.68 },
  ])

  const [showNovoFrete, setShowNovoFrete] = useState(false)
  const [showConfigFrete, setShowConfigFrete] = useState<string | null>(null)
  
  // Novo frete form state
  const [novoNome, setNovoNome] = useState('')
  const [novoPreco, setNovoPreco] = useState('R$ 0,00')
  const [novoPedidoMinimo, setNovoPedidoMinimo] = useState('R$ 0,00')
  const [novoPrazoMin, setNovoPrazoMin] = useState('1')
  const [novoPrazoMax, setNovoPrazoMax] = useState('5')
  const [novoDescricao, setNovoDescricao] = useState('')
  const [novoPreSelecionada, setNovoPreSelecionada] = useState(false)
  const [novoAtivo, setNovoAtivo] = useState(true)

  const fretesAtivos = fretes.filter(f => f.ativo).length

  const toggleFreteAtivo = (id: string) => {
    setFretes(fretes.map(f => 
      f.id === id ? { ...f, ativo: !f.ativo } : f
    ))
  }

  const handleSalvarNovoFrete = () => {
    const novoFrete: MetodoFrete = {
      id: String(Date.now()),
      nome: novoNome,
      ativo: novoAtivo,
      prazoMin: parseInt(novoPrazoMin) || 1,
      prazoMax: parseInt(novoPrazoMax) || 5,
      preco: parseFloat(novoPreco.replace('R$ ', '').replace(',', '.')) || 0
    }
    setFretes([...fretes, novoFrete])
    setShowNovoFrete(false)
    // Reset form
    setNovoNome('')
    setNovoPreco('R$ 0,00')
    setNovoPedidoMinimo('R$ 0,00')
    setNovoPrazoMin('1')
    setNovoPrazoMax('5')
    setNovoDescricao('')
    setNovoPreSelecionada(false)
    setNovoAtivo(true)
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logística</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie métodos de <span className="text-[#c4d0ff]">frete</span>, restrições de <span className="text-[#c4d0ff]">região</span> e <span className="text-orange-500">retirada na loja</span>
            </p>
          </div>
          <Button className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 rounded-xl shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)] gap-2">
            <Save size={16} />
            Salvar alterações
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Info */}
          <div className="w-64 flex-shrink-0 space-y-4">
            {/* Frete Info */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-base font-semibold text-foreground mb-2">Frete</h3>
              <p className="text-sm text-muted-foreground">
                Configure os métodos de <span className="text-[#c4d0ff]">frete</span> disponíveis no checkout. Crie fretes personalizados com <span className="text-[#c4d0ff]">valores</span> e <span className="text-[#c4d0ff]">prazos</span> definidos por você.
              </p>
            </div>

            {/* Tem dúvidas */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-base font-semibold text-foreground mb-2">Tem dúvidas?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Entenda a diferença entre os fretes e como <span className="text-[#c4d0ff]">configurar</span>.
              </p>
              <a href="#" className="text-sm text-[#c4d0ff] flex items-center gap-1 hover:underline">
                Saiba mais <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Fretes Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Você tem {fretes.length} fretes
                  </h3>
                  <p className="text-sm text-[#c4d0ff]">{fretesAtivos} ativos</p>
                </div>
                <Button 
                  onClick={() => setShowNovoFrete(true)}
                  className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 rounded-xl shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)] gap-2"
                >
                  <Plus size={16} />
                  Novo frete
                </Button>
              </div>

              {/* Lista de Fretes */}
              <div className="space-y-4">
                {fretes.map((frete) => (
                  <div 
                    key={frete.id}
                    className="flex items-center justify-between py-4 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <Switch 
                        checked={frete.ativo} 
                        onCheckedChange={() => toggleFreteAtivo(frete.id)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{frete.nome}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] rounded-md ${
                              frete.ativo 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30'
                            }`}
                          >
                            {frete.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {frete.prazoMin}-{frete.prazoMax} dias
                          </span>
                          <span className="text-[#c4d0ff]">
                            R$ {frete.preco.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowConfigFrete(frete.id)}
                      className="text-muted-foreground hover:text-foreground hover:bg-[#c4d0ff]/10"
                    >
                      <Settings size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Restrição de Regiões */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-base font-bold text-foreground uppercase tracking-wide">
                  Restrição de Regiões para Entrega
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure quais regiões serão <span className="text-[#c4d0ff]">bloqueadas</span> ou <span className="text-[#c4d0ff]">permitidas</span> para entrega.
                </p>
              </div>
              <p className="text-sm text-orange-500 mb-4">Nenhuma restrição cadastrada</p>
              <div className="border border-border rounded-xl p-4 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground gap-2"
                >
                  <Settings size={16} />
                  Gerenciar
                </Button>
              </div>
            </div>

            {/* Retire na Loja */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-base font-bold text-foreground uppercase tracking-wide">
                  Retire na Loja
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure pontos de retirada onde seus clientes podem <span className="text-[#c4d0ff]">buscar os produtos pessoalmente</span>.
                </p>
              </div>
              <p className="text-sm text-orange-500 mb-4">Nenhum ponto cadastrado</p>
              <div className="border border-border rounded-xl p-4 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground gap-2"
                >
                  <Settings size={16} />
                  Gerenciar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Novo Frete */}
      <Dialog open={showNovoFrete} onOpenChange={setShowNovoFrete}>
        <DialogContent className="max-w-md bg-white dark:bg-card border-border p-0 rounded-2xl overflow-hidden">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold text-foreground">
                Novo Método de Frete
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Nome do método */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Nome do método
                </label>
                <Input
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Frete Grátis, SEDEX, etc"
                  className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                />
              </div>

              {/* Preço e Pedido mínimo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Preço (R$)
                  </label>
                  <Input
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(e.target.value)}
                    placeholder="R$ 0,00"
                    className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Pedido mínimo (R$)
                  </label>
                  <Input
                    value={novoPedidoMinimo}
                    onChange={(e) => setNovoPedidoMinimo(e.target.value)}
                    placeholder="R$ 0,00"
                    className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                  />
                </div>
              </div>

              {/* Prazo mínimo e máximo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Prazo mínimo (dias)
                  </label>
                  <Input
                    value={novoPrazoMin}
                    onChange={(e) => setNovoPrazoMin(e.target.value)}
                    type="number"
                    className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Prazo máximo (dias)
                  </label>
                  <Input
                    value={novoPrazoMax}
                    onChange={(e) => setNovoPrazoMax(e.target.value)}
                    type="number"
                    className="rounded-xl border-border focus:border-[#c4d0ff]/50"
                  />
                </div>
              </div>

              {/* Descrição personalizada */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Descrição personalizada
                </label>
                <Textarea
                  value={novoDescricao}
                  onChange={(e) => setNovoDescricao(e.target.value)}
                  placeholder="Ex: Entrega rápida e segura em todo o Brasil"
                  className="rounded-xl border-border focus:border-[#c4d0ff]/50 min-h-[80px]"
                />
              </div>

              {/* Outras configurações */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-3">Outras configurações</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Pré-Selecionada</span>
                    <Switch checked={novoPreSelecionada} onCheckedChange={setNovoPreSelecionada} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Ativo</span>
                    <Switch 
                      checked={novoAtivo} 
                      onCheckedChange={setNovoAtivo}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowNovoFrete(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSalvarNovoFrete}
                className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 rounded-xl shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)]"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Configurar Frete */}
      <Dialog open={showConfigFrete !== null} onOpenChange={() => setShowConfigFrete(null)}>
        <DialogContent className="max-w-md bg-white dark:bg-card border-border p-0 rounded-2xl overflow-hidden">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Truck size={20} />
                Configurar Frete
              </DialogTitle>
            </DialogHeader>

            {showConfigFrete && (() => {
              const frete = fretes.find(f => f.id === showConfigFrete)
              if (!frete) return null
              
              return (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Nome do método
                    </label>
                    <Input
                      value={frete.nome}
                      className="rounded-xl border-border"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Preço (R$)
                      </label>
                      <Input
                        value={`R$ ${frete.preco.toFixed(2).replace('.', ',')}`}
                        className="rounded-xl border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Prazo
                      </label>
                      <Input
                        value={`${frete.prazoMin}-${frete.prazoMax} dias`}
                        className="rounded-xl border-border"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium text-foreground">Status</span>
                    <Badge 
                      className={`${
                        frete.ativo 
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                          : 'bg-gray-500/10 text-gray-600 border-gray-500/30'
                      }`}
                    >
                      {frete.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              )
            })()}

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowConfigFrete(null)}
                className="rounded-xl"
              >
                Fechar
              </Button>
              <Button 
                className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 rounded-xl shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)]"
              >
                Salvar alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  )
}
