'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  Download,
  Activity,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Globe,
  Monitor,
  Smartphone,
  ExternalLink,
  ChevronRight,
  User,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const LogsDashboard: React.FC = () => {
  const [filter, setFilter] = useState('all')

  const logs = [
    {
      id: '1',
      time: '19:42:01',
      ip: '189.5.12.87',
      campaign: 'Oferta Black Friday - FB',
      country: 'BR',
      device: 'Mobile',
      platform: 'Facebook Ads',
      status: 'blocked',
      reason: 'Network Crawler (FB)',
      score: 98,
    },
    {
      id: '2',
      time: '19:41:45',
      ip: '172.67.142.10',
      campaign: 'Lançamento Produto X',
      country: 'US',
      device: 'Desktop',
      platform: 'TikTok Ads',
      status: 'allowed',
      reason: 'Real User Verified',
      score: 12,
    },
    {
      id: '3',
      time: '19:40:12',
      ip: '200.141.201.55',
      campaign: 'Oferta Black Friday - FB',
      country: 'BR',
      device: 'Mobile',
      platform: 'Facebook Ads',
      status: 'allowed',
      reason: 'Low Risk Score',
      score: 25,
    },
    {
      id: '4',
      time: '19:39:55',
      ip: '104.28.15.22',
      campaign: 'Oferta Black Friday - FB',
      country: 'CA',
      device: 'Desktop',
      platform: 'Direct',
      status: 'blocked',
      reason: 'VPN/Proxy Detected',
      score: 85,
    },
    {
      id: '5',
      time: '19:38:20',
      ip: '66.249.66.1',
      campaign: 'Google Discovery - Teste',
      country: 'US',
      device: 'Desktop',
      platform: 'Google Ads',
      status: 'blocked',
      reason: 'Googlebot identified',
      score: 100,
    },
  ]

  const stats = [
    { label: 'Total Hoje', value: '45.280', color: 'text-white' },
    { label: 'Humano/Vendas', value: '38.120', color: 'text-emerald-500' },
    { label: 'Bots Bloqueados', value: '6.540', color: 'text-red-500' },
    { label: 'Curiosos/VPN', value: '620', color: 'text-orange-500' },
  ]

  return (
    <div className="flex-1 h-screen flex flex-col p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Logs de Tráfego em Real-Time</h1>
          <p className="text-gray-400 text-sm">Monitoramento avançado de acessos e filtragem</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-[#111] border-[#1f1f23] rounded-xl gap-2 hover:bg-[#1a1a1e]">
            <Download size={18} /> Exportar CSV
          </Button>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Live Feed
          </div>
        </div>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
        {stats.map((s, i) => (
          <Card key={i} className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl p-4 shadow-none">
            <p className="text-[10px] text-gray-400 font-semibold mb-1 tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-none">
        <div className="p-4 border-b border-[#1f1f23] flex items-center justify-between bg-[#1f1f23]/30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input 
                placeholder="Filtrar por IP ou Campanha..." 
                className="bg-[#0f0f11] border-[#1f1f23] pl-9 w-80 h-10 rounded-xl focus-visible:ring-indigo-500" 
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="bg-[#0f0f11] border-[#1f1f23] w-48 h-10 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f11] border-[#1f1f23]">
                <SelectItem value="all">Todos os Acessos</SelectItem>
                <SelectItem value="allowed">Apenas Permitidos</SelectItem>
                <SelectItem value="blocked">Apenas Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Filter size={18} className="text-gray-500" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <Table>
            <TableHeader className="bg-[#0f0f11] sticky top-0 z-10">
              <TableRow className="border-[#1f1f23] hover:bg-transparent">
                <TableHead className="text-gray-500 font-bold uppercase text-[10px] py-4">Horário</TableHead>
                <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Origem / Campanha</TableHead>
                <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Visitante (IP / Geo)</TableHead>
                <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Dispositivo</TableHead>
                <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Score de Risco</TableHead>
                <TableHead className="text-gray-500 font-bold uppercase text-[10px]">Ação / Motivo</TableHead>
                <TableHead className="text-gray-500 font-bold uppercase text-[10px] text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-[#1f1f23] hover:bg-[#2a2a2e]/20 transition-colors group">
                  <TableCell className="text-gray-400 text-xs font-medium">{log.time}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-semibold">{log.campaign}</span>
                      <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">{log.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <span className="text-white text-xs font-mono">{log.ip}</span>
                       <Badge variant="outline" className="text-[10px] bg-[#0f0f11] border-[#1f1f23]">{log.country}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-500">
                      {log.device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                      <span className="text-xs">{log.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-12 h-1.5 bg-[#0f0f11] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${log.score > 70 ? 'bg-red-500' : log.score > 30 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${log.score}%` }} 
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${log.score > 70 ? 'text-red-500' : log.score > 30 ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {log.score}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.status === 'blocked' ? (
                        <ShieldAlert size={14} className="text-red-500" />
                      ) : (
                        <ShieldCheck size={14} className="text-emerald-500" />
                      )}
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-none ${log.status === 'blocked' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {log.status === 'blocked' ? 'BLOQUEADO' : 'PERMITIDO'}
                        </span>
                        <span className="text-[10px] text-gray-500">{log.reason}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={14} className="text-gray-400 hover:text-white" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        
        <div className="p-4 border-t border-[#1f1f23] flex items-center justify-between text-xs text-gray-500 bg-[#0f0f11]">
          <div>Mostrando 5 de 45.280 logs nas últimas 24h</div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" disabled className="text-gray-600">Anterior</Button>
             <div className="flex items-center gap-1">
               <Button variant="secondary" size="sm" className="h-7 w-7 p-0 rounded-lg bg-indigo-600 text-white">1</Button>
               <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">2</Button>
               <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">3</Button>
             </div>
             <Button variant="ghost" size="sm" className="hover:text-white">Próximo</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
