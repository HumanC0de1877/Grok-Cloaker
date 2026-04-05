'use client'

import React, { useState } from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Settings,
  Eye,
  Megaphone,
  Link2,
  Activity,
  Filter,
  Zap,
  Globe2,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Layout,
  MousePointer2,
  Copy,
  Trash2,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const CampanhasDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // States para formulação da campanha
  const [riskScore, setRiskScore] = useState([75])
  const [trafficSource, setTrafficSource] = useState('facebook')
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['BR', 'US', 'PT'])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['pt-BR', 'en-US'])
  const [filterBrowser, setFilterBrowser] = useState(true)
  const [sysRecommendations, setSysRecommendations] = useState(false)

  // Estado Pós-Salvamento
  const [savedCampaign, setSavedCampaign] = useState<{hash: string, paramUrl: string} | null>(null)

  const handleToggleRecommendations = (active: boolean) => {
     setSysRecommendations(active)
     if (active) {
       setRiskScore([65])
       setFilterBrowser(true)
     } else {
       setRiskScore([75])
     }
  }

  const toggleList = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
     if (list.includes(val)) setList(list.filter(i => i !== val))
     else setList([...list, val])
  }

  const handleSaveCampaign = () => {
    // Simulando geração de hash
    const fakeHash = Math.random().toString(36).substring(2, 8).toUpperCase()
    let utmStr = '?utm_source=FB&utm_campaign=__CMP__'
    if (trafficSource === 'tiktok') utmStr = '?utm_source=tiktok&utm_campaign=__CMP__'
    if (trafficSource === 'google') utmStr = '?utm_source=google&utm_campaign=__CMP__'
    
    setSavedCampaign({
      hash: fakeHash,
      paramUrl: `${utmStr}&prismaid=MEUPASSAPORTE123`
    })
  }

  const closeAndResetModal = () => {
     setIsModalOpen(false)
     setTimeout(() => setSavedCampaign(null), 300)
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
  ]

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
              className="bg-[#1a1a1e] border-[#1f1f23] pl-10 w-64 rounded-xl focus-visible:ring-indigo-500 text-white" 
            />
          </div>
          <Button className="bg-[#b81d77] hover:bg-[#9a1561] text-white rounded-xl gap-2 shadow-lg transition-all" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((c) => (
          <Card key={c.id} className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl hover:border-indigo-500/30 transition-all group overflow-hidden shadow-none">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#1f1f23] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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
                    <DropdownMenuContent align="end" className="bg-[#1a1a1e] border-[#1f1f23] text-white">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#1f1f23]" />
                      <DropdownMenuItem className="gap-2 focus:bg-[#2a2a2e]"><Copy size={14} /> Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 focus:bg-[#2a2a2e]"><Activity size={14} /> Ver Logs</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#1f1f23]" />
                      <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10"><Trash2 size={14} /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0a0a0a] border-[#1f1f23] text-white max-w-2xl p-0 overflow-hidden sm:rounded-3xl flex flex-col max-h-[90vh]">
          {savedCampaign ? (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in">
                 <CheckCircle2 size={32} className="text-emerald-500" />
               </div>
               <h2 className="text-2xl font-bold">Campanha Criada e Roteada!</h2>
               <p className="text-gray-400 text-sm">A dupla blindagem foi configurada. Copie os parâmetros abaixo para seu anúncio e pixel.</p>
               
               <div className="w-full text-left space-y-4">
                 <div className="bg-[#111] p-4 rounded-xl border border-[#1f1f23]">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Passo 1: Diretório Seguro (URL da Campanha)</p>
                   <code className="text-emerald-400 font-mono font-bold block text-sm">
                     https://seusite.com/{savedCampaign.hash}/
                   </code>
                 </div>
                 
                 <div className="bg-[#111] p-4 rounded-xl border border-[#1f1f23]">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Passo 2: Parâmetros de Tracking e Validador</p>
                   <code className="text-indigo-400 font-mono text-xs break-all block">
                     {savedCampaign.paramUrl}
                   </code>
                 </div>
               </div>

               <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl w-full text-left text-sm text-orange-400 flex items-start gap-3">
                 <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                 <p>Se o tráfego acessar a URL do diretório <strong>SEM</strong> o parâmetro exato de Prisma ID, será enviado direto para a página segura (White).</p>
               </div>

               <Button className="w-full h-12 bg-white text-black hover:bg-gray-200 mt-4 font-bold rounded-xl" onClick={closeAndResetModal}>
                 Concluir e Voltar
               </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="p-6 border-b border-[#1f1f23] pb-4 sticky top-0 bg-[#0a0a0a] z-10 flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">Criar Nova Campanha</DialogTitle>
                  <CardDescription className="text-gray-400 mt-1 text-sm">Formato Otimizado</CardDescription>
                </div>
                <div className="flex items-center gap-3 bg-[#111] border border-[#1f1f23] p-2 pr-4 rounded-full">
                   <div className="bg-emerald-500/20 p-1.5 rounded-full"><Zap size={14} className="text-emerald-500" /></div>
                   <div className="flex flex-col">
                     <span className="text-[10px] uppercase text-gray-500 font-bold leading-none mb-1">Recomendações do Sistema</span>
                     <div className="flex items-center gap-2">
                       <span className="text-xs text-white">{sysRecommendations ? 'Ativado' : 'Ajuste Manual'}</span>
                       <Switch checked={sysRecommendations} onCheckedChange={handleToggleRecommendations} className="scale-75 origin-left data-[state=checked]:bg-emerald-500" />
                     </div>
                   </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-6 pb-6">
                  {/* Traffic Sources on Top */}
                  <div className="space-y-3">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Origem de Tráfego</Label>
                    <div className="flex items-center gap-2 bg-[#111] p-1.5 rounded-xl border border-[#1f1f23]">
                        {[
                          { id: 'facebook', label: 'FB Ads' },
                          { id: 'google', label: 'Google' },
                          { id: 'tiktok', label: 'TikTok' },
                          { id: 'kwai', label: 'Kwai' }
                        ].map((nw) => (
                          <Button 
                            key={nw.id}
                            variant="ghost"
                            className={`flex-1 rounded-lg h-9 text-xs transition-all ${trafficSource === nw.id ? 'bg-white text-black shadow-sm font-semibold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setTrafficSource(nw.id)}
                          >
                            {nw.label}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <Accordion type="multiple" defaultValue={['geral', 'segmentacao', 'ia']} className="w-full space-y-4">
                    {/* Geral Accordion */}
                    <AccordionItem value="geral" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3">
                           <Link2 size={16} className="text-[#b81d77]" /> Links Principais
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="space-y-2">
                          <Label>Nome da Campanha</Label>
                          <Input placeholder="Ex: Campanha de Ticket Alto" className="bg-[#0a0a0a] border-[#1f1f23] rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label>Safe URL <span className="text-emerald-500 text-[10px] ml-1">(Página Segura)</span></Label>
                            <Input placeholder="https://..." className="bg-[#0a0a0a] border-[#1f1f23] rounded-xl" />
                          </div>
                          <div className="space-y-1">
                            <Label>Money URL <span className="text-red-500 text-[10px] ml-1">(Página de Oferta)</span></Label>
                            <Input placeholder="https://..." className="bg-[#0a0a0a] border-[#1f1f23] rounded-xl" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Segmentacao Accordion */}
                    <AccordionItem value="segmentacao" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3">
                           <Globe2 size={16} className="text-blue-500" /> Segmentação e Dispositivos
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-6 pt-2 pb-4">
                         <div className="space-y-3">
                            <Label>Países Permitidos</Label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { code: 'BR', label: '🇧🇷 Brasil' },
                                { code: 'US', label: '🇺🇸 Estados Unidos' },
                                { code: 'PT', label: '🇵🇹 Portugal' },
                                { code: 'CO', label: '🇨🇴 Colômbia' },
                                { code: 'ES', label: '🇪🇸 Espanha' },
                              ].map(country => (
                                <Badge 
                                  key={country.code}
                                  variant="outline"
                                  className={`cursor-pointer px-3 py-1 text-xs ${selectedCountries.includes(country.code) ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#0a0a0a] border-[#1f1f23] text-gray-500 hover:text-white'}`}
                                  onClick={() => toggleList(selectedCountries, setSelectedCountries, country.code)}
                                >
                                  {country.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label>Idiomas Exclusivos</Label>
                             <div className="flex flex-wrap gap-2">
                              {[
                                { code: 'pt-BR', label: 'Português (BR)' },
                                { code: 'pt-PT', label: 'Português (PT)' },
                                { code: 'en-US', label: 'Inglês (US)' },
                                { code: 'es-ES', label: 'Espanhol' },
                              ].map(lang => (
                                <Badge 
                                  key={lang.code}
                                  variant="outline"
                                  className={`cursor-pointer px-3 py-1 text-xs ${selectedLanguages.includes(lang.code) ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#0a0a0a] border-[#1f1f23] text-gray-500 hover:text-white'}`}
                                  onClick={() => toggleList(selectedLanguages, setSelectedLanguages, lang.code)}
                                >
                                  {lang.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-[#1f1f23]">
                             <div className="space-y-0.5">
                               <Label>Filtrar por Navegador</Label>
                               <p className="text-[10px] text-gray-500">Bloqueia emuladores e botnets</p>
                             </div>
                             <Switch checked={filterBrowser} onCheckedChange={setFilterBrowser} className="data-[state=checked]:bg-[#b81d77]" />
                          </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* IA Accordion */}
                    <AccordionItem value="ia" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3">
                           <Layout size={16} className="text-orange-500" /> Inteligência de Risco
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Sensibilidade do Score</Label>
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                            Rigor: {riskScore[0]}%
                          </Badge>
                        </div>
                        <Slider 
                          value={riskScore} 
                          onValueChange={setRiskScore} 
                          max={100} 
                          step={1} 
                          disabled={sysRecommendations}
                          className="py-4"
                        />
                        {sysRecommendations && (
                          <p className="text-[10px] text-emerald-500">Travado pelar recomendações globais para proteção estrita contra ad-crawlers.</p>
                        )}
                        <div className="flex flex-col space-y-4 pt-4 border-t border-[#1f1f23]">
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Machine Learning Adaptativo</Label>
                             <Switch defaultChecked disabled={sysRecommendations} className="data-[state=checked]:bg-orange-500" />
                          </div>
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Classificação Inteligente (Auto-Block)</Label>
                             <Switch defaultChecked disabled={sysRecommendations} className="data-[state=checked]:bg-orange-500" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Fingerprint & Comportamental */}
                    <AccordionItem value="fingerprint" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3">
                           <Fingerprint size={16} className="text-emerald-500" /> Fingerprint e Comportamento
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Canvas & WebGL Fingerprint</Label>
                             <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                          </div>
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Análise de Mouse & Scroll (Tracker)</Label>
                             <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                          </div>
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Audio & Font Hardware Checks</Label>
                             <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                          </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Bot & Adspy */}
                    <AccordionItem value="bots" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3">
                           <AlertTriangle size={16} className="text-red-500" /> Rede, Bots & AdSpy
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Bloqueio Redes (FB/GGL/TK)</Label>
                             <Switch defaultChecked disabled={sysRecommendations} className="data-[state=checked]:bg-red-500" />
                          </div>
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Filtro de Bots & Crawlers</Label>
                             <Switch defaultChecked disabled={sysRecommendations} className="data-[state=checked]:bg-red-500" />
                          </div>
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Bloquear AdSpy/Plexity Tools</Label>
                             <Switch defaultChecked className="data-[state=checked]:bg-red-500" />
                          </div>
                          <div className="flex items-center justify-between">
                             <Label className="text-xs">Proxy, VPN & Datacenter ASN</Label>
                             <Switch defaultChecked className="data-[state=checked]:bg-red-500" />
                          </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>

              <DialogFooter className="border-t border-[#1f1f23] bg-[#0a0a0a] p-4 flex gap-3">
                 <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setIsModalOpen(false)}>
                   Cancelar
                 </Button>
                 <Button className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl" onClick={handleSaveCampaign}>
                   <CheckCircle2 size={16} className="mr-2" /> Salvar Campanha
                 </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
