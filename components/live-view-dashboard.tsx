'use client'

import { useState, useEffect, useRef } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Formata valores em k, M etc.
function formatValue(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return `${val}`
}

// Gera ticks do eixo Y de forma progressiva: 0, 5k, 10k... até o máximo
function generateYTicks(maxVal: number): number[] {
  if (maxVal === 0) return [0]
  const rawStep = maxVal / 4
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude
  const ticks: number[] = []
  for (let i = 0; i <= maxVal + niceStep; i += niceStep) {
    ticks.push(i)
    if (i >= maxVal) break
  }
  return ticks
}

interface SalesChartProps {
  data: { label: string; value: number }[]
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1)
  const yTicks = generateYTicks(maxVal)
  const chartMax = yTicks[yTicks.length - 1] || 1

  return (
    <div className="w-full">
      <div className="flex gap-2">
        {/* Eixo Y */}
        <div className="flex flex-col-reverse justify-between text-right w-10 shrink-0" style={{ height: 120 }}>
          {yTicks.map((t) => (
            <span key={t} className="text-[10px] text-[#6b7280] leading-none">
              {formatValue(t)}
            </span>
          ))}
        </div>

        {/* Área das barras */}
        <div className="flex-1 flex flex-col gap-1">
          {/* Linhas de grid + barras */}
          <div className="relative" style={{ height: 120 }}>
            {/* Linhas de grid */}
            {yTicks.map((t) => (
              <div
                key={t}
                className="absolute w-full border-t border-[#1f1f23]"
                style={{ bottom: `${(t / chartMax) * 100}%` }}
              />
            ))}
            {/* Barras */}
            <div className="absolute inset-0 flex items-end gap-1 px-0.5">
              {data.map((d, i) => {
                const pct = chartMax > 0 ? (d.value / chartMax) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="relative w-full">
                      {/* Tooltip */}
                      {d.value > 0 && (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#1a1a1f] border border-[#2a2a2f] text-white text-[10px] px-2 py-1 rounded z-10 pointer-events-none">
                          R$ {d.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      <div
                        className="w-full rounded-t-sm transition-all duration-700 ease-out"
                        style={{
                          height: `${Math.max(pct * 1.2, pct > 0 ? 4 : 0)}px`,
                          background:
                            pct > 0
                              ? 'linear-gradient(to top, #ffffff, #f3f4f6)'
                              : '#1a1a1f',
                          boxShadow: pct > 0 ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Eixo X */}
          <div className="flex gap-1 px-0.5">
            {data.map((d, i) => (
              <div key={i} className="flex-1 text-center text-[9px] text-[#6b7280] truncate">
                {d.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricItemProps {
  label: string
  value: string
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 px-3 bg-[#0a0a0f]/40 rounded-lg border border-[#1f1f23]/50">
    <span className="text-[#9ca3af] text-sm">{label}</span>
    <span className="text-white font-semibold">{value}</span>
  </div>
)

// Componente Funil de Conversão com abas Gráfico/Barras
interface FunnelData {
  label: string
  completed: number
  total: number
  percentage: number
}

interface ConversionFunnelProps {
  data: FunnelData[]
  leadsToday: number
  avgTime: string
  totalConversion: number
  activeLeads: number
  updatedAt: string
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  data,
  leadsToday,
  avgTime,
  totalConversion,
  activeLeads,
  updatedAt,
}) => {
  const [activeTab, setActiveTab] = useState<'grafico' | 'barras'>('grafico')

  return (
    <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-foreground" />
            <CardTitle className="text-base font-bold">Funil de Conversão</CardTitle>
            <Badge variant="secondary" className="rounded-lg">{totalConversion}% conversão</Badge>
          </div>
          <span className="text-muted-foreground text-xs">
            {activeLeads} leads ativos · Atualizado às {updatedAt}
          </span>
        </div>
      </CardHeader>
      <CardContent>

        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted/30 rounded-xl">
          <div>
            <div className="text-muted-foreground text-xs mb-1">Leads Hoje</div>
            <div className="text-2xl font-bold text-foreground">{leadsToday}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Tempo Médio</div>
            <div className="text-2xl font-bold text-foreground">{avgTime}</div>
          </div>
        </div>

        {/* Abas */}
        <Tabs defaultValue="grafico" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 rounded-xl h-10">
            <TabsTrigger 
              value="grafico" 
              onClick={() => setActiveTab('grafico')}
              className="rounded-lg"
            >
              Gráfico
            </TabsTrigger>
            <TabsTrigger 
              value="barras" 
              onClick={() => setActiveTab('barras')}
              className="rounded-lg"
            >
              Barras
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Conteúdo baseado na aba */}
        {activeTab === 'grafico' ? (
          <>
            {/* Gráfico de barras verticais empilhadas */}
            <div className="flex items-end justify-around gap-4 h-32 mb-4">
              {data.map((item, idx) => {
                const height = item.percentage > 0 ? Math.max(item.percentage, 10) : 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full rounded-t-xl relative overflow-hidden"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute inset-0 bg-muted/50" />
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-foreground to-foreground/80 rounded-t-xl flex items-center justify-center"
                        style={{ height: item.percentage > 0 ? '100%' : '0%' }}
                      >
                        <div className="text-background text-xs font-medium">
                          {item.total > 0 ? (item.completed / 1000).toFixed(3) : '0.000'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Labels e percentuais */}
            <div className="flex justify-around gap-4 mb-4">
              {data.map((item, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <div className="text-muted-foreground text-xs mb-1">{item.label}</div>
                  <div className="text-foreground text-lg font-bold">{item.percentage}%</div>
                  <div className="text-muted-foreground text-xs">{item.completed} de {item.total}</div>
                </div>
              ))}
            </div>

            {/* Taxa de conversão total */}
            <div className="flex justify-end">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full">
                Taxa de Conversão Total: {totalConversion}%
              </Badge>
            </div>
          </>
        ) : (
          <>
            {/* Barras horizontais */}
            <div className="space-y-4">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="text-foreground text-sm font-medium">{idx + 1}. {item.label}</div>
                    <div className="text-muted-foreground text-xs">Completaram {item.completed} de {item.total}</div>
                  </div>
                  <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-foreground to-foreground/70 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-right w-16">
                    <div className="text-foreground text-lg font-bold">{item.percentage}</div>
                    <div className="text-muted-foreground text-xs">% taxa de conversão</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Componente Métricas de Tempo no Checkout
interface CheckoutTimeMetricsProps {
  completionTime: string
  abandonmentTime: string
  completionRate: number
  abandonmentRate: number
  completionMeta: string
  avgGeneral: string
  completionLeads: number
  abandonmentLeads: number
}

const CheckoutTimeMetrics: React.FC<CheckoutTimeMetricsProps> = ({
  completionTime,
  abandonmentTime,
  completionRate,
  abandonmentRate,
  completionMeta,
  avgGeneral,
  completionLeads,
  abandonmentLeads,
}) => (
  <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-bold">Métricas de Tempo no Checkout</CardTitle>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 rounded-full">
            {completionRate}% conclusão
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {abandonmentRate}% abandonam
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-6">
        {/* Tempo para completar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Tempo para completar</span>
            <span className="text-green-400 text-xs">{completionRate}% concluem</span>
          </div>
          <div className="text-3xl font-bold text-green-400 mb-3">{completionTime}</div>
          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden mb-1">
            <div
              className="absolute h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
              style={{ width: `${Math.min((parseFloat(completionTime.replace(':', '.')) / parseFloat(completionMeta.replace(':', '.'))) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>0:00</span>
            <span>Meta: {completionMeta}</span>
          </div>
        </div>

        {/* Tempo até abandono */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Tempo até abandono</span>
          </div>
          <div className="text-3xl font-bold text-foreground mb-3">{abandonmentTime}</div>
          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden mb-1">
            <div
              className="absolute h-full bg-gradient-to-r from-foreground to-foreground/70 rounded-full"
              style={{ width: `${abandonmentRate}%` }}
            />
          </div>
          <div className="flex justify-between text-muted-foreground text-xs">
            <span>0:00</span>
            <span>Média geral: {avgGeneral}</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-4 bg-muted/30 rounded-xl">
        <div className="text-foreground text-sm font-medium mb-2">Insights</div>
        <ul className="space-y-1">
          <li className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Taxa de conclusão: {completionRate}% ({completionLeads} leads)
          </li>
          <li className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Tempo médio de conclusão: {completionTime} dentro da meta
          </li>
          <li className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Tempo médio de abandono: {abandonmentTime}
          </li>
          <li className="flex items-center gap-2 text-muted-foreground text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Taxa de abandono: {abandonmentRate}% ({abandonmentLeads} leads)
          </li>
        </ul>
      </div>
    </CardContent>
  </Card>
)

// Componente Horários de Pico
interface PeakHoursProps {
  slots: { label: string; percentage: number }[]
  todayVsYesterday: number
}

const PeakHours: React.FC<PeakHoursProps> = ({ slots, todayVsYesterday }) => {
  const peakSlot = slots.reduce((max, slot) => (slot.percentage > max.percentage ? slot : max), slots[0])
  const lowSlot = slots.reduce((min, slot) => (slot.percentage < min.percentage ? slot : min), slots[0])

  return (
    <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold">Horários de Pico</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full">Hoje</Badge>
            <Badge 
              variant="secondary" 
              className={`rounded-full ${
                todayVsYesterday >= 0
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}
            >
              {todayVsYesterday >= 0 ? '+' : ''}{todayVsYesterday}% vs ontem
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Slots de horário */}
        <div className="space-y-3 mb-4">
          {slots.map((slot, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs w-24">{slot.label}</span>
              <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-foreground/50 to-foreground/30 rounded-full transition-all"
                  style={{ width: `${slot.percentage}%` }}
                />
              </div>
              <span className="text-muted-foreground text-xs w-8 text-right">{slot.percentage}%</span>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="p-4 bg-muted/30 rounded-xl">
          <div className="text-foreground text-sm font-medium mb-2">Insights</div>
          <ul className="space-y-1">
            <li className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Pico de acessos entre {peakSlot.label} ({peakSlot.percentage}%)
            </li>
            <li className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Menor movimento entre {lowSlot.label} ({lowSlot.percentage}%)
            </li>
            <li className="flex items-center gap-2 text-muted-foreground text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              Variação de hoje vs ontem: {todayVsYesterday}%
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

interface AnimatedPointProps {
  x: number
  y: number
  label: string
  color: string
  isPulsing?: boolean
}

const AnimatedPoint: React.FC<AnimatedPointProps> = ({ x, y, label, color, isPulsing }) => (
  <div
    className={`absolute transition-all duration-300 ${isPulsing ? 'animate-pulse' : ''}`}
    style={{
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div
      className={`w-2 h-2 rounded-full border-2 ${color}`}
      style={{
        boxShadow:
          color === 'border-green-400'
            ? '0 0 12px rgba(74, 222, 128, 0.6), inset 0 0 8px rgba(74, 222, 128, 0.3)'
            : '0 0 10px rgba(168, 85, 247, 0.5), inset 0 0 6px rgba(168, 85, 247, 0.2)',
      }}
    />
    <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
      <span className="text-white text-xs font-medium bg-[#1a1a1f] px-2 py-1 rounded">
        {label}
      </span>
    </div>
  </div>
)

// Componente do Globo com Canvas e WebGL
const GlobeComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState({ x: 0.5, y: 0.5 })
  const [isDragging, setIsDragging] = useState(false)
  const [previousMouse, setPreviousMouse] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = 130

    // Gera pontos brancos para formar os continentes (simplificado)
    const generateContinentPoints = () => {
      const points: Array<{ x: number; y: number; z: number; opacity: number }> = []

      // América do Norte
      for (let i = 0; i < 80; i++) {
        points.push({
          x: -0.3 + Math.random() * 0.15,
          y: -0.2 + Math.random() * 0.15,
          z: -0.3 + Math.random() * 0.2,
          opacity: 0.4 + Math.random() * 0.6,
        })
      }

      // América do Sul
      for (let i = 0; i < 60; i++) {
        points.push({
          x: -0.4 + Math.random() * 0.2,
          y: 0 + Math.random() * 0.25,
          z: -0.35 + Math.random() * 0.2,
          opacity: 0.4 + Math.random() * 0.6,
        })
      }

      // Europa
      for (let i = 0; i < 50; i++) {
        points.push({
          x: 0.05 + Math.random() * 0.15,
          y: -0.25 + Math.random() * 0.15,
          z: 0.1 + Math.random() * 0.2,
          opacity: 0.4 + Math.random() * 0.6,
        })
      }

      // Ásia
      for (let i = 0; i < 100; i++) {
        points.push({
          x: 0.2 + Math.random() * 0.3,
          y: -0.15 + Math.random() * 0.3,
          z: 0.1 + Math.random() * 0.3,
          opacity: 0.4 + Math.random() * 0.6,
        })
      }

      // África
      for (let i = 0; i < 70; i++) {
        points.push({
          x: 0.1 + Math.random() * 0.15,
          y: 0 + Math.random() * 0.25,
          z: 0.15 + Math.random() * 0.2,
          opacity: 0.4 + Math.random() * 0.6,
        })
      }

      // Oceania
      for (let i = 0; i < 40; i++) {
        points.push({
          x: 0.35 + Math.random() * 0.15,
          y: 0.15 + Math.random() * 0.15,
          z: 0.2 + Math.random() * 0.2,
          opacity: 0.4 + Math.random() * 0.6,
        })
      }

      return points
    }

    const points = generateContinentPoints()

    const animate = () => {
      // Limpar canvas
      ctx.fillStyle = '#050507'
      ctx.fillRect(0, 0, width, height)

      // Desenhar glow branco neon em volta
      const gradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 40)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 35, 0, Math.PI * 2)
      ctx.fill()

      // Desenhar globo preto com borda branca suave
      const globeGradient = ctx.createRadialGradient(centerX - 20, centerY - 20, 0, centerX, centerY, radius)
      globeGradient.addColorStop(0, '#3a3a3a')
      globeGradient.addColorStop(0.5, '#1a1a1a')
      globeGradient.addColorStop(1, '#0a0a0a')
      ctx.fillStyle = globeGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

      // Borda branca suave do globo
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Rotacionar e desenhar pontos
      const rotatedPoints = points.map((point) => {
        // Rotação 3D
        const cosX = Math.cos(rotation.x)
        const sinX = Math.sin(rotation.x)
        const cosY = Math.cos(rotation.y)
        const sinY = Math.sin(rotation.y)

        let x = point.x
        let y = point.y
        let z = point.z

        // Rotação em X
        const y1 = y * cosX - z * sinX
        const z1 = y * sinX + z * cosX

        // Rotação em Y
        const x2 = x * cosY + z1 * sinY
        const z2 = -x * sinY + z1 * cosY

        // Projeção perspectiva
        const scale = 1 / (1 + z2 * 0.5)
        const screenX = centerX + x2 * radius * zoom * scale
        const screenY = centerY + y1 * radius * zoom * scale

        return {
          x: screenX,
          y: screenY,
          z: z2,
          opacity: point.opacity * Math.max(0.3, scale),
        }
      })

      // Ordenar por profundidade e desenhar
      rotatedPoints.sort((a, b) => a.z - b.z)

      rotatedPoints.forEach((point) => {
        if (
          point.x > centerX - radius - 20 &&
          point.x < centerX + radius + 20 &&
          point.y > centerY - radius - 20 &&
          point.y < centerY + radius + 20
        ) {
          ctx.fillStyle = `rgba(255, 255, 255, ${point.opacity * 0.8})`
          ctx.beginPath()
          ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Desenhar ponto cyan destacado (Loja Principal - América do Sul)
      const mainStorePoint = { x: -0.35, y: 0.1, z: -0.3 }
      const cosX = Math.cos(rotation.x)
      const sinX = Math.sin(rotation.x)
      const cosY = Math.cos(rotation.y)
      const sinY = Math.sin(rotation.y)

      let x = mainStorePoint.x
      let y = mainStorePoint.y
      let z = mainStorePoint.z

      const y1 = y * cosX - z * sinX
      const z1 = y * sinX + z * cosX
      const x2 = x * cosY + z1 * sinY
      const z2 = -x * sinY + z1 * cosY
      const scale = 1 / (1 + z2 * 0.5)
      const screenX = centerX + x2 * radius * zoom * scale
      const screenY = centerY + y1 * radius * zoom * scale

      // Aura pulsante cyan
      const time = Date.now() * 0.003
      const pulseSize = 8 + Math.sin(time) * 2

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2)
      ctx.stroke()

      // Ponto cyan central
      ctx.fillStyle = 'rgba(34, 211, 238, 0.9)'
      ctx.beginPath()
      ctx.arc(screenX, screenY, 4, 0, Math.PI * 2)
      ctx.fill()

      // Glow cyan
      ctx.shadowColor = 'rgba(34, 211, 238, 0.8)'
      ctx.shadowBlur = 15
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'
      ctx.beginPath()
      ctx.arc(screenX, screenY, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      requestAnimationFrame(animate)
    }

    animate()
  }, [rotation, zoom])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setPreviousMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const deltaX = e.clientX - previousMouse.x
    const deltaY = e.clientY - previousMouse.y

    setRotation((prev) => ({
      x: prev.x - deltaY * 0.005,
      y: prev.y + deltaX * 0.005,
    }))

    setPreviousMouse({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setZoom((prev) => Math.min(prev + 0.1, 2))
    } else {
      setZoom((prev) => Math.max(prev - 0.1, 0.8))
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleMouseWheel}
        className="cursor-grab active:cursor-grabbing"
      />
    </div>
  )
}

export const LiveViewDashboard: React.FC = () => {
  const [zoom, setZoom] = useState(1)

  // Gera os slots de hora do dia atual (de 0h até hora atual)
  const now = new Date()
  const currentHour = now.getHours()

  const initialSlots = Array.from({ length: currentHour + 1 }, (_, i) => ({
    label: `${String(i).padStart(2, '0')}h`,
    value: 0,
  }))

  const [chartData, setChartData] = useState(initialSlots)
  const [totalSales, setTotalSales] = useState(0)
  const [peakSales, setPeakSales] = useState(0)

  // Simula chegada de vendas em tempo real a cada 3s
  useEffect(() => {
    const interval = setInterval(() => {
      const saleAmount = Math.floor(Math.random() * 3000) + 500 // R$ 500 a R$ 3500 por tick
      const hour = new Date().getHours()

      setChartData((prev) => {
        const updated = [...prev]
        const slotIndex = updated.findIndex((s) => s.label === `${String(hour).padStart(2, '0')}h`)
        if (slotIndex !== -1) {
          updated[slotIndex] = {
            ...updated[slotIndex],
            value: updated[slotIndex].value + saleAmount,
          }
        }
        return updated
      })

      setTotalSales((prev) => {
        const next = prev + saleAmount
        setPeakSales((p) => Math.max(p, next))
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.8))

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Radar de Vendas ao Vivo</h1>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50 rounded-full gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                ao vivo
              </Badge>
            </div>
            <span className="text-muted-foreground text-sm">1 de abr. de 2026 13:32</span>
          </div>

          {/* Abas */}
          <Tabs defaultValue="radar" className="w-full">
            <TabsList className="rounded-xl bg-card/80 backdrop-blur-sm h-10">
              <TabsTrigger value="radar" className="rounded-lg gap-2">
                <BarChart3 size={16} />
                Radar de Vendas
              </TabsTrigger>
              <TabsTrigger value="analise" className="rounded-lg">
                Análise Completa
              </TabsTrigger>
              <TabsTrigger value="mapa" className="rounded-lg">
                Mapa Global
              </TabsTrigger>
              <TabsTrigger value="clarex" className="rounded-lg gap-1">
                Clarex
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded">Novidade</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Layout - Esquerda (60%) e Direita (40%) */}
        <div className="flex gap-6">
          {/* Lado Esquerdo - Informações */}
          <div className="flex-1 space-y-6">
            {/* Cards de Métricas - Grid 3x2 */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Users size={14} /> Visitantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">0</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign size={14} /> Vendas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <ShoppingBag size={14} /> Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">0</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Zap size={14} /> Pedidos Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">0</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp size={14} /> Conversão Checkout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">0%</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <BarChart3 size={14} /> Ticket Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">R$ 0,00</div>
                </CardContent>
              </Card>
            </div>

            {/* Histórico de Vendas */}
            <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BarChart3 size={16} /> Histórico de Vendas (Hoje)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted/30 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Valor acumulado</span>
                    <span className="text-foreground text-lg font-bold">
                      R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-muted-foreground text-sm">Pico do período</span>
                    <span className="text-foreground text-lg font-bold">
                      R$ {peakSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <SalesChart data={chartData} />
              </CardContent>
            </Card>

            {/* Funil de Conversão */}
            <ConversionFunnel
            data={[
              { label: 'Dados Pessoais', completed: 0, total: 0, percentage: 0 },
              { label: 'Endereço', completed: 0, total: 0, percentage: 0 },
              { label: 'Pagamento', completed: 0, total: 0, percentage: 0 },
            ]}
            leadsToday={0}
            avgTime="0:00"
            totalConversion={0}
            activeLeads={0}
            updatedAt="14:23"
          />

            {/* Métricas de Tempo no Checkout */}
            <CheckoutTimeMetrics
            completionTime="0:00"
            abandonmentTime="0:00"
            completionRate={0}
            abandonmentRate={0}
            completionMeta="3:00"
            avgGeneral="0:00"
            completionLeads={0}
            abandonmentLeads={0}
          />

            {/* Horários de Pico */}
            <PeakHours
            slots={[
              { label: '06:00 - 09:00', percentage: 0 },
              { label: '09:00 - 12:00', percentage: 0 },
              { label: '12:00 - 15:00', percentage: 0 },
              { label: '15:00 - 18:00', percentage: 0 },
              { label: '18:00 - 21:00', percentage: 0 },
              { label: '21:00 - 00:00', percentage: 0 },
              { label: '00:00 - 03:00', percentage: 0 },
              { label: '03:00 - 06:00', percentage: 0 },
            ]}
            todayVsYesterday={25}
            />
          </div>

          {/* Lado Direito - Globo Interativo */}
          <div className="w-[40%] flex flex-col">
            <Card className="flex-1 rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Globo Canvas */}
              <GlobeComponent />

              {/* Controles de Zoom */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  className="rounded-xl"
                >
                  <Plus size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  className="rounded-xl"
                >
                  <Minus size={16} />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
