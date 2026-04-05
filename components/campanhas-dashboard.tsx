'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Megaphone,
  Shield,
  Zap,
  Globe,
  Activity,
  CreditCard,
  Settings,
  ChevronRight,
  Filter,
  Eye,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  MousePointer2,
  Fingerprint,
  BarChart3,
  Globe2,
  Smartphone,
  Layout,
  Link2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'

export const CampanhasDashboard: React.FC = () => {
  const [view, setView] = useState<'list' | 'create'>('list')
  const [riskScore, setRiskScore] = useState([75])
  const [trafficSource, setTrafficSource] = useState('facebook')
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['BR', 'US', 'PT'])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['pt-BR', 'en-US'])
  const [filterBrowser, setFilterBrowser] = useState(true)

  const handleAutoOptimize = () => {
     setRiskScore([65])
     setFilterBrowser(true)
  }

  const toggleList = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
     if (list.includes(val)) setList(list.filter(i => i !== val))
     else setList([...list, val])
  }

  const campaigns = [
    {
      id: '1',
      name: 'Oferta Black Friday - FB',
      status: 'active',
      visitors: 12450,
      blocked: 3200,
      conversion: '12.5%',
      lastUpdate: '2 mins atrás',
    },
    {
      id: '2',
      name: 'Lançamento Produto X - TikTok',
      status: 'active',
      visitors: 8200,
      blocked: 1540,
      conversion: '8.2%',
      lastUpdate: '15 mins atrás',
    },
    {
      id: '3',
      name: 'Google Discovery - Teste',
      status: 'paused',
      visitors: 4500,
      blocked: 980,
      conversion: '5.1%',
      lastUpdate: '1 hora atrás',
    },
  ]

  if (view === 'create') {
    return (
      <ScrollArea className="flex-1 h-screen">
        <div className="p-8 pb-20">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setView('list')} className="rounded-xl">
              <ChevronRight className="rotate-180" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Criar Nova Campanha</h1>
              <p className="text-gray-400 text-sm">Configure as regras de cloaking e filtros de proteção</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Main Config Area */}
            <div className="col-span-8 space-y-6">
              <Tabs defaultValue="geral" className="w-full">
                <TabsList className="bg-[#1a1a1e] p-1 rounded-xl w-full justify-start gap-2 h-12 border border-[#1f1f23]">
                  <TabsTrigger value="geral" className="data-[state=active]:bg-[#2a2a2e] rounded-lg px-6">Geral</TabsTrigger>
                  <TabsTrigger value="seguranca" className="data-[state=active]:bg-[#2a2a2e] rounded-lg px-6">Segurança</TabsTrigger>
                  <TabsTrigger value="filtragem" className="data-[state=active]:bg-[#2a2a2e] rounded-lg px-6">Filtragem</TabsTrigger>
                  <TabsTrigger value="segmentacao" className="data-[state=active]:bg-[#2a2a2e] rounded-lg px-6">Segmentação</TabsTrigger>
                  <TabsTrigger value="ia" className="data-[state=active]:bg-[#2a2a2e] rounded-lg px-6">
                    Filtros Dinâmicos
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Geral */}
                <TabsContent value="geral" className="mt-6 space-y-6">
                  <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Link2 size={18} className="text-blue-500" />
                        Configurações de Destino
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Nome da Campanha</Label>
                        <Input placeholder="Ex: Black Friday 2024" className="bg-[#1a1a1e] border-[#1f1f23] rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Safe URL (Página Segura)</Label>
                          <Input placeholder="https://site-seguro.com" className="bg-[#1a1a1e] border-[#1f1f23] rounded-xl" />
                          <p className="text-[10px] text-gray-500">URL para onde os bots e curiosos serão enviados</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Money URL (Página de Oferta)</Label>
                          <Input placeholder="https://oferta-vsl.com" className="bg-[#1a1a1e] border-[#1f1f23] rounded-xl" />
                          <p className="text-[10px] text-gray-500">URL real para tráfego qualificado</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Filter size={18} className="text-emerald-500" />
                        Parâmetros de Tracking (UTM)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <Label>Origem do Tráfego</Label>
                          <div className="flex items-center gap-2">
                             {[
                               { id: 'facebook', label: 'FB Ads' },
                               { id: 'google', label: 'Google' },
                               { id: 'tiktok', label: 'TikTok' },
                               { id: 'kwai', label: 'Kwai' }
                             ].map((nw) => (
                               <Button 
                                 key={nw.id}
                                 variant={trafficSource === nw.id ? "default" : "outline"}
                                 className={`flex-1 rounded-xl transition-all ${trafficSource === nw.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-[#111] border-[#1f1f23] text-gray-400 hover:text-white'}`}
                                 onClick={() => setTrafficSource(nw.id)}
                               >
                                  {nw.label}
                               </Button>
                             ))}
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                               onClick={handleAutoOptimize}
                               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 font-bold transition-all shadow-lg shadow-indigo-900/20"
                            >
                               <Zap size={16} className="text-yellow-400" />
                               Ativar Todas as Recomendações do Sistema
                            </Button>
                            <p className="text-[10px] text-gray-500 text-center mt-2">Ativa proteção máxima sem perdas: Limita bots de datacenter, configura o risco de IA (65%) e estabiliza o bypass.</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Prisma ID Personalizado</Label>
                          <Input defaultValue="PRISMA_123" className="bg-[#1a1a1e] border-[#1f1f23] rounded-xl" />
                        </div>
                      </div>
                      <div className="p-3 bg-[#1a1a1e] rounded-xl border border-[#1f1f23]">
                        <Label className="text-xs text-gray-400 mb-2 block uppercase">Template de URL Gerado:</Label>
                        <code className="text-[10px] text-emerald-400 break-all">
                          https://meudominio.com/?utm_source=FB&utm_campaign=&#123;&#123;campaign.name&#125;&#125;|&#123;&#123;campaign.id&#125;&#125;&utm_medium=&#123;&#123;adset.name&#125;&#125;|&#123;&#123;adset.id&#125;&#125;&utm_content=&#123;&#123;ad.name&#125;&#125;|&#123;&#123;ad.id&#125;&#125;&utm_term=&#123;&#123;placement&#125;&#125;&prismaid=PRISMA_123
                        </code>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs gap-2">
                          <Copy size={12} /> Copiar URL
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Segurança */}
                <TabsContent value="seguranca" className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Shield size={16} className="text-red-500" /> Networks & Bots
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Bloqueio de Moderadores</Label>
                            <p className="text-[10px] text-gray-500">Detectar ambientes de revisão de redes</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Bypass de Crawlers</Label>
                            <p className="text-[10px] text-gray-500">Previnir indexação por buscadores</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Filtro anti-AdSpy</Label>
                            <p className="text-[10px] text-gray-500">Bloquear ferramentas de espionagem</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Activity size={16} className="text-blue-500" /> Acesso de Rede
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Bloquear Proxy/VPN</Label>
                            <p className="text-[10px] text-gray-500">Impedir acessos mascarados</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Filtro de ISP (Provedores)</Label>
                            <p className="text-[10px] text-gray-500">Apenas tráfego residencial</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Whitelist de IP</Label>
                            <p className="text-[10px] text-gray-500">Permitir apenas IPs específicos</p>
                          </div>
                          <Button variant="outline" size="sm" className="h-7 text-[10px]">Configurar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab: IA */}
                <TabsContent value="ia" className="mt-6 space-y-6">
                  <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none border-l-4 border-l-white">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#111] flex items-center justify-center border border-[#1f1f23]">
                          <BarChart3 className="text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">Filtros Avançados & Machine Learning</CardTitle>
                          <CardDescription>Motor de decisão baseado em risco e comportamento</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-base">Sensibilidade do Score de Risco</Label>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                            {riskScore[0]} - Nível {riskScore[0] > 70 ? 'Agressivo' : 'Equilibrado'}
                          </Badge>
                        </div>
                        <Slider 
                          value={riskScore} 
                          onValueChange={setRiskScore} 
                          max={100} 
                          step={1} 
                          className="py-4"
                        />
                        <p className="text-xs text-gray-500">
                          Quanto maior o score, mais rigoroso será o filtro. Scores acima de 80 podem bloquear usuários reais com VPN.
                        </p>
                      </div>

                      <Separator className="bg-[#1f1f23]" />

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MousePointer2 size={18} className="text-purple-500" />
                              <div className="space-y-0.5">
                                <Label>Análise Comportamental</Label>
                                <p className="text-[10px] text-gray-500">Ritmo de cliques e scroll</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Fingerprint size={18} className="text-emerald-500" />
                              <div className="space-y-0.5">
                                <Label>Fingerprint de Dispositivo</Label>
                                <p className="text-[10px] text-gray-500">Identificação única por hardware</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <BarChart3 size={18} className="text-blue-500" />
                              <div className="space-y-0.5">
                                <Label>ML Adaptive Patterns</Label>
                                <p className="text-[10px] text-gray-500">Aprendizado contínuo</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Layout size={18} className="text-orange-500" />
                              <div className="space-y-0.5">
                                <Label>Classificação Dinâmica</Label>
                                <p className="text-[10px] text-gray-500">Auto-ajuste de filtros</p>
                              </div>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Segmentação */}
                <TabsContent value="segmentacao" className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Globe2 size={16} className="text-purple-500" /> Geolocalização
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Países Permitidos</Label>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {[
                              { code: 'BR', label: '🇧🇷 Brasil' },
                              { code: 'US', label: '🇺🇸 Estados Unidos' },
                              { code: 'PT', label: '🇵🇹 Portugal' },
                              { code: 'CO', label: '🇨🇴 Colômbia' },
                              { code: 'ES', label: '🇪🇸 Espanha' },
                            ].map(country => (
                              <Badge 
                                key={country.code}
                                variant={selectedCountries.includes(country.code) ? 'default' : 'outline'}
                                className={`cursor-pointer px-3 py-1 text-xs ${selectedCountries.includes(country.code) ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#111] border-[#1f1f23] text-gray-500 hover:text-white'}`}
                                onClick={() => toggleList(selectedCountries, setSelectedCountries, country.code)}
                              >
                                {country.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Idiomas do Navegador</Label>
                           <div className="flex flex-wrap gap-2 pt-1">
                            {[
                              { code: 'pt-BR', label: 'Português (BR)' },
                              { code: 'pt-PT', label: 'Português (PT)' },
                              { code: 'en-US', label: 'Inglês (US)' },
                              { code: 'es-ES', label: 'Espanhol' },
                            ].map(lang => (
                              <Badge 
                                key={lang.code}
                                variant={selectedLanguages.includes(lang.code) ? 'default' : 'outline'}
                                className={`cursor-pointer px-3 py-1 text-xs ${selectedLanguages.includes(lang.code) ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#111] border-[#1f1f23] text-gray-500 hover:text-white'}`}
                                onClick={() => toggleList(selectedLanguages, setSelectedLanguages, lang.code)}
                              >
                                {lang.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Smartphone size={16} className="text-emerald-500" /> Dispositivos e Navegadores
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-3 bg-[#111] rounded-xl border border-[#1f1f23]">
                             <div className="space-y-0.5">
                               <Label>Filtrar por Navegador</Label>
                               <p className="text-[10px] text-gray-500">Bloqueia acesso de navegadores sem suporte a JS ou emulados.</p>
                             </div>
                             <Switch checked={filterBrowser} onCheckedChange={setFilterBrowser} />
                           </div>
                        </div>
                        <Separator className="bg-[#1f1f23]" />
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                          <Label>Permitir Mobile</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Permitir Desktop</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Permitir Tablet</Label>
                          <Switch />
                        </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar Stats Area */}
            <div className="col-span-4 space-y-6">
              <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl sticky top-8 shadow-none">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Resumo da Campanha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Nível de Proteção</span>
                      <span className="text-emerald-500 font-medium">Máximo</span>
                    </div>
                    <div className="h-2 w-full bg-[#2a2a2e] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[95%]" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3 p-3 bg-[#0f0f11] rounded-xl border border-[#1f1f23]">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle size={16} className="text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400">Moderadores FB</p>
                        <p className="text-xs font-semibold text-white">Bloqueio Ativo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#0f0f11] rounded-xl border border-[#1f1f23]">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Fingerprint size={16} className="text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400">Fingerprinting</p>
                        <p className="text-xs font-semibold text-white">Ativo (ID Único)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#0f0f11] rounded-xl border border-[#1f1f23]">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400">Status Geral</p>
                        <p className="text-xs font-semibold text-white">Pronto para rodar</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl py-6 text-base font-semibold shadow-lg shadow-emerald-900/20">
                    <Zap size={18} className="mr-2" /> Salvar Campanha
                  </Button>
                  <Button variant="ghost" className="w-full text-gray-400 hover:text-white" onClick={() => setView('list')}>
                    Cancelar
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="flex-1 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Campanhas</h1>
          <p className="text-gray-400 text-sm mt-1">Visualize e gerencie suas campanhas de tráfego</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input 
              placeholder="Buscar campanha..." 
              className="bg-[#1a1a1e] border-[#1f1f23] pl-10 w-64 rounded-xl focus-visible:ring-indigo-500" 
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 shadow-lg shadow-indigo-900/20" onClick={() => setView('create')}>
            <Plus size={18} /> Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((c) => (
          <Card key={c.id} className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl hover:border-indigo-500/30 transition-all group overflow-hidden shadow-none">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  <Megaphone size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <Badge variant="outline" className={c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}>
                      {c.status === 'active' ? 'Ativa' : 'Pausada'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Link2 size={12} /> ID: {c.id}</span>
                    <span className="flex items-center gap-1"><Activity size={12} /> Último acesso: {c.lastUpdate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Visitantes</p>
                    <p className="text-lg font-bold text-white tracking-tight">{c.visitors.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 text-red-500">Bloqueados</p>
                    <p className="text-lg font-bold text-white tracking-tight">{c.blocked.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 text-emerald-500">Conv. VSL</p>
                    <p className="text-lg font-bold text-white tracking-tight">{c.conversion}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2e]">
                    <Eye size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2e]">
                    <Settings size={18} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2e]">
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1e] border-[#1f1f23]">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2"><Copy size={14} /> Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2"><Activity size={14} /> Ver Logs</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500"><Trash2 size={14} /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
