'use client'

import { useState, useMemo } from 'react'
import {
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
  Bot,
  UserCheck,
  ShieldX,
  ShieldAlert,
  Network,
  Route,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts'

// ─── KPI Card ───────────────────────────────────────────────────────────────
const KpiCard: React.FC<{
  title: string
  value: string | number
  icon: React.ReactNode
  accent?: string
  trend?: string
  trendUp?: boolean
  sub?: string
}> = ({ title, value, icon, accent = 'border-l-white', trend, trendUp, sub }) => (
  <Card className={`border-l-[3px] ${accent} border-y border-r border-[#1f1f23] bg-[#0a0a0a] rounded-2xl shadow-none`}>
    <CardHeader className="flex flex-row items-center justify-between pb-1 pt-5 px-5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
      <div className="text-gray-500">{icon}</div>
    </CardHeader>
    <CardContent className="px-5 pb-5 pt-1">
      <div className="text-4xl font-black text-white tracking-tight">{value}</div>
      {(trend || sub) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              {trend}
            </span>
          )}
          {sub && <span className="text-[10px] text-gray-600">{sub}</span>}
        </div>
      )}
    </CardContent>
  </Card>
)

// ─── Dados Mock ─────────────────────────────────────────────────────────────
const hourlyData = [
  { time: '00h', approved: 120, blocked: 45, bots: 20 },
  { time: '02h', approved: 80,  blocked: 30, bots: 10 },
  { time: '04h', approved: 60,  blocked: 20, bots: 8  },
  { time: '06h', approved: 140, blocked: 55, bots: 25 },
  { time: '08h', approved: 320, blocked: 180, bots: 90 },
  { time: '10h', approved: 480, blocked: 240, bots: 120 },
  { time: '12h', approved: 560, blocked: 310, bots: 145 },
  { time: '14h', approved: 490, blocked: 280, bots: 130 },
  { time: '16h', approved: 430, blocked: 210, bots: 95 },
  { time: '18h', approved: 380, blocked: 190, bots: 85 },
  { time: '20h', approved: 290, blocked: 140, bots: 60 },
  { time: '22h', approved: 210, blocked: 90, bots: 40 },
]

const sourceData = [
  { name: 'FB Ads',  approved: 8420, blocked: 3210, bots: 980 },
  { name: 'TikTok', approved: 4210, blocked: 1540, bots: 520 },
  { name: 'Google', approved: 2890, blocked: 820,  bots: 310 },
  { name: 'Kwai',   approved: 1200, blocked: 430,  bots: 180 },
]

const suspiciousEvents = [
  { id: 1, reason: 'Facebook Bot Detector',   ip: '157.240.12.35', country: '🇺🇸', score: 98, time: '2 min' },
  { id: 2, reason: 'AdSpy Tool (adspy.com)',   ip: '45.12.33.91',   country: '🇬🇧', score: 96, time: '5 min' },
  { id: 3, reason: 'Proxy/VPN Datacenter',    ip: '52.205.11.10',  country: '🇩🇪', score: 88, time: '8 min' },
  { id: 4, reason: 'Headless Browser (Crawl)', ip: '178.62.0.180',  country: '🇳🇱', score: 85, time: '12 min' },
  { id: 5, reason: 'TikTok Approval Bot',     ip: '1.36.8.14',     country: '🇸🇬', score: 82, time: '15 min' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111] border border-[#1f1f23] rounded-xl p-3 text-xs space-y-1 shadow-xl">
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="text-white font-bold">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export const InicioDashboard: React.FC = () => {
  const [period, setPeriod] = useState('30d')
  const [chartView, setChartView] = useState<'hourly' | 'source'>('hourly')

  const totalVolume   = useMemo(() => hourlyData.reduce((a, d) => a + d.approved + d.blocked, 0), [])
  const totalApproved = useMemo(() => hourlyData.reduce((a, d) => a + d.approved, 0), [])
  const totalFiltered = useMemo(() => hourlyData.reduce((a, d) => a + d.blocked, 0), [])

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Dashboard Geral</h1>
            <p className="text-sm text-gray-500 mt-1">Métricas em tempo real · Motor de Cloaking Ativo</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 rounded-xl bg-[#111] border-[#1f1f23] text-white text-xs">
                <Calendar className="mr-2 h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-[#1f1f23] text-white">
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="rounded-xl border-[#1f1f23] bg-[#111] hover:bg-[#1a1a1e]">
              <RefreshCw className="h-4 w-4 text-gray-400" />
            </Button>
            <Button className="rounded-xl bg-white text-black hover:bg-gray-200 text-xs font-bold">
              <Download className="mr-2 h-3 w-3" />
              Relatório
            </Button>
          </div>
        </div>

        {/* ── KPIs ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4">
          <KpiCard
            title="Volume de Tráfego"
            value={totalVolume.toLocaleString()}
            icon={<Activity size={16} />}
            accent="border-l-white"
            trend="+18%"
            trendUp
            sub="vs. período anterior"
          />
          <KpiCard
            title="Campanhas Ativas"
            value={2}
            icon={<Network size={16} />}
            accent="border-l-blue-500"
            sub="2 campanhas rodando"
          />
          <KpiCard
            title="Tráfego Aprovado"
            value={totalApproved.toLocaleString()}
            icon={<UserCheck size={16} />}
            accent="border-l-emerald-500"
            trend="+12%"
            trendUp
            sub="Hot leads para money page"
          />
          <KpiCard
            title="Tráfego Filtrado"
            value={totalFiltered.toLocaleString()}
            icon={<ShieldX size={16} />}
            accent="border-l-red-500"
            trend="-5%"
            trendUp={false}
            sub="Bots e moderadores bloqueados"
          />
        </div>

        {/* ── Main Chart + Sidebar ──────────────────────────────── */}
        <div className="grid grid-cols-12 gap-4">

          {/* Chart Principal */}
          <div className="col-span-8 space-y-4">
            <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
              <CardHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-white">Fluxo de Tráfego</CardTitle>
                  <p className="text-[11px] text-gray-500 mt-0.5">Aprovados vs Bloqueados vs Bots</p>
                </div>
                <div className="flex items-center gap-1 bg-[#111] border border-[#1f1f23] rounded-lg p-1">
                  <button
                    onClick={() => setChartView('hourly')}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-md transition-all ${chartView === 'hourly' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                    Por Hora
                  </button>
                  <button
                    onClick={() => setChartView('source')}
                    className={`text-[11px] font-semibold px-3 py-1 rounded-md transition-all ${chartView === 'source' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                    Por Fonte
                  </button>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartView === 'hourly' ? hourlyData : sourceData} barSize={chartView === 'hourly' ? 14 : 28} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                    <XAxis
                      dataKey={chartView === 'hourly' ? 'time' : 'name'}
                      tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Legend
                      formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 10, fontWeight: 600 }}>{v}</span>}
                      iconType="circle"
                      iconSize={6}
                    />
                    <Bar dataKey="approved" name="Aprovados" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="blocked"  name="Bloqueados" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="bots"     name="Bots"       stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Roteamento Inteligente */}
            <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
              <CardHeader className="px-6 pt-5 pb-3 flex flex-row items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#111] border border-[#1f1f23] flex items-center justify-center">
                  <Route size={15} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-white">Roteamento Inteligente</CardTitle>
                  <p className="text-[11px] text-gray-500">Split por fonte de tráfego</p>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0 space-y-4">
                {sourceData.map((src, i) => {
                  const total = src.approved + src.blocked + src.bots
                  const approvePct = Math.round((src.approved / total) * 100)
                  const blockPct  = Math.round((src.blocked / total) * 100)
                  const botPct    = Math.round((src.bots / total) * 100)
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{src.name}</span>
                        <div className="flex gap-3 text-[10px] font-semibold">
                          <span className="text-emerald-500">{approvePct}% pass</span>
                          <span className="text-red-500">{blockPct}% block</span>
                          <span className="text-amber-500">{botPct}% bots</span>
                        </div>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden gap-px">
                        <div className="bg-emerald-500 transition-all" style={{ width: `${approvePct}%` }} />
                        <div className="bg-red-500 transition-all"     style={{ width: `${blockPct}%` }} />
                        <div className="bg-amber-500 transition-all"   style={{ width: `${botPct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-4">

            {/* Atividade Suspeita */}
            <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
              <CardHeader className="px-5 pt-5 pb-3 flex flex-row items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <ShieldAlert size={15} className="text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-white">Atividade Suspeita</CardTitle>
                  <p className="text-[11px] text-gray-500">Detecções em tempo real</p>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5 pt-0 space-y-2">
                {suspiciousEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#111] border border-[#1f1f23] hover:border-red-500/20 transition-colors">
                    <span className="text-base">{ev.country}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-white truncate">{ev.reason}</p>
                      <p className="text-[9px] text-gray-500 font-mono">{ev.ip} · {ev.time} atrás</p>
                    </div>
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${ev.score >= 90 ? 'bg-red-500/15 text-red-500' : 'bg-orange-500/15 text-orange-500'}`}>
                      {ev.score}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Desempenho do Filtro */}
            <Card className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl shadow-none">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-sm font-bold text-white">Desempenho do Filtro</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-4">
                {[
                  { label: 'Bloqueios por VPN/Proxy', val: '4.182', color: 'text-red-500' },
                  { label: 'Bots & Crawlers',         val: '821',   color: 'text-amber-500' },
                  { label: 'AdSpy Tools',             val: '143',   color: 'text-orange-500' },
                  { label: 'Taxa de Permissão',       val: '68.2%', color: 'text-emerald-500' },
                ].map((item, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="bg-[#1f1f23] mb-4" />}
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
