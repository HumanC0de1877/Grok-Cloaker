'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  User,
  Shield,
  Bell,
  AlertTriangle,
  Lock,
  Info,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react'

interface Dominio {
  id: string
  url: string
  ativo: boolean
  sslAtivo: boolean
}

const prefixosSubdominio = [
  { id: 'pay', label: 'pay', descricao: 'Pagamento' },
  { id: 'checkout', label: 'checkout', descricao: 'Checkout' },
  { id: 'pagamento', label: 'pagamento', descricao: 'Pagamento' },
  { id: 'payment', label: 'payment', descricao: 'Payment' },
  { id: 'seguro', label: 'seguro', descricao: 'Seguro' },
  { id: 'secure', label: 'secure', descricao: 'Secure' },
  { id: 'comprar', label: 'comprar', descricao: 'Comprar' },
  { id: 'compra', label: 'compra', descricao: 'Compra' },
  { id: 'buy', label: 'buy', descricao: 'Buy' },
  { id: 'shop', label: 'shop', descricao: 'Shop' },
  { id: 'loja', label: 'loja', descricao: 'Loja' },
  { id: 'store', label: 'store', descricao: 'Store' },
  { id: 'pedido', label: 'pedido', descricao: 'Pedido' },
  { id: 'order', label: 'order', descricao: 'Order' },
]

export function DominiosDashboard() {
  const [dominios, setDominios] = useState<Dominio[]>([
    {
      id: '1',
      url: 'campanha-vsl.meudominio.com',
      ativo: true,
      sslAtivo: true
    }
  ])
  
  const [auth2FA, setAuth2FA] = useState(false)

  // Modal states
  const [showAddDominio, setShowAddDominio] = useState(false)
  const [showDNSConfig, setShowDNSConfig] = useState(false)
  const [selectedDominioForDNS, setSelectedDominioForDNS] = useState<Dominio | null>(null)
  
  // Add dominio form
  const [novoDominio, setNovoDominio] = useState('')
  const [prefixoSelecionado, setPrefixoSelecionado] = useState('campanha')
  const [copiedCNAME, setCopiedCNAME] = useState(false)
  const [copiedA, setCopiedA] = useState(false)

  const handleRemoverDominio = (id: string) => {
    setDominios(dominios.filter(d => d.id !== id))
  }

  const handleAdicionarDominio = () => {
    if (novoDominio) {
      const newDominio: Dominio = {
        id: Date.now().toString(),
        url: `${prefixoSelecionado}.${novoDominio}`,
        ativo: false,
        sslAtivo: false
      }
      setDominios([...dominios, newDominio])
      setShowAddDominio(false)
      setNovoDominio('')
      setPrefixoSelecionado('campanha')
    }
  }

  const handleVerDNS = (dominio: Dominio) => {
    setSelectedDominioForDNS(dominio)
    setShowDNSConfig(true)
  }

  const copyToClipboard = (text: string, type: 'cname' | 'a') => {
    navigator.clipboard.writeText(text)
    if (type === 'cname') {
      setCopiedCNAME(true)
      setTimeout(() => setCopiedCNAME(false), 2000)
    } else {
      setCopiedA(true)
      setTimeout(() => setCopiedA(false), 2000)
    }
  }

  const dominioPreview = novoDominio ? `${prefixoSelecionado}.${novoDominio}` : `${prefixoSelecionado}.meudominio.com`

  return (
    <>
      <ScrollArea className="flex-1 h-screen">
        <div className="p-8 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Gerenciamento de Domínios</h1>
            <p className="text-gray-400">Verifique e conecte seus domínios com arquitetura Proxy</p>
          </div>

          {/* Cloudflare Integration Info */}
          <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={20} className="text-indigo-500" />
              <h2 className="text-base font-semibold text-white">Método de Apontamento Cloudflare</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Utilizamos o modo <span className="text-white font-bold">Proxy (Nuvem Laranja)</span> da Cloudflare. 
              Isso garante que seu IP de origem fique oculto e que possamos aplicar as camadas de filtragem de IA antes mesmo do tráfego tocar no seu servidor.
            </p>
          </div>

          {/* Domínios da Loja */}
          <div className="bg-[#0a0a0a] border border-[#1f1f23] rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-indigo-400" />
                <h2 className="text-base font-semibold text-white">Domínios Conectados</h2>
              </div>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 shadow-lg shadow-indigo-900/20"
                onClick={() => setShowAddDominio(true)}
              >
                <Plus size={16} />
                Novo Domínio
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Gerencie os domínios utilizados para suas campanhas de cloaking.
            </p>

            <div className="space-y-3">
              {dominios.map((dominio) => (
                <Card key={dominio.id} className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#1f1f23] flex items-center justify-center text-white">
                      <Globe size={18} className="text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{dominio.url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {dominio.ativo && (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 rounded-md">
                            Ativo
                          </Badge>
                        )}
                        {dominio.sslAtivo && (
                          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-400 border-blue-500/30 rounded-md">
                            SSL Ativo
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => handleRemoverDominio(dominio.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 rounded-xl text-muted-foreground hover:text-white"
                    >
                      <RefreshCw size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-xl text-xs border-[#1f1f23] hover:bg-white/5"
                      onClick={() => handleVerDNS(dominio)}
                    >
                      Configuração DNS
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Modal Adicionar Domínio */}
      <Dialog open={showAddDominio} onOpenChange={setShowAddDominio}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-border max-w-md p-0 gap-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c4d0ff]/10 dark:bg-[#c4d0ff]/10 flex items-center justify-center">
                <Globe size={20} className="text-[#c4d0ff] dark:text-[#c4d0ff]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Adicionar domínio personalizado
                </DialogTitle>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Configure um domínio próprio para seu checkout
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-5">
            {/* Campo Domínio */}
            <div>
              <label className="text-sm font-medium text-zinc-900 dark:text-white mb-2 block">
                Seu domínio
              </label>
              <Input
                value={novoDominio}
                onChange={(e) => setNovoDominio(e.target.value)}
                placeholder="exemplo.com.br"
                className="bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder:text-zinc-400"
              />
            </div>

            {/* Prefixo do subdomínio */}
            <div>
              <label className="text-sm font-medium text-zinc-900 dark:text-white mb-3 block">
                Prefixo do subdomínio
              </label>
              <div className="flex flex-wrap gap-2">
                {prefixosSubdominio.map((prefixo) => (
                  <button
                    key={prefixo.id}
                    onClick={() => setPrefixoSelecionado(prefixo.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      prefixoSelecionado === prefixo.id
                        ? 'bg-[#c4d0ff] text-white border-[#c4d0ff]'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#c4d0ff] dark:hover:border-[#c4d0ff]'
                    }`}
                  >
                    {prefixoSelecionado === prefixo.id && <Check size={14} className="inline mr-1" />}
                    {prefixo.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-[#c4d0ff]/5 dark:bg-[#c4d0ff]/10 border border-[#c4d0ff] dark:border-[#c4d0ff]/30 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={16} className="text-[#c4d0ff] dark:text-[#c4d0ff]" />
                <span className="text-sm text-[#c4d0ff] dark:text-[#c4d0ff]">
                  Seu checkout ficará disponível em:
                </span>
              </div>
              <p className="text-base font-semibold text-[#c4d0ff] dark:text-[#c4d0ff]">
                {dominioPreview}
              </p>
            </div>

            {/* Aviso DNS */}
            <div className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
              <Info size={16} className="text-zinc-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Após adicionar o domínio, você precisará configurar registros DNS no seu provedor.{' '}
                <a href="#" className="text-[#c4d0ff] dark:text-[#c4d0ff] underline inline-flex items-center gap-1">
                  Ver tutorial de configuração
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddDominio(false)}
                className="rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAdicionarDominio}
                disabled={!novoDominio}
                className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)] rounded-xl"
              >
                Adicionar domínio
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Configuração DNS */}
      <Dialog open={showDNSConfig} onOpenChange={setShowDNSConfig}>
        <DialogContent className="bg-white dark:bg-zinc-900 border-border max-w-lg p-0 gap-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
              Configuração DNS
            </DialogTitle>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Configure os registros DNS no seu provedor de domínio para ativar{' '}
              <span className="text-[#c4d0ff] dark:text-[#c4d0ff]">{selectedDominioForDNS?.url}</span>
            </p>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-5">
            {/* Tabela de registros */}
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 flex items-center gap-2">
                <Globe size={16} className="text-[#c4d0ff] dark:text-[#c4d0ff]" />
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  Registros DNS necessários
                </span>
              </div>
              
              <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {/* Header */}
                <div className="grid grid-cols-[60px_80px_1fr_40px] px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase">
                  <div>TYPE</div>
                  <div>NAME</div>
                  <div>VALUE</div>
                  <div></div>
                </div>
                
                {/* CNAME Record */}
                <div className="grid grid-cols-[60px_80px_1fr_40px] px-4 py-3 items-center">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">CNAME</div>
                  <div className="text-sm text-[#c4d0ff] dark:text-[#c4d0ff]">pedido</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400 truncate pr-2">
                    ba8525e53af3315a.vercel-d...
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => copyToClipboard('ba8525e53af3315a.vercel-dns.com', 'cname')}
                  >
                    {copiedCNAME ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </Button>
                </div>
                
                {/* A Record */}
                <div className="grid grid-cols-[60px_80px_1fr_40px] px-4 py-3 items-center">
                  <div className="text-sm font-medium text-zinc-900 dark:text-white">A</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">@</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">76.76.21.21</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => copyToClipboard('76.76.21.21', 'a')}
                  >
                    {copiedA ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Instruções */}
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                Como configurar:
              </p>
              <ol className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <li>1. Acesse o painel de controle do seu provedor de domínio</li>
                <li>
                  2. Adicione o registro CNAME com nome{' '}
                  <span className="text-[#c4d0ff] dark:text-[#c4d0ff]">pedido</span>
                </li>
                <li>3. Configure todos os valores exatamente como mostrado</li>
                <li>
                  4. Aguarde alguns minutos{' '}
                  <span className="text-zinc-400">(a propagação DNS pode levar até 48h)</span>{' '}
                  e clique em verificar
                </li>
              </ol>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDNSConfig(false)}
                className="rounded-xl border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
              >
                Fechar
              </Button>
              <Button 
                className="bg-[#1a1a1f] hover:bg-[#2a2a2f] text-white border border-[#c4d0ff]/30 shadow-[0_0_10px_rgba(196,208,255,0.2)] hover:shadow-[0_0_15px_rgba(196,208,255,0.3)] rounded-xl"
              >
                Verificar configuração
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
