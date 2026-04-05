"use client"

import { useState } from "react"
import { PrismaSidebar, ActivePage } from "@/components/prisma-sidebar"
import { SpaceBackground } from "@/components/space-background"
import { VisaoGeralDashboard } from "@/components/visao-geral-dashboard"
import { LiveViewDashboard } from "@/components/live-view-dashboard"
import { InicioDashboard } from "@/components/inicio-dashboard"
import { DominiosDashboard } from "@/components/dominios-dashboard"
import { CampanhasDashboard } from "@/components/campanhas-dashboard"
import { LogsDashboard } from "@/components/logs-dashboard"
import { PlanosDashboard } from "@/components/planos-dashboard"

export default function Home() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <InicioDashboard />
      case 'campanhas':
        return <CampanhasDashboard />
      case 'dominios':
        return <DominiosDashboard />
      case 'logs':
        return <LogsDashboard />
      case 'planos':
        return <PlanosDashboard />
      default:
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-2">
                {activePage.charAt(0).toUpperCase() + activePage.slice(1).replace(/-/g, ' ')}
              </h1>
              <p className="text-gray-400 text-sm">
                Esta seção está em desenvolvimento
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated space background */}
      <SpaceBackground />
      
      {/* Content layer */}
      <div className="relative z-10 flex h-screen">
        <PrismaSidebar activePage={activePage} onPageChange={setActivePage} />
        
        {/* Main content area with animation */}
        <div 
          key={activePage}
          className="flex-1 flex animate-in fade-in slide-in-from-right-4 duration-300"
        >
          {renderContent()}
        </div>
      </div>
    </main>
  )
}
