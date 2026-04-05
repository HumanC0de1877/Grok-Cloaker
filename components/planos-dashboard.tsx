'use client'

import { Check, Zap, Shield, Crown, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const PlanosDashboard: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: 'R$ 197',
      period: '/mês',
      description: 'Ideal para quem está começando no tráfego pago.',
      features: [
        'Até 3 Campanhas Ativas',
        'Filtros de Bots Básicos',
        'Geolocalização por País',
        'Suporte via Ticket',
        '1 Domínio Customizado',
      ],
      icon: <Zap className="text-blue-500" />,
      buttonText: 'Começar Agora',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 'R$ 497',
      period: '/mês',
      description: 'O plano mais popular para afiliados e infoprodutores.',
      features: [
        'Campanhas Ilimitadas',
        'Inteligência Artificial Ativa',
        'Bypass de Crawlers Avançado',
        'Fingerprinting de Dispositivo',
        'Filtro de ISP e Proxy/VPN',
        'Suporte Prioritário WhatsApp',
      ],
      icon: <Star className="text-yellow-500" />,
      buttonText: 'Assinar Pro',
      highlight: true,
      badge: 'MAIS VENDIDO',
    },
    {
      name: 'Black Edition',
      price: 'R$ 997',
      period: '/mês',
      description: 'Para operações de escala com máxima segurança.',
      features: [
        'Tudo do Plano Pro',
        'Machine Learning Customizado',
        'API de Integração Direta',
        'Gerente de Contas Dedicado',
        'Whitelist de IPs Global',
        'Análise Comportamental por IA',
      ],
      icon: <Crown className="text-purple-500" />,
      buttonText: 'Seja Black',
      highlight: false,
    },
  ]

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-4">Escolha seu Nível de Proteção</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Planos flexíveis para acompanhar a escala da sua operação. Mude de plano a qualquer momento e garanta que seu tráfego chegue ao destino real.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`relative flex flex-col bg-[#0a0a0a] border-[#1f1f23] rounded-2xl transition-all duration-300 hover:border-white/20 shadow-none ${
              plan.highlight ? 'border-white/30' : ''
            }`}
          >
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black border-none py-1 px-4 rounded-full font-bold text-[10px]">
                {plan.badge}
              </Badge>
            )}
            
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
              <CardDescription className="mt-2 text-gray-500 text-xs min-h-[40px]">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="text-center mb-8">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-emerald-500" />
                    </div>
                    <span className="text-sm text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-8">
              <Button 
                className={`w-full py-6 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? 'bg-white hover:bg-gray-200 text-black shadow-none' 
                    : 'bg-[#111] hover:bg-[#1a1a1e] text-white border border-[#1f1f23]'
                }`}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto p-8 rounded-2xl bg-[#0a0a0a] border border-[#1f1f23] text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="text-white" />
          <h3 className="text-xl font-bold text-white">Precisa de uma solução Enterprise?</h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Para volumes acima de 10 milhões de cliques/mês ou necessidades específicas de integração, fale com nosso time de especialistas.
        </p>
        <Button variant="outline" className="rounded-xl border-[#1f1f23] hover:bg-white/5">
          Falar com Consultor
        </Button>
      </div>
    </div>
  )
}
