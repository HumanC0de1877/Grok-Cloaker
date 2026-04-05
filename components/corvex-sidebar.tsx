'use client'

import { useState } from 'react'
import {
  Home,
  Handshake,
  BarChart3,
  Users,
  Box,
  ShoppingBag,
  ShoppingCart,
  Megaphone,
  Puzzle,
  Settings,
  Store,
  ChevronDown,
} from 'lucide-react'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  badge?: string
  badgeColor?: string
  isActive?: boolean
  isExpandable?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  children?: React.ReactNode
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  badge,
  badgeColor = 'bg-green-500',
  isActive = false,
  isExpandable = false,
  isExpanded = false,
  onToggle,
  children,
}) => {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
          isActive
            ? 'bg-purple-100 text-purple-900'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">{icon}</div>
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${badgeColor} text-white`}
            >
              {badge}
            </span>
          )}
          {isExpandable && (
            <ChevronDown
              size={16}
              className={`transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          )}
        </div>
      </button>
      {isExpandable && isExpanded && children && (
        <div className="mt-1 space-y-1 pl-4">{children}</div>
      )}
    </div>
  )
}

const SubMenuItem: React.FC<{ label: string }> = ({ label }) => {
  return (
    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-all">
      {label}
    </button>
  )
}

export const CorvexSidebar: React.FC = () => {
  const [expandedAnalytics, setExpandedAnalytics] = useState(false)
  const [expandedProducts, setExpandedProducts] = useState(false)
  const [expandedSales, setExpandedSales] = useState(false)
  const [expandedCheckout, setExpandedCheckout] = useState(true)
  const [expandedMarketing, setExpandedMarketing] = useState(false)
  const [expandedApps, setExpandedApps] = useState(false)
  const [expandedSystem, setExpandedSystem] = useState(false)

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-700 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-purple-700">CORVEX</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Início */}
        <MenuItem
          icon={<Home size={20} />}
          label="Início"
          isActive={true}
          badgeColor="bg-purple-600"
        />

        {/* Partners */}
        <MenuItem
          icon={<Handshake size={20} />}
          label="Partners"
          badge="NEW"
          badgeColor="bg-green-500"
        />

        {/* Análises */}
        <MenuItem
          icon={<BarChart3 size={20} />}
          label="Análises"
          isExpandable={true}
          isExpanded={expandedAnalytics}
          onToggle={() => setExpandedAnalytics(!expandedAnalytics)}
        >
          <SubMenuItem label="Visão Geral" />
          <SubMenuItem label="Live View" />
        </MenuItem>

        {/* Clientes */}
        <MenuItem
          icon={<Users size={20} />}
          label="Clientes"
          badge="RENOVADO"
          badgeColor="bg-green-200 text-gray-700"
        />

        {/* Produtos */}
        <MenuItem
          icon={<Box size={20} />}
          label="Produtos"
          isExpandable={true}
          isExpanded={expandedProducts}
          onToggle={() => setExpandedProducts(!expandedProducts)}
        >
          <SubMenuItem label="Produtos" />
          <SubMenuItem label="Kits" />
          <SubMenuItem label="Coleções" />
        </MenuItem>

        {/* Vendas */}
        <MenuItem
          icon={<ShoppingBag size={20} />}
          label="Vendas"
          isExpandable={true}
          isExpanded={expandedSales}
          onToggle={() => setExpandedSales(!expandedSales)}
        >
          <SubMenuItem label="Pedidos" />
          <SubMenuItem label="Carrinhos Abandonados" />
          <SubMenuItem label="Assinaturas (Beta)" />
          <SubMenuItem label="Clientes" />
        </MenuItem>

        {/* Checkout */}
        <MenuItem
          icon={<ShoppingCart size={20} />}
          label="Checkout"
          isExpandable={true}
          isExpanded={expandedCheckout}
          onToggle={() => setExpandedCheckout(!expandedCheckout)}
        >
          <SubMenuItem label="Personalizar" />
          <SubMenuItem label="Domínios" />
          <SubMenuItem label="Gateways" />
          <SubMenuItem label="Logística" />
          <SubMenuItem label="Regras e Informações" />
          <SubMenuItem label="Redirecionamento" />
        </MenuItem>

        {/* Marketing */}
        <MenuItem
          icon={<Megaphone size={20} />}
          label="Marketing"
          isExpandable={true}
          isExpanded={expandedMarketing}
          onToggle={() => setExpandedMarketing(!expandedMarketing)}
        >
          <SubMenuItem label="Desconto por pagamento..." />
          <SubMenuItem label="Faixas de Desconto" />
          <SubMenuItem label="Order Bumps" />
          <SubMenuItem label="Brindes" />
          <SubMenuItem label="Upsells" />
          <SubMenuItem label="Cupons" />
        </MenuItem>

        {/* Apps Corvex */}
        <MenuItem
          icon={<Puzzle size={20} />}
          label="Apps Corvex"
          isExpandable={true}
          isExpanded={expandedApps}
          onToggle={() => setExpandedApps(!expandedApps)}
        >
          <SubMenuItem label="Automation" />
          <SubMenuItem label="Corvex Security" />
          <SubMenuItem label="IP Blacklist" />
        </MenuItem>

        {/* Sistema */}
        <MenuItem
          icon={<Settings size={20} />}
          label="Sistema"
          isExpandable={true}
          isExpanded={expandedSystem}
          onToggle={() => setExpandedSystem(!expandedSystem)}
        >
          <SubMenuItem label="Meu Plano" />
          <SubMenuItem label="Integrações" />
          <SubMenuItem label="Webhooks" />
        </MenuItem>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-gray-100 transition-all">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Store size={20} className="text-gray-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">Loja Virtual</span>
          </div>
          <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">
            EM BREVE
          </span>
        </div>
      </div>
    </div>
  )
}
