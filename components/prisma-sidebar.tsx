'use client'

import {
  Home,
  Megaphone,
  Globe,
  Activity,
  BarChart3,
  Radio,
  LogOut,
} from 'lucide-react'

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  badge?: string
  badgeColor?: string
  isActive?: boolean
  onClick?: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  badge,
  badgeColor = 'bg-emerald-500',
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 ${
        isActive
          ? 'bg-[#1f1f23] text-white'
          : 'text-gray-300 hover:bg-[#1a1a1e] hover:text-white hover:shadow-[0_0_15px_rgba(165,180,252,0.15)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  )
}

export type ActivePage = 'dashboard' | 'campanhas' | 'dominios' | 'logs' | 'analytics' | 'live-view'

interface PrismaSidebarProps {
  activePage: ActivePage
  onPageChange: (page: ActivePage) => void
}

export const PrismaSidebar: React.FC<PrismaSidebarProps> = ({ activePage, onPageChange }) => {
  return (
    <div className="w-72 h-[calc(100vh-2rem)] bg-[#0f0f11] flex flex-col overflow-hidden rounded-2xl m-4 border border-[#1f1f23]">
      {/* Header */}
      <div className="p-6 border-b border-[#1f1f23] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border-2 border-white/20 bg-transparent flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-xl font-bold text-white tracking-wide uppercase">Cloaker Hub</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <MenuItem
          icon={<Home size={20} />}
          label="Dashboard"
          isActive={activePage === 'dashboard'}
          onClick={() => onPageChange('dashboard')}
        />
        <MenuItem
          icon={<Megaphone size={20} />}
          label="Campanhas"
          isActive={activePage === 'campanhas'}
          onClick={() => onPageChange('campanhas')}
        />
        <MenuItem
          icon={<BarChart3 size={20} />}
          label="Analytics"
          isActive={activePage === 'analytics'}
          onClick={() => onPageChange('analytics')}
        />
        <MenuItem
          icon={<Radio size={20} />}
          label="Live View"
          isActive={activePage === 'live-view'}
          onClick={() => onPageChange('live-view')}
          badge="LIVE"
          badgeColor="bg-red-500 text-white"
        />
        <MenuItem
          icon={<Activity size={20} />}
          label="Logs de Tráfego"
          isActive={activePage === 'logs'}
          onClick={() => onPageChange('logs')}
        />
        <MenuItem
          icon={<Globe size={20} />}
          label="Domínios"
          isActive={activePage === 'dominios'}
          onClick={() => onPageChange('dominios')}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1f1f23] flex-shrink-0">
        <button
          onClick={() => { window.location.href = '/api/auth/logout' }}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-[#1a1a1e] hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </div>
  )
}
