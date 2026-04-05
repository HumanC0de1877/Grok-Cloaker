'use client'

import { useState } from 'react'
import { 
  Calendar, 
  RefreshCw, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle, 
  TrendingUp, 
  Percent, 
  CreditCard,
  XCircle,
  RotateCcw,
  Banknote
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, trend, trendValue }) => {
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && trendValue && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingUp size={12} className="rotate-180" /> : null}
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface GatewayCardProps {
  title: string
  message: string
  icon: React.ReactNode
  iconBg?: string
}

const GatewayCard: React.FC<GatewayCardProps> = ({ title, message, icon, iconBg = 'bg-muted' }) => {
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{message}</CardDescription>
      </CardContent>
    </Card>
  )
}

interface StatusCardProps {
  title: string
  value: string
  rate?: string
  color: string
  dotColor: string
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, rate, color, dotColor }) => {
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${color}`}>{value}</div>
        {rate && (
          <p className="text-sm text-muted-foreground mt-2">Taxa: {rate}</p>
        )}
      </CardContent>
    </Card>
  )
}

interface ConversionCardProps {
  title: string
  value: string
  icon: React.ReactNode
}

const ConversionCard: React.FC<ConversionCardProps> = ({ title, value, icon }) => {
  return (
    <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

export const VisaoGeralDashboard: React.FC = () => {
  const [period, setPeriod] = useState('today')

  return (
    <TooltipProvider>
      <ScrollArea className="flex-1 h-screen">
        <div className="p-8">
          {/* Header com seletor de período */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              {/* Period Selector */}
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px] rounded-xl bg-card/80 backdrop-blur-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Filter Tabs */}
              <Tabs defaultValue="today" className="w-auto">
                <TabsList className="rounded-xl bg-card/80 backdrop-blur-sm h-10">
                  <TabsTrigger value="today" className="rounded-lg px-4">Hoje</TabsTrigger>
                  <TabsTrigger value="7days" className="rounded-lg px-4">7 dias</TabsTrigger>
                  <TabsTrigger value="30days" className="rounded-lg px-4">30 dias</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Refresh button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="rounded-xl gap-2">
                  <RefreshCw size={16} />
                  Atualizar dados
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-lg">
                <p>Atualizar métricas</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Título da seção */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Principais Métricas</h1>
            <p className="text-muted-foreground text-sm">Visão geral do desempenho da sua loja</p>
          </div>

          {/* Principais Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            <MetricCard
              title="Vendas Geradas"
              value="R$ 0,00"
              subtitle="0 Total de pedidos"
              icon={<DollarSign size={20} />}
            />
            <MetricCard
              title="Pedidos"
              value="0"
              subtitle="0 Pedidos realizados"
              icon={<ShoppingBag size={20} />}
            />
            <MetricCard
              title="Pedidos Pagos"
              value="R$ 0,00"
              subtitle="0 Pedidos pagos"
              icon={<CheckCircle size={20} />}
            />
            <MetricCard
              title="Ticket Médio"
              value="R$ 0,00"
              icon={<TrendingUp size={20} />}
            />
            <MetricCard
              title="Conversão do Checkout"
              value="0.0%"
              subtitle="0 pedidos criados"
              icon={<Percent size={20} />}
            />
          </div>

          {/* Melhores Gateways por Método */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Melhores Gateways por Método</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GatewayCard
                title="PIX"
                message="Não há dados de conversão via PIX no período selecionado."
                icon={<span className="text-emerald-400 font-bold text-sm">PIX</span>}
                iconBg="bg-emerald-500/20"
              />
              <GatewayCard
                title="Cartão"
                message="Não há dados de conversão com cartão no período selecionado."
                icon={<CreditCard size={20} className="text-blue-400" />}
                iconBg="bg-blue-500/20"
              />
              <GatewayCard
                title="Boleto"
                message="Não há dados de conversão via boleto no período selecionado."
                icon={<Banknote size={20} className="text-orange-400" />}
                iconBg="bg-orange-500/20"
              />
            </div>
          </div>

          {/* Status de Pedidos */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Status de Pedidos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="Pedidos Pagos"
                value="0"
                color="text-emerald-400"
                dotColor="bg-emerald-500"
              />
              <StatusCard
                title="Pedidos Pendentes"
                value="0"
                color="text-yellow-400"
                dotColor="bg-yellow-500"
              />
              <StatusCard
                title="Pedidos Cancelados"
                value="0"
                rate="0.0%"
                color="text-red-400"
                dotColor="bg-red-500"
              />
              <StatusCard
                title="Pedidos Reembolsados"
                value="0"
                rate="0.0%"
                color="text-white"
                dotColor="bg-white"
              />
            </div>
          </div>

          {/* Conversão */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Conversão</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ConversionCard 
                title="Taxa de Conversão Checkout" 
                value="0.0%" 
                icon={<Percent size={16} />}
              />
              <ConversionCard 
                title="Taxa de Pagamento" 
                value="0.0%" 
                icon={<CheckCircle size={16} />}
              />
              <ConversionCard 
                title="Taxa de Reembolso" 
                value="0.0%" 
                icon={<RotateCcw size={16} />}
              />
              <ConversionCard 
                title="Taxa de Cancelamento" 
                value="0.0%" 
                icon={<XCircle size={16} />}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </TooltipProvider>
  )
}
