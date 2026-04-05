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
  Globe,
  Activity,
  CreditCard,
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
  onClick?: () => void
  children?: React.ReactNode
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  badge,
  badgeColor = 'bg-emerald-500',
  isActive = false,
  isExpandable = false,
  isExpanded = false,
  onToggle,
  onClick,
  children,
}) => {
  const handleClick = () => {
    if (isExpandable && onToggle) {
      onToggle()
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
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
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}
            >
              {badge}
            </span>
          )}
          {isExpandable && (
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 text-gray-500 group-hover:text-white ${
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

interface SubMenuItemProps {
  label: string
  isActive?: boolean
  onClick?: () => void
}

const SubMenuItem: React.FC<SubMenuItemProps> = ({ label, isActive = false, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
        isActive 
          ? 'text-white bg-[#1f1f23]' 
          : 'text-gray-500 hover:text-white hover:bg-[#1a1a1e] hover:shadow-[0_0_10px_rgba(165,180,252,0.1)]'
      }`}
    >
      {label}
    </button>
  )
}

export type ActivePage = 'dashboard' | 'campanhas' | 'dominios' | 'logs' | 'planos'

interface PrismaSidebarProps {
  activePage: ActivePage
  onPageChange: (page: ActivePage) => void
}

export const PrismaSidebar: React.FC<PrismaSidebarProps> = ({ activePage, onPageChange }) => {
  return (
    <div className="w-80 h-[calc(100vh-2rem)] bg-[#0f0f11] flex flex-col overflow-hidden rounded-2xl m-4 border border-[#1f1f23]">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-[#1f1f23] scrollbar-track-transparent">
        {/* Dashboard */}
        <MenuItem
          icon={<Home size={20} />}
          label="Dashboard"
          isActive={activePage === 'dashboard'}
          onClick={() => onPageChange('dashboard')}
        />

        {/* Campanhas */}
        <MenuItem
          icon={<Megaphone size={20} />}
          label="Campanhas"
          isActive={activePage === 'campanhas'}
          onClick={() => onPageChange('campanhas')}
        />

        {/* Domínios */}
        <MenuItem
          icon={<Globe size={20} />}
          label="Domínios"
          isActive={activePage === 'dominios'}
          onClick={() => onPageChange('dominios')}
        />

        {/* Logs */}
        <MenuItem
          icon={<Activity size={20} />}
          label="Logs de Tráfego"
          isActive={activePage === 'logs'}
          onClick={() => onPageChange('logs')}
        />

        {/* Planos */}
        <MenuItem
          icon={<CreditCard size={20} />}
          label="Planos & Assinatura"
          isActive={activePage === 'planos'}
          onClick={() => onPageChange('planos')}
        />
      </div>
    </div>
  )
}
