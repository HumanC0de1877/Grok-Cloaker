'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Activity,
  Globe,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Bot,
  UserCheck,
  ShieldX,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Componente de Stat Card
const StatCard: React.FC<{
  title: string
  value: string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
  accentColor?: string
}> = ({ title, value, description, trend, trendValue, icon, accentColor = 'border-l-white' }) => (
  <Card className={`relative flex flex-col border-l-[3px] ${accentColor} border-y border-r border-[#1f1f23] rounded-2xl bg-[#0a0a0a] shadow-none`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
        {icon}
        {title}
      </div>
      <MoreHorizontal className="h-5 w-5 text-gray-500 cursor-pointer hover:text-white transition-colors" />
    </CardHeader>
    <CardContent className="px-6 pb-6 pt-2">
      <div className="text-4xl font-bold text-white">{value}</div>
      {(trend || description) && (
        <div className="flex items-center gap-2 mt-3">
          {trend && (
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-xs font-semibold text-white">
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : trend === 'down' ? <ArrowDownRight className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              {trendValue}
            </div>
          )}
          {description && <span className="text-xs text-gray-500 font-medium">{description}</span>}
        </div>
      )}
    </CardContent>
  </Card>
)

export const InicioDashboard: React.FC = () => {
  const [period, setPeriod] = useState('30d')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const trafficSources = [
    { icon: Globe, name: 'Facebook Ads', percentage: 65, value: '28.450' },
    { icon: Zap, name: 'TikTok Ads', percentage: 20, value: '8.210' },
    { icon: Activity, name: 'Google Ads', percentage: 10, value: '4.520' },
    { icon: Shield, name: 'Outros/Direct', percentage: 5, value: '2.100' },
  ]

  const recentEvents = [
    { id: '1', type: 'Bloqueio', reason: 'Facebook Bot', ip: '157.240.12.35', time: 'Há 2 min', status: 'blocked' },
    { id: '2', type: 'Permitido', reason: 'Real User', ip: '189.5.122.10', time: 'Há 5 min', status: 'allowed' },
    { id: '3', type: 'Bloqueio', reason: 'AdSpy Tool', ip: '45.12.33.91', time: 'Há 8 min', status: 'blocked' },
  ]

  return (
    <TooltipProvider>
      <ScrollArea className="flex-1 h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Geral</h1>
              <p className="text-sm text-gray-400 font-medium mt-1">Métricas em tempo real de tráfego filtrado e vendas</p>
            </div>
            <div className="flex items-center gap-3">
              
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[150px] rounded-xl bg-[#1a1a1e] border-[#1f1f23] text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1e] border-[#1f1f23]">
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="rounded-xl border-[#1f1f23] bg-[#1a1a1e]">
                <RefreshCw className="h-4 w-4 text-gray-400" />
              </Button>

              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Relatório Full
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Coluna Principal */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Money Page Clicks (Vendas)"
                  value="12.482"
                  trend="up"
                  trendValue="12%"
                  description="vs. ontem"
                  icon={<UserCheck className="h-4 w-4 text-emerald-500" />}
                  accentColor="border-l-emerald-500"
                />
                <StatCard
                  title="Bots & Moderadores (Bloqueios)"
                  value="4.821"
                  trend="down"
                  trendValue="5%"
                  description="vs. período anterior"
                  icon={<ShieldX className="h-4 w-4 text-red-500" />}
                  accentColor="border-l-red-500"
                />
              </div>

              {/* Gráfico / Feed Principal */}
              <Card className="rounded-2xl border-[#1f1f23] bg-[#0a0a0a] shadow-none">
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-white">Fluxo de Tráfego em Tempo Real</CardTitle>
                    </div>
                    <Tabs defaultValue="chart">
                      <TabsList className="bg-[#111] border border-[#1f1f23] rounded-lg h-9 p-1">
                        <TabsTrigger value="chart" className="text-xs font-medium px-4 rounded-md data-[state=active]:bg-[#1a1a1e] data-[state=active]:text-white text-gray-500">Gráfico</TabsTrigger>
                        <TabsTrigger value="table" className="text-xs font-medium px-4 rounded-md data-[state=active]:bg-[#1a1a1e] data-[state=active]:text-white text-gray-500">Tabela</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0">
                  <Tabs defaultValue="chart">
                    <TabsContent value="chart" className="mt-8">
                       <div className="h-[250px] w-full flex items-end gap-2 px-2">
                          {[40, 65, 80, 55, 90, 45, 70, 95, 60, 85, 30, 75, 50, 88, 42, 68, 77, 59, 92, 44].map((h, i) => (
                            <div key={i} className="flex-1 group relative cursor-help">
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0f0f11] border border-[#1f1f23] px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-white z-20">
                                 {h * 12} cliques
                               </div>
                               <div className="w-full bg-[#1f1f23] rounded-t-lg transition-all hover:bg-indigo-500/50" style={{ height: `${h}%` }}>
                                  <div className="w-full bg-indigo-500/40 rounded-t-lg" style={{ height: `${h * 0.4}%` }} />
                               </div>
                            </div>
                          ))}
                       </div>
                       <div className="flex justify-between mt-6 px-2 text-[10px] font-semibold text-gray-500">
                          <span>19:00</span>
                          <span>19:15</span>
                          <span>19:30</span>
                          <span>19:45</span>
                          <span>Hoje</span>
                       </div>
                    </TabsContent>
                    <TabsContent value="table" className="mt-0">
                       <Table>
                        <TableHeader className="bg-[#0f0f11]">
                          <TableRow className="border-[#1f1f23] hover:bg-transparent">
                            <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Evento</TableHead>
                            <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Origem / Motivo</TableHead>
                            <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Visitante (IP)</TableHead>
                            <TableHead className="text-gray-500 font-bold uppercase text-[10px] text-right">Tempo</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentEvents.map((ev) => (
                            <TableRow key={ev.id} className="border-[#1f1f23] hover:bg-[#2a2a2e]/20 transition-colors">
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] ${ev.status === 'blocked' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                  {ev.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-white text-xs font-semibold">{ev.reason}</TableCell>
                              <TableCell className="text-gray-400 text-xs font-mono">{ev.ip}</TableCell>
                              <TableCell className="text-right text-gray-500 text-[10px] italic">{ev.time}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-[#1f1f23] bg-[#0a0a0a] shadow-none">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="text-base font-bold text-white">Tráfego por Fonte</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-6">
                  {trafficSources.map((source, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-sm font-semibold text-white">
                          <span>{source.name}</span>
                          <span className="text-gray-400">{source.value}</span>
                        </div>
                        <Progress value={source.percentage} className="h-1 bg-[#1f1f23]" indicatorColor="bg-white" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Coluna Lateral - Dados Estruturados Brutalistas */}
            <div className="w-80 space-y-6">
              <Card className="rounded-2xl border-[#1f1f23] bg-[#0a0a0a] shadow-none">
                <CardHeader className="pb-4 pt-6 px-6">
                  <CardTitle className="text-base font-bold text-white">Desempenho do Filtro</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bloqueios por VPN/Proxy</p>
                    <p className="text-2xl font-bold text-white">4.182</p>
                  </div>
                  <Separator className="bg-[#1f1f23]" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bloqueios de Scrapers</p>
                    <p className="text-2xl font-bold text-white">821</p>
                  </div>
                  <Separator className="bg-[#1f1f23]" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Taxa de Permissão</p>
                    <p className="text-2xl font-bold text-emerald-500">68.2%</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-[#1f1f23] bg-[#0a0a0a] shadow-none">
                <CardHeader className="pb-4 pt-6 px-6">
                   <CardTitle className="text-base font-bold text-white">Top Localizações</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-4">
                  {[
                    { country: 'Brasil', val: '65%' },
                    { country: 'Estados Unidos', val: '15%' },
                    { country: 'Portugal', val: '10%' },
                  ].map((loc, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-400">{loc.country}</span>
                      <span className="text-sm font-bold text-white">{loc.val}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>
    </TooltipProvider>
  )
}
