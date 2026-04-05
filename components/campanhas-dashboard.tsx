'use client'

import React, { useState, useMemo } from 'react'
import {
  Plus, Search, MoreHorizontal, Settings, Eye, Megaphone,
  Link2, Activity, Zap, Globe2, CheckCircle2, AlertTriangle,
  Fingerprint, Layout, Copy, Trash2, X, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// ─── Full Country List ────────────────────────────────────────────────────────
const ALL_COUNTRIES = [
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' }, { code: 'AE', name: 'Emirados Árabes', flag: '🇦🇪' },
  { code: 'AF', name: 'Afeganistão', flag: '🇦🇫' }, { code: 'AG', name: 'Antígua e Barbuda', flag: '🇦🇬' },
  { code: 'AL', name: 'Albânia', flag: '🇦🇱' }, { code: 'AM', name: 'Armênia', flag: '🇦🇲' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' }, { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AT', name: 'Áustria', flag: '🇦🇹' }, { code: 'AU', name: 'Austrália', flag: '🇦🇺' },
  { code: 'AZ', name: 'Azerbaijão', flag: '🇦🇿' }, { code: 'BA', name: 'Bósnia', flag: '🇧🇦' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧' }, { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪' }, { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'BG', name: 'Bulgária', flag: '🇧🇬' }, { code: 'BH', name: 'Bahrein', flag: '🇧🇭' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮' }, { code: 'BJ', name: 'Benin', flag: '🇧🇯' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' }, { code: 'BO', name: 'Bolívia', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' }, { code: 'BS', name: 'Bahamas', flag: '🇧🇸' },
  { code: 'BT', name: 'Butão', flag: '🇧🇹' }, { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BY', name: 'Bielorrússia', flag: '🇧🇾' }, { code: 'BZ', name: 'Belize', flag: '🇧🇿' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' }, { code: 'CD', name: 'Congo (RDC)', flag: '🇨🇩' },
  { code: 'CF', name: 'República Centro-Africana', flag: '🇨🇫' }, { code: 'CG', name: 'Congo', flag: '🇨🇬' },
  { code: 'CH', name: 'Suíça', flag: '🇨🇭' }, { code: 'CI', name: 'Costa do Marfim', flag: '🇨🇮' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' }, { code: 'CM', name: 'Camarões', flag: '🇨🇲' },
  { code: 'CN', name: 'China', flag: '🇨🇳' }, { code: 'CO', name: 'Colômbia', flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' }, { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' }, { code: 'CY', name: 'Chipre', flag: '🇨🇾' },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿' }, { code: 'DE', name: 'Alemanha', flag: '🇩🇪' },
  { code: 'DJ', name: 'Djibuti', flag: '🇩🇯' }, { code: 'DK', name: 'Dinamarca', flag: '🇩🇰' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' }, { code: 'DZ', name: 'Argélia', flag: '🇩🇿' },
  { code: 'EC', name: 'Equador', flag: '🇪🇨' }, { code: 'EE', name: 'Estônia', flag: '🇪🇪' },
  { code: 'EG', name: 'Egito', flag: '🇪🇬' }, { code: 'ER', name: 'Eritréia', flag: '🇪🇷' },
  { code: 'ES', name: 'Espanha', flag: '🇪🇸' }, { code: 'ET', name: 'Etiópia', flag: '🇪🇹' },
  { code: 'FI', name: 'Finlândia', flag: '🇫🇮' }, { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
  { code: 'FR', name: 'França', flag: '🇫🇷' }, { code: 'GA', name: 'Gabão', flag: '🇬🇦' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' }, { code: 'GD', name: 'Granada', flag: '🇬🇩' },
  { code: 'GE', name: 'Geórgia', flag: '🇬🇪' }, { code: 'GH', name: 'Gana', flag: '🇬🇭' },
  { code: 'GM', name: 'Gâmbia', flag: '🇬🇲' }, { code: 'GN', name: 'Guiné', flag: '🇬🇳' },
  { code: 'GQ', name: 'Guiné Equatorial', flag: '🇬🇶' }, { code: 'GR', name: 'Grécia', flag: '🇬🇷' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' }, { code: 'GW', name: 'Guiné-Bissau', flag: '🇬🇼' },
  { code: 'GY', name: 'Guiana', flag: '🇬🇾' }, { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'HR', name: 'Croácia', flag: '🇭🇷' }, { code: 'HT', name: 'Haiti', flag: '🇭🇹' },
  { code: 'HU', name: 'Hungria', flag: '🇭🇺' }, { code: 'ID', name: 'Indonésia', flag: '🇮🇩' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' }, { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IN', name: 'Índia', flag: '🇮🇳' }, { code: 'IQ', name: 'Iraque', flag: '🇮🇶' },
  { code: 'IR', name: 'Irã', flag: '🇮🇷' }, { code: 'IS', name: 'Islândia', flag: '🇮🇸' },
  { code: 'IT', name: 'Itália', flag: '🇮🇹' }, { code: 'JM', name: 'Jamaica', flag: '🇯🇲' },
  { code: 'JO', name: 'Jordânia', flag: '🇯🇴' }, { code: 'JP', name: 'Japão', flag: '🇯🇵' },
  { code: 'KE', name: 'Quênia', flag: '🇰🇪' }, { code: 'KG', name: 'Quirguistão', flag: '🇰🇬' },
  { code: 'KH', name: 'Camboja', flag: '🇰🇭' }, { code: 'KI', name: 'Quiribati', flag: '🇰🇮' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲' }, { code: 'KN', name: 'São Cristóvão', flag: '🇰🇳' },
  { code: 'KP', name: 'Coreia do Norte', flag: '🇰🇵' }, { code: 'KR', name: 'Coreia do Sul', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' }, { code: 'KZ', name: 'Cazaquistão', flag: '🇰🇿' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' }, { code: 'LB', name: 'Líbano', flag: '🇱🇧' },
  { code: 'LC', name: 'Santa Lúcia', flag: '🇱🇨' }, { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' }, { code: 'LR', name: 'Libéria', flag: '🇱🇷' },
  { code: 'LS', name: 'Lesoto', flag: '🇱🇸' }, { code: 'LT', name: 'Lituânia', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxemburgo', flag: '🇱🇺' }, { code: 'LV', name: 'Letônia', flag: '🇱🇻' },
  { code: 'LY', name: 'Líbia', flag: '🇱🇾' }, { code: 'MA', name: 'Marrocos', flag: '🇲🇦' },
  { code: 'MC', name: 'Mônaco', flag: '🇲🇨' }, { code: 'MD', name: 'Moldávia', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪' }, { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'MK', name: 'Macedônia do Norte', flag: '🇲🇰' }, { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'MM', name: 'Mianmar', flag: '🇲🇲' }, { code: 'MN', name: 'Mongólia', flag: '🇲🇳' },
  { code: 'MR', name: 'Mauritânia', flag: '🇲🇷' }, { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MU', name: 'Maurício', flag: '🇲🇺' }, { code: 'MV', name: 'Maldivas', flag: '🇲🇻' },
  { code: 'MW', name: 'Malaui', flag: '🇲🇼' }, { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'MY', name: 'Malásia', flag: '🇲🇾' }, { code: 'MZ', name: 'Moçambique', flag: '🇲🇿' },
  { code: 'NA', name: 'Namíbia', flag: '🇳🇦' }, { code: 'NE', name: 'Níger', flag: '🇳🇪' },
  { code: 'NG', name: 'Nigéria', flag: '🇳🇬' }, { code: 'NI', name: 'Nicarágua', flag: '🇳🇮' },
  { code: 'NL', name: 'Holanda', flag: '🇳🇱' }, { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵' }, { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
  { code: 'NZ', name: 'Nova Zelândia', flag: '🇳🇿' }, { code: 'OM', name: 'Omã', flag: '🇴🇲' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' }, { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'PG', name: 'Papua Nova Guiné', flag: '🇵🇬' }, { code: 'PH', name: 'Filipinas', flag: '🇵🇭' },
  { code: 'PK', name: 'Paquistão', flag: '🇵🇰' }, { code: 'PL', name: 'Polônia', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' }, { code: 'PW', name: 'Palau', flag: '🇵🇼' },
  { code: 'PY', name: 'Paraguai', flag: '🇵🇾' }, { code: 'QA', name: 'Catar', flag: '🇶🇦' },
  { code: 'RO', name: 'Romênia', flag: '🇷🇴' }, { code: 'RS', name: 'Sérvia', flag: '🇷🇸' },
  { code: 'RU', name: 'Rússia', flag: '🇷🇺' }, { code: 'RW', name: 'Ruanda', flag: '🇷🇼' },
  { code: 'SA', name: 'Arábia Saudita', flag: '🇸🇦' }, { code: 'SB', name: 'Ilhas Salomão', flag: '🇸🇧' },
  { code: 'SC', name: 'Seicheles', flag: '🇸🇨' }, { code: 'SD', name: 'Sudão', flag: '🇸🇩' },
  { code: 'SE', name: 'Suécia', flag: '🇸🇪' }, { code: 'SG', name: 'Singapura', flag: '🇸🇬' },
  { code: 'SI', name: 'Eslovênia', flag: '🇸🇮' }, { code: 'SK', name: 'Eslováquia', flag: '🇸🇰' },
  { code: 'SL', name: 'Serra Leoa', flag: '🇸🇱' }, { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' }, { code: 'SO', name: 'Somália', flag: '🇸🇴' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷' }, { code: 'SS', name: 'Sudão do Sul', flag: '🇸🇸' },
  { code: 'ST', name: 'São Tomé e Príncipe', flag: '🇸🇹' }, { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'SY', name: 'Síria', flag: '🇸🇾' }, { code: 'SZ', name: 'Suazilândia', flag: '🇸🇿' },
  { code: 'TD', name: 'Chade', flag: '🇹🇩' }, { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'TH', name: 'Tailândia', flag: '🇹🇭' }, { code: 'TJ', name: 'Tajiquistão', flag: '🇹🇯' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' }, { code: 'TM', name: 'Turcomenistão', flag: '🇹🇲' },
  { code: 'TN', name: 'Tunísia', flag: '🇹🇳' }, { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
  { code: 'TR', name: 'Turquia', flag: '🇹🇷' }, { code: 'TT', name: 'Trinidad e Tobago', flag: '🇹🇹' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' }, { code: 'TZ', name: 'Tanzânia', flag: '🇹🇿' },
  { code: 'UA', name: 'Ucrânia', flag: '🇺🇦' }, { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' }, { code: 'UY', name: 'Uruguai', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbequistão', flag: '🇺🇿' }, { code: 'VA', name: 'Vaticano', flag: '🇻🇦' },
  { code: 'VC', name: 'São Vicente', flag: '🇻🇨' }, { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnã', flag: '🇻🇳' }, { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸' }, { code: 'YE', name: 'Iêmen', flag: '🇾🇪' },
  { code: 'ZA', name: 'África do Sul', flag: '🇿🇦' }, { code: 'ZM', name: 'Zâmbia', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbábue', flag: '🇿🇼' },
]

const ALL_LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)' }, { code: 'pt-PT', name: 'Português (Portugal)' },
  { code: 'en-US', name: 'Inglês (EUA)' }, { code: 'en-GB', name: 'Inglês (UK)' },
  { code: 'es-ES', name: 'Espanhol (Espanha)' }, { code: 'es-MX', name: 'Espanhol (México)' },
  { code: 'es-AR', name: 'Espanhol (Argentina)' }, { code: 'es-CO', name: 'Espanhol (Colômbia)' },
  { code: 'fr-FR', name: 'Francês' }, { code: 'de-DE', name: 'Alemão' },
  { code: 'it-IT', name: 'Italiano' }, { code: 'nl-NL', name: 'Holandês' },
  { code: 'pl-PL', name: 'Polonês' }, { code: 'ru-RU', name: 'Russo' },
  { code: 'tr-TR', name: 'Turco' }, { code: 'ja-JP', name: 'Japonês' },
  { code: 'ko-KR', name: 'Coreano' }, { code: 'zh-CN', name: 'Chinês Simplificado' },
  { code: 'zh-TW', name: 'Chinês Tradicional' }, { code: 'ar-SA', name: 'Árabe' },
  { code: 'hi-IN', name: 'Hindi' }, { code: 'th-TH', name: 'Tailandês' },
  { code: 'vi-VN', name: 'Vietnamita' }, { code: 'id-ID', name: 'Indonésio' },
]

// ─── Country Picker Sub-Modal ─────────────────────────────────────────────────
const CountryPicker: React.FC<{
  open: boolean
  onClose: () => void
  selected: string[]
  onSave: (codes: string[]) => void
}> = ({ open, onClose, selected, onSave }) => {
  const [search, setSearch] = useState('')
  const [local, setLocal] = useState<string[]>(selected)

  const filtered = useMemo(() =>
    ALL_COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    ), [search])

  const toggle = (code: string) =>
    setLocal(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-[#1f1f23] text-white max-w-lg p-0 rounded-3xl flex flex-col max-h-[85vh]">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#1f1f23] flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-base font-bold">Selecionar Países</DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">{local.length} selecionados de {ALL_COUNTRIES.length}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white" onClick={() => setLocal(ALL_COUNTRIES.map(c => c.code))}>Todos</Button>
            <Button variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-400" onClick={() => setLocal([])}>Limpar</Button>
          </div>
        </DialogHeader>
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar país..."
              className="pl-9 bg-[#111] border-[#1f1f23] rounded-xl h-9 text-sm text-white placeholder-gray-600"
              autoFocus
            />
          </div>
        </div>
        <ScrollArea className="flex-1 px-4 pb-2">
          <div className="grid grid-cols-2 gap-1.5 pb-3">
            {filtered.map(c => {
              const isSelected = local.includes(c.code)
              return (
                <button
                  key={c.code}
                  onClick={() => toggle(c.code)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-xs font-medium ${
                    isSelected
                      ? 'bg-white text-black'
                      : 'bg-[#111] border border-[#1f1f23] text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                  {isSelected && <span className="ml-auto text-[10px] font-black">✓</span>}
                </button>
              )
            })}
          </div>
        </ScrollArea>
        <DialogFooter className="border-t border-[#1f1f23] p-4 flex gap-2">
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl" onClick={() => { onSave(local); onClose() }}>
            Confirmar {local.length} países
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Language Picker Sub-Modal ────────────────────────────────────────────────
const LanguagePicker: React.FC<{
  open: boolean
  onClose: () => void
  selected: string[]
  enabled: boolean
  onSave: (codes: string[], enabled: boolean) => void
}> = ({ open, onClose, selected, enabled, onSave }) => {
  const [search, setSearch] = useState('')
  const [local, setLocal] = useState<string[]>(selected)
  const [localEnabled, setLocalEnabled] = useState(enabled)

  const filtered = useMemo(() =>
    ALL_LANGUAGES.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase()))
  , [search])

  const toggle = (code: string) =>
    setLocal(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-[#1f1f23] text-white max-w-md p-0 rounded-3xl flex flex-col max-h-[80vh]">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-[#1f1f23]">
          <DialogTitle className="text-base font-bold">Filtro por Idioma do Navegador</DialogTitle>
          <p className="text-xs text-gray-500 mt-1">Controle quais idiomas de navegador têm acesso à campanha.</p>
          <div className="flex items-center justify-between mt-4 p-3 bg-[#111] border border-[#1f1f23] rounded-xl">
            <div>
              <Label className="text-sm font-semibold">Ativar filtro por idioma?</Label>
              <p className="text-[10px] text-gray-500 mt-0.5">Se desativado, todos os idiomas são permitidos.</p>
            </div>
            <Switch checked={localEnabled} onCheckedChange={setLocalEnabled} className="data-[state=checked]:bg-white data-[state=checked]:border-white" />
          </div>
        </DialogHeader>
        {localEnabled && (
          <>
            <div className="px-4 pt-3 pb-1">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar idioma..." className="pl-9 bg-[#111] border-[#1f1f23] rounded-xl h-9 text-sm text-white placeholder-gray-600" />
              </div>
            </div>
            <ScrollArea className="flex-1 px-4 pb-2">
              <div className="flex flex-col gap-1 pb-3 pt-1">
                {filtered.map(l => {
                  const isSel = local.includes(l.code)
                  return (
                    <button key={l.code} onClick={() => toggle(l.code)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${isSel ? 'bg-white text-black' : 'bg-[#111] border border-[#1f1f23] text-gray-400 hover:text-white'}`}
                    >
                      <span>{l.name}</span>
                      <code className={`text-[10px] font-mono ${isSel ? 'text-gray-600' : 'text-gray-600'}`}>{l.code}</code>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </>
        )}
        <DialogFooter className="border-t border-[#1f1f23] p-4 flex gap-2">
          <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl" onClick={() => { onSave(local, localEnabled); onClose() }}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const CampanhasDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen]     = useState(false)
  const [countryPickerOpen, setCountryPickerOpen] = useState(false)
  const [langPickerOpen, setLangPickerOpen]       = useState(false)

  const [riskScore, setRiskScore]               = useState([75])
  const [trafficSource, setTrafficSource]       = useState('facebook')
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['BR', 'US', 'PT'])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['pt-BR', 'en-US'])
  const [filterByLanguage, setFilterByLanguage]   = useState(false)
  const [filterBrowser, setFilterBrowser]         = useState(true)
  const [sysRecommendations, setSysRecommendations] = useState(false)
  const [campaignName, setCampaignName]           = useState('')
  const [safeUrl, setSafeUrl]                     = useState('')
  const [moneyUrl, setMoneyUrl]                   = useState('')
  const [savedCampaign, setSavedCampaign]         = useState<{hash: string, paramUrl: string} | null>(null)

  const handleToggleRecommendations = (active: boolean) => {
    setSysRecommendations(active)
    if (active) { setRiskScore([65]); setFilterBrowser(true) }
    else setRiskScore([75])
  }

  const handleSaveCampaign = () => {
    if (!campaignName.trim()) return
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase()
    const sourceMap: Record<string, string> = { facebook: 'FB', tiktok: 'tiktok', google: 'google', kwai: 'kwai' }
    const utmStr = `?utm_source=${sourceMap[trafficSource]}&utm_campaign=__CMP__`
    setSavedCampaign({ hash, paramUrl: `${utmStr}&prismaid=${Math.random().toString(36).substring(2, 14).toUpperCase()}` })
  }

  const campaigns = [
    { id: '1', name: 'Oferta Black Friday - FB', status: 'active', visitors: 12450, blocked: 3200, conversion: '12.5%', lastUpdate: '2 mins atrás' },
    { id: '2', name: 'Lançamento Produto X - TikTok', status: 'active', visitors: 8200, blocked: 1540, conversion: '8.2%', lastUpdate: '15 mins atrás' },
  ]

  const countryLabels = useMemo(() => {
    const map = Object.fromEntries(ALL_COUNTRIES.map(c => [c.code, `${c.flag} ${c.name}`]))
    return selectedCountries.slice(0, 3).map(c => map[c] || c).join(', ') + (selectedCountries.length > 3 ? ` +${selectedCountries.length - 3}` : '')
  }, [selectedCountries])

  return (
    <div className="flex-1 p-8">
      {/* Country Picker Sub-Modal */}
      <CountryPicker
        open={countryPickerOpen}
        onClose={() => setCountryPickerOpen(false)}
        selected={selectedCountries}
        onSave={setSelectedCountries}
      />
      {/* Language Picker Sub-Modal */}
      <LanguagePicker
        open={langPickerOpen}
        onClose={() => setLangPickerOpen(false)}
        selected={selectedLanguages}
        enabled={filterByLanguage}
        onSave={(langs, enabled) => { setSelectedLanguages(langs); setFilterByLanguage(enabled) }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gerenciar Campanhas</h1>
          <p className="text-gray-400 text-sm mt-1">Visualize e gerencie suas campanhas de tráfego</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Buscar campanha..." className="bg-[#1a1a1e] border-[#1f1f23] pl-10 w-64 rounded-xl text-white" />
          </div>
          <Button className="bg-white hover:bg-gray-200 text-black rounded-xl gap-2 font-bold" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Nova Campanha
          </Button>
        </div>
      </div>

      {/* Campaign list */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((c) => (
          <Card key={c.id} className="bg-[#0a0a0a] border-[#1f1f23] rounded-2xl hover:border-gray-600 transition-all group overflow-hidden shadow-none">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#1f1f23] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Megaphone size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{c.name}</h3>
                    <Badge variant="outline" className={c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}>
                      {c.status === 'active' ? 'Ativa' : 'Pausada'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Link2 size={12} /> ID: {c.id}</span>
                    <span className="flex items-center gap-1"><Activity size={12} /> {c.lastUpdate}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-12">
                <div className="flex gap-8">
                  {[['Visitantes', c.visitors.toLocaleString(), 'text-white'], ['Bloqueados', c.blocked.toLocaleString(), 'text-red-500'], ['Conv. VSL', c.conversion, 'text-emerald-500']].map(([label, val, col]) => (
                    <div key={label as string} className="text-center">
                      <p className={`text-[10px] uppercase font-bold mb-1 text-gray-500`}>{label}</p>
                      <p className={`text-lg font-bold ${col} tracking-tight`}>{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2e]"><Eye size={18} /></Button>
                  <Button variant="ghost" size="icon" className="rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2e]"><Settings size={18} /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-lg text-gray-400 hover:text-white hover:bg-[#2a2a2e]"><MoreHorizontal size={18} /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1a1a1e] border-[#1f1f23] text-white">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#1f1f23]" />
                      <DropdownMenuItem className="gap-2 focus:bg-[#2a2a2e]"><Copy size={14} /> Duplicar</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 focus:bg-[#2a2a2e]"><Activity size={14} /> Ver Logs</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#1f1f23]" />
                      <DropdownMenuItem className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10"><Trash2 size={14} /> Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Campaign Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0a0a0a] border-[#1f1f23] text-white max-w-2xl p-0 overflow-hidden sm:rounded-3xl flex flex-col max-h-[90vh]">
          {savedCampaign ? (
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold">Campanha Criada!</h2>
              <p className="text-gray-400 text-sm">Dupla blindagem ativa. Cole a URL abaixo no seu anúncio.</p>
              <div className="w-full space-y-3 text-left">
                <div className="bg-[#111] p-4 rounded-xl border border-[#1f1f23]">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Passo 1 — Diretório (MINIHASH)</p>
                  <code className="text-emerald-400 font-mono font-bold text-sm">https://seusite.com/{savedCampaign.hash}/</code>
                </div>
                <div className="bg-[#111] p-4 rounded-xl border border-[#1f1f23]">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Passo 2 — Parâmetros + PrismaID</p>
                  <code className="text-indigo-400 font-mono text-xs break-all">{savedCampaign.paramUrl}</code>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl w-full text-left text-sm text-orange-400 flex items-start gap-3">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p>Qualquer acesso sem o PrismaID correto será enviado para a Safe URL automaticamente.</p>
              </div>
              <Button className="w-full h-12 bg-white text-black hover:bg-gray-200 font-bold rounded-xl" onClick={() => { setIsModalOpen(false); setTimeout(() => setSavedCampaign(null), 300) }}>
                Concluir e Voltar
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader className="p-6 border-b border-[#1f1f23] sticky top-0 bg-[#0a0a0a] z-10 flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-xl">Criar Nova Campanha</DialogTitle>
                  <CardDescription className="text-gray-400 mt-1">Motor de Dupla Blindagem</CardDescription>
                </div>
                <div className="flex items-center gap-3 bg-[#111] border border-[#1f1f23] p-2 pr-4 rounded-full">
                  <div className="bg-emerald-500/20 p-1.5 rounded-full"><Zap size={14} className="text-emerald-500" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 font-bold leading-none mb-1">Recomendações do Sistema</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white">{sysRecommendations ? 'Ativado' : 'Manual'}</span>
                      <Switch checked={sysRecommendations} onCheckedChange={handleToggleRecommendations} className="scale-75 origin-left data-[state=checked]:bg-white" />
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 px-6 py-4">
                <div className="space-y-5 pb-6">
                  {/* Traffic Source */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Origem de Tráfego</Label>
                    <div className="flex items-center gap-1 bg-[#111] p-1.5 rounded-xl border border-[#1f1f23]">
                      {[{id:'facebook',label:'FB Ads'},{id:'google',label:'Google'},{id:'tiktok',label:'TikTok'},{id:'kwai',label:'Kwai'}].map(nw => (
                        <Button key={nw.id} variant="ghost"
                          className={`flex-1 rounded-lg h-9 text-xs transition-all ${trafficSource === nw.id ? 'bg-white text-black font-semibold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                          onClick={() => setTrafficSource(nw.id)}
                        >{nw.label}</Button>
                      ))}
                    </div>
                  </div>

                  <Accordion type="multiple" defaultValue={['geral','segmentacao','ia','bots']} className="space-y-3">
                    {/* Geral */}
                    <AccordionItem value="geral" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3"><Link2 size={16} className="text-gray-400" /> Links e Nome</div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="space-y-1">
                          <Label>Nome da Campanha *</Label>
                          <Input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="Ex: Campanha de Ticket Alto" className="bg-[#0a0a0a] border-[#1f1f23] rounded-xl text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Safe URL <span className="text-emerald-500 text-[10px]">(Bots vão aqui)</span></Label>
                            <Input value={safeUrl} onChange={e => setSafeUrl(e.target.value)} placeholder="https://..." className="bg-[#0a0a0a] border-[#1f1f23] rounded-xl text-white" />
                          </div>
                          <div className="space-y-1">
                            <Label>Money URL <span className="text-red-400 text-[10px]">(Clientes reais)</span></Label>
                            <Input value={moneyUrl} onChange={e => setMoneyUrl(e.target.value)} placeholder="https://..." className="bg-[#0a0a0a] border-[#1f1f23] rounded-xl text-white" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Segmentação */}
                    <AccordionItem value="segmentacao" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3"><Globe2 size={16} className="text-blue-400" /> Segmentação</div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        {/* Country Selector */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Países Permitidos</Label>
                            <span className="text-[10px] text-gray-500">{selectedCountries.length} selecionados</span>
                          </div>
                          <button onClick={() => setCountryPickerOpen(true)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-[#1f1f23] rounded-xl text-left hover:border-gray-600 transition-colors"
                          >
                            <span className="text-sm text-gray-400 truncate">{selectedCountries.length === 0 ? 'Nenhum país selecionado' : countryLabels}</span>
                            <ChevronRight size={14} className="text-gray-500 shrink-0 ml-2" />
                          </button>
                        </div>

                        {/* Language Selector */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Idioma do Navegador</Label>
                            <span className="text-[10px] text-emerald-500">{filterByLanguage ? `${selectedLanguages.length} idiomas` : 'Desativado'}</span>
                          </div>
                          <button onClick={() => setLangPickerOpen(true)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-[#1f1f23] rounded-xl text-left hover:border-gray-600 transition-colors"
                          >
                            <span className="text-sm text-gray-400">
                              {filterByLanguage ? selectedLanguages.slice(0, 2).join(', ') + (selectedLanguages.length > 2 ? ` +${selectedLanguages.length - 2}` : '') : 'Clique para configurar filtro de idioma'}
                            </span>
                            <ChevronRight size={14} className="text-gray-500 shrink-0 ml-2" />
                          </button>
                        </div>

                        {/* Filter Browser */}
                        <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-xl border border-[#1f1f23]">
                          <div><Label>Filtrar por Navegador</Label><p className="text-[10px] text-gray-500">Bloqueia emuladores e botnets</p></div>
                          <Switch checked={filterBrowser} onCheckedChange={setFilterBrowser} className="data-[state=checked]:bg-white" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* IA / Risk */}
                    <AccordionItem value="ia" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3"><Layout size={16} className="text-orange-400" /> Inteligência de Risco</div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-2 pb-4">
                        <div className="flex items-center justify-between">
                          <Label>Score de Sensibilidade</Label>
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">Rigor: {riskScore[0]}%</Badge>
                        </div>
                        <Slider value={riskScore} onValueChange={setRiskScore} max={100} step={1} disabled={sysRecommendations} className="py-4" />
                        {sysRecommendations && <p className="text-[10px] text-emerald-500">Travado pelas recomendações do sistema (65%).</p>}
                        <div className="space-y-3 pt-2 border-t border-[#1f1f23]">
                          {[['Machine Learning Adaptativo', true], ['Classificação Inteligente (Auto-Block)', true]].map(([label, def]) => (
                            <div key={label as string} className="flex items-center justify-between">
                              <Label className="text-xs">{label as string}</Label>
                              <Switch defaultChecked={def as boolean} disabled={sysRecommendations} className="data-[state=checked]:bg-white" />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Bots */}
                    <AccordionItem value="bots" className="border border-[#1f1f23] bg-[#111] rounded-2xl overflow-hidden px-4">
                      <AccordionTrigger className="hover:no-underline text-white font-semibold">
                        <div className="flex items-center gap-3"><AlertTriangle size={16} className="text-red-400" /> Rede, Bots & Proteção</div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-3 pt-2 pb-4">
                        {['Redes (FB/GGL/TK/Kwai)', 'Bots & Crawlers', 'AdSpy Tools', 'Proxy, VPN & Datacenter', 'Canvas & WebGL Fingerprint', 'Análise Mouse & Scroll'].map(label => (
                          <div key={label} className="flex items-center justify-between">
                            <Label className="text-xs">{label}</Label>
                            <Switch defaultChecked className="data-[state=checked]:bg-white" />
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>

              <DialogFooter className="border-t border-[#1f1f23] bg-[#0a0a0a] p-4 flex gap-3">
                <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button className="flex-1 bg-white text-black hover:bg-gray-200 font-bold rounded-xl" onClick={handleSaveCampaign} disabled={!campaignName.trim()}>
                  <CheckCircle2 size={16} className="mr-2" /> Salvar Campanha
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
