"use client"

import { useState } from "react"
import { PrismaSidebar, ActivePage } from "@/components/prisma-sidebar"
import { SpaceBackground } from "@/components/space-background"
import { InicioDashboard } from "@/components/inicio-dashboard"
import { CampanhasDashboard } from "@/components/campanhas-dashboard"
import { DominiosDashboard } from "@/components/dominios-dashboard"
import { LogsDashboard } from "@/components/logs-dashboard"
import { LiveViewDashboard } from "@/components/live-view-dashboard"
import { VisaoGeralDashboard } from "@/components/visao-geral-dashboard"

export default function Home() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <InicioDashboard />
      case 'campanhas':
        return <CampanhasDashboard />
      case 'analytics':
        return <VisaoGeralDashboard />
      case 'live-view':
        return <LiveViewDashboard />
      case 'logs':
        return <LogsDashboard />
      case 'dominios':
        return <DominiosDashboard />
      default:
        return <InicioDashboard />
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <SpaceBackground />
      <div className="relative z-10 flex h-screen">
        <PrismaSidebar activePage={activePage} onPageChange={setActivePage} />
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
