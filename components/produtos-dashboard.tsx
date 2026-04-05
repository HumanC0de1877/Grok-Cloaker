'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Package,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Box,
  FileText,
  Image as ImageIcon,
  Info,
  ArrowLeft,
  Pencil,
  Link2,
  Ban,
  Trash2,
  Copy,
  HelpCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Textarea } from '@/components/ui/textarea'

type Product = {
  id: number
  name: string
  image: string
  type: string
  originalPrice: number | null
  price: number
  status: string
  description?: string
  shortDescription?: string
  peso?: string
  altura?: string
  largura?: string
  comprimento?: string
  estoque?: number
  emDestaque?: boolean
}

const mockProducts: Product[] = [
  { id: 1, name: 'Yellowstone Pecuária Rural Personalizado', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=Y', type: 'Físico', originalPrice: 59.90, price: 29.90, status: 'Publicado', description: '<p><img src="https://cdn.shopify.com/s/files/1/0769/5994/0830/files/FRETE_GRATIS.png?v=1764019457" alt=""></p>', estoque: 0 },
  { id: 2, name: 'Tábua De Corte Vasco Futebol', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=T', type: 'Físico', originalPrice: 129.90, price: 64.90, status: 'Publicado', estoque: 5 },
  { id: 3, name: 'Tábua De Corte Do Cruzeiro', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=T', type: 'Físico', originalPrice: 129.90, price: 64.90, status: 'Publicado', estoque: 3 },
  { id: 4, name: 'Torneira Rústica Artesanal para Bebidas', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=T', type: 'Físico', originalPrice: 291.03, price: 197.90, status: 'Publicado', estoque: 2 },
  { id: 5, name: 'Tábua Personalizada Do Flamengo', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=T', type: 'Físico', originalPrice: 129.90, price: 64.90, status: 'Publicado', estoque: 10 },
  { id: 6, name: 'Óleo Mineral de Conservação', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=O', type: 'Físico', originalPrice: null, price: 9.00, status: 'Publicado', estoque: 20 },
  { id: 7, name: 'Tábua De Cortar Carne Corte Churrasco Para Cozinha 34 × 23cm', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=T', type: 'Físico', originalPrice: 122.00, price: 65.93, status: 'Publicado', estoque: 7 },
  { id: 8, name: 'Kit Churrasco do Corinthians - Personalizado', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=K', type: 'Físico', originalPrice: 274.00, price: 137.00, status: 'Publicado', estoque: 4 },
  { id: 9, name: 'Punhal Artesanal 10" Cabo em osso', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=P', type: 'Físico', originalPrice: 349.00, price: 297.00, status: 'Publicado', estoque: 2 },
  { id: 10, name: 'Kit Churrasco Artesanal Folha 8"', image: 'https://placehold.co/48x48/1a1a1f/ffffff?text=K', type: 'Físico', originalPrice: 497.00, price: 429.00, status: 'Publicado', estoque: 1 },
]

type Variant = {
  id: number
  name: string
  image: string
  price: number
  status: 'Ativo' | 'Inativo'
}

type VariantOption = {
  name: string
  values: string[]
  inputValue: string
}

// ─── Nova Variante Dialog ────────────────────────────────────────────────────

const NovaVarianteDialog: React.FC<{
  open: boolean
  onOpenChange: (v: boolean) => void
}> = ({ open, onOpenChange }) => {
  const [options, setOptions] = useState<VariantOption[]>([{ name: '', values: [], inputValue: '' }])

  const addOption = () => setOptions((prev) => [...prev, { name: '', values: [], inputValue: '' }])

  const updateOptionName = (idx: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, name: value } : o)))
  }

  const handleValueKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && options[idx].inputValue.trim()) {
      setOptions((prev) =>
        prev.map((o, i) =>
          i === idx
            ? { ...o, values: [...o.values, o.inputValue.trim()], inputValue: '' }
            : o
        )
      )
    }
  }

  const updateInputValue = (idx: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === idx ? { ...o, inputValue: value } : o)))
  }

  const removeValue = (optIdx: number, valIdx: number) => {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIdx ? { ...o, values: o.values.filter((_, vi) => vi !== valIdx) } : o
      )
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
              <Package size={20} className="text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Nova Variante</DialogTitle>
              <p className="text-muted-foreground text-xs mt-0.5">
                Adicione opções para personalizar seu produto. Ex: cores, tamanhos, etc.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Tipo da Variante */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Label className="text-sm font-medium">Tipo da Variante</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle size={13} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Defina o tipo de variante, ex: Cor, Tamanho</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <Label className="text-sm font-medium">Opções</Label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle size={13} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Digite os valores e pressione Enter para adicionar</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Card className="rounded-xl border-border/50 bg-muted/20">
              <CardContent className="p-4 space-y-4">
                {options.map((option, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Nome da Opção</Label>
                      <div className="relative">
                        <Select value={option.name} onValueChange={(v) => updateOptionName(idx, v)}>
                          <SelectTrigger className="rounded-xl text-sm">
                            <SelectValue placeholder="Ex: Cor, Tamanho" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Cor">Cor</SelectItem>
                            <SelectItem value="Tamanho">Tamanho</SelectItem>
                            <SelectItem value="Material">Material</SelectItem>
                            <SelectItem value="Estilo">Estilo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Valores</Label>
                      <div className="min-h-10 rounded-xl border border-border bg-background/50 px-3 py-2 flex flex-wrap gap-1 items-center">
                        {option.values.map((val, vi) => (
                          <span
                            key={vi}
                            className="inline-flex items-center gap-1 bg-muted rounded-lg px-2 py-0.5 text-xs"
                          >
                            {val}
                            <button onClick={() => removeValue(idx, vi)}>
                              <X size={10} className="text-muted-foreground hover:text-foreground" />
                            </button>
                          </span>
                        ))}
                        <input
                          className="flex-1 min-w-[80px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                          placeholder={option.values.length === 0 ? 'Digite e pressione Enter' : ''}
                          value={option.inputValue}
                          onChange={(e) => updateInputValue(idx, e.target.value)}
                          onKeyDown={(e) => handleValueKeyDown(idx, e)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-2"
              onClick={addOption}
            >
              <Plus size={14} />
              Adicionar Opção
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onOpenChange(false)}
            >
              Criar Variante
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Edit Product View ────────────────────────────────────────────────────────

const EditProductView: React.FC<{
  product: Product
  onBack: () => void
}> = ({ product, onBack }) => {
  const [activeTab, setActiveTab] = useState('geral')
  const [includeInactive, setIncludeInactive] = useState(false)
  const [showNovaVariante, setShowNovaVariante] = useState(false)
  const [emDestaque, setEmDestaque] = useState(product.emDestaque ?? false)
  const [productStatus, setProductStatus] = useState(product.status === 'Publicado' ? 'publicado' : 'rascunho')

  const variants: Variant[] = [
    { id: 1, name: 'Default Title', image: product.image, price: product.price, status: 'Ativo' },
  ]

  const collections = [
    { id: 1, name: 'Facas Artesanais', count: 12 },
    { id: 2, name: 'Kits Churrasco', count: 8 },
  ]

  return (
    <TooltipProvider>
      <ScrollArea className="flex-1 h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={onBack}
              >
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Editar Produto</h1>
                <p className="text-muted-foreground text-xs">Atualize as informações do seu produto</p>
              </div>
            </div>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              Salvar Alterações
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="rounded-xl bg-card/80 backdrop-blur-sm mb-6 border border-border/50 p-1 h-auto">
              <TabsTrigger value="geral" className="rounded-lg px-8 py-2 data-[state=active]:text-primary">Geral</TabsTrigger>
              <TabsTrigger value="variantes" className="rounded-lg px-8 py-2 data-[state=active]:text-primary">Variantes</TabsTrigger>
              <TabsTrigger value="colecoes" className="rounded-lg px-8 py-2 data-[state=active]:text-primary">{"Coleções"}</TabsTrigger>
              <TabsTrigger value="links" className="rounded-lg px-8 py-2 data-[state=active]:text-primary">Links</TabsTrigger>
            </TabsList>

            {/* ── Aba Geral ── */}
            <TabsContent value="geral">
              <div className="grid grid-cols-[1fr_320px] gap-6">
                {/* Coluna esquerda */}
                <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">Nome do Produto</Label>
                      <Input defaultValue={product.name} className="rounded-xl" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{"Descrição Completa"}</Label>
                      <Textarea
                        defaultValue={product.description ?? ''}
                        className="rounded-xl min-h-[100px] font-mono text-xs"
                        placeholder="Descrição completa do produto..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{"Descrição Curta"}</Label>
                      <Textarea
                        className="rounded-xl min-h-[70px]"
                        placeholder="Digite uma descrição curta do produto"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{"Preço"}</Label>
                      <Input defaultValue={`R$ ${product.price.toFixed(2).replace('.', ',')}`} className="rounded-xl" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{"Preço Promocional (opcional)"}</Label>
                      <Input defaultValue={product.originalPrice ? `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}` : ''} className="rounded-xl" placeholder="R$ 0,00" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium">{"Tipo do Produto"}</Label>
                      <Select defaultValue={product.type === 'Físico' ? 'fisico' : 'digital'}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="fisico">{"Físico"}</SelectItem>
                          <SelectItem value="digital">{"Digital"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-4">{"Informações de Envio"}</h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">{"Peso (kg)"}</Label>
                          <Input defaultValue="0" className="rounded-xl w-48" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">{"Altura (cm)"}</Label>
                            <Input defaultValue="0" className="rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">{"Largura (cm)"}</Label>
                            <Input defaultValue="0" className="rounded-xl" />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">{"Comprimento (cm)"}</Label>
                            <Input defaultValue="0" className="rounded-xl" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coluna direita */}
                <div className="space-y-4">
                  {/* Thumbnail */}
                  <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Thumbnail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted/30">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-muted-foreground transition-colors cursor-pointer">
                        <Upload size={20} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground mb-2">Adicione uma imagem do seu produto</p>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm" className="rounded-lg gap-1.5 text-xs">
                            <Upload size={12} />
                            Upload
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-lg gap-1.5 text-xs">
                            <Link2 size={12} />
                            URL
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full rounded-xl text-xs">
                        Clique para selecionar um arquivo
                      </Button>
                      <div className="p-3 bg-muted/20 rounded-xl">
                        <div className="w-16 h-16 rounded-lg bg-muted/50 mx-auto mb-2 overflow-hidden">
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="text-yellow-400">💡</span> Dicas para uma boa imagem:
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-0.5 pl-4">
                          <li>• Formato: PNG, JPG ou WebP</li>
                          <li>• Tamanho: 500px x 500px (1:1)</li>
                          <li>• Fundo branco ou transparente</li>
                          <li>• Boa iluminação e foco</li>
                        </ul>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Apenas arquivos .jpg e .png são aceitos.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Status */}
                  <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Select value={productStatus} onValueChange={setProductStatus}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="publicado">Publicado</SelectItem>
                          <SelectItem value="rascunho">Rascunho</SelectItem>
                          <SelectItem value="arquivado">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Estoque</Label>
                        <Input defaultValue={String(product.estoque ?? 0)} className="rounded-xl" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Produto em Destaque</Label>
                        <Switch checked={emDestaque} onCheckedChange={setEmDestaque} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ── Aba Variantes ── */}
            <TabsContent value="variantes">
              <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  {/* Header da aba */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Variantes do Produto</h3>
                      <p className="text-xs text-primary mt-0.5">Gerencie as variações disponíveis deste produto</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select defaultValue="preco">
                        <SelectTrigger className="w-[120px] rounded-xl h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="preco">{"Preço"}</SelectItem>
                          <SelectItem value="nome">Nome</SelectItem>
                          <SelectItem value="status">Status</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="decrescente">
                        <SelectTrigger className="w-[140px] rounded-xl h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="decrescente">Decrescente</SelectItem>
                          <SelectItem value="crescente">Crescente</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={includeInactive}
                          onCheckedChange={setIncludeInactive}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Incluir Inativos</span>
                      </div>
                      <Button
                        className="rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => setShowNovaVariante(true)}
                      >
                        <Plus size={14} />
                        Nova Variante
                      </Button>
                    </div>
                  </div>

                  {/* Tabela de variantes */}
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50 bg-muted/20 hover:bg-muted/20">
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">IMAGEM</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">NOME</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{"PREÇO"}</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">STATUS</TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">{"AÇÕES"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {variants.map((variant) => (
                          <TableRow key={variant.id} className="border-border/50 hover:bg-muted/20">
                            <TableCell>
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted/30">
                                <img src={variant.image} alt={variant.name} className="w-full h-full object-cover" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-primary font-semibold">{variant.name}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="rounded-lg font-mono text-xs">
                                  R$ {variant.price.toFixed(2).replace('.', ',')}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                                  <Pencil size={12} className="text-muted-foreground" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`rounded-full ${
                                  variant.status === 'Ativo'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {variant.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-destructive/10">
                                <Trash2 size={14} className="text-destructive/70" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Footer da tabela */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-primary">Mostrando 1 de variantes</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs">Anterior</Button>
                      <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs">{"Próxima"}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Aba Coleções ── */}
            <TabsContent value="colecoes">
              <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-base font-bold mb-4">{"Coleções do Produto"}</h3>
                  {collections.map((col) => (
                    <div key={col.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-foreground">{col.name}</p>
                        <p className="text-xs text-muted-foreground">{col.count} produtos</p>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                        <X size={14} className="text-muted-foreground" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl gap-2 mt-2">
                    <Plus size={14} />
                    Adicionar a uma {"Coleção"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Aba Links ── */}
            <TabsContent value="links">
              <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-3">
                  {[
                    { label: product.name, price: `R$ ${product.originalPrice?.toFixed(2).replace('.', ',') ?? product.price.toFixed(2).replace('.', ',')}`, href: `https://loja.exemplo.com/${product.id}` },
                    { label: `${product.name} / Default Title`, price: `R$ ${product.price.toFixed(2).replace('.', ',')}`, href: `https://loja.exemplo.com/${product.id}/default` },
                  ].map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-primary">{link.label}</p>
                        <p className="text-xs text-red-400 font-medium">{link.price}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-2 text-xs"
                        onClick={() => navigator.clipboard.writeText(link.href)}
                      >
                        <Copy size={12} />
                        Copiar Link
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <NovaVarianteDialog open={showNovaVariante} onOpenChange={setShowNovaVariante} />
      </ScrollArea>
    </TooltipProvider>
  )
}

// ─── Create Product Dialog ────────────────────────────────────────────────────

const CreateProductDialog: React.FC<{
  open: boolean
  onOpenChange: (v: boolean) => void
}> = ({ open, onOpenChange }) => {
  const [productType, setProductType] = useState<'fisico' | 'digital'>('fisico')
  const [recurringBilling, setRecurringBilling] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
              <Package size={20} className="text-muted-foreground" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Cadastrar Produto {"Físico"}</DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Preencha os dados sobre seu produto abertamente. Campos sinalizados com * são {"obrigatórios"}.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Tipo de Produto */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tipo de produto <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-4">
              {(['fisico', 'digital'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setProductType(type)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    productType === type
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${productType === type ? 'border-primary' : 'border-muted-foreground'}`}>
                      {productType === type && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    {type === 'fisico' ? <Box size={20} className="text-muted-foreground" /> : <FileText size={20} className="text-muted-foreground" />}
                    <div>
                      <div className="font-medium text-foreground">{type === 'fisico' ? 'Físico' : 'Digital'}</div>
                      <div className="text-xs text-muted-foreground">
                        {type === 'fisico' ? 'Produto que será entregue em mãos/AR' : 'E-book, cursos, Softwares, etc.'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Imagem do Produto */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Imagem do produto <span className="text-destructive">*</span>
            </Label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-muted-foreground transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <Upload size={28} className="text-muted-foreground" />
                <p className="text-foreground font-medium text-sm">Adicione uma imagem do seu produto</p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" size="sm" className="rounded-lg gap-2">
                    <Upload size={14} />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg gap-2">
                    <ImageIcon size={14} />
                    URL
                  </Button>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl">
              Clique para adicionar um arquivo
            </Button>
            <div className="p-3 bg-muted/20 rounded-xl">
              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                <span className="text-yellow-400">💡</span> Dicas para enviar as imagens
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5 pl-4">
                <li>• Formatos: PNG, JPG ou WebP</li>
                <li>• Tamanhos: 500px x 500px JPG</li>
                <li>• Escolha imagens em alta {"resolução"}</li>
                <li>• Fundo branco ou transparente</li>
              </ul>
            </div>
          </div>

          <Separator />

          {/* Título */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input placeholder="Digite o nome do produto" className="rounded-xl" />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {"Preço"} Original <span className="text-destructive">*</span>
              </Label>
              <Input placeholder="R$ 0,00" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Label className="text-sm font-medium">{"Preço"} Promocional</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle size={13} className="text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{"Preço"} com desconto exibido na loja</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input placeholder="R$ 0,00" className="rounded-xl" />
            </div>
          </div>

          {/* Coleções */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{"Coleções"} (opcional)</Label>
            <Select>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Nenhuma coleção selecionada" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none">Nenhuma coleção</SelectItem>
                <SelectItem value="promocoes">{"Promoções"}</SelectItem>
                <SelectItem value="novidades">Novidades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Informações de Logística */}
          <Card className="rounded-xl border-border/50 bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Box size={16} className="text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">{"Informações de Logística"}</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">Defina as {"dimensões"} e peso do produto para envio. Esses são utilizados pelo Frete.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Altura *</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0" className="rounded-xl" />
                    <span className="text-muted-foreground text-xs">cm</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Largura *</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0" className="rounded-xl" />
                    <span className="text-muted-foreground text-xs">cm</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Comprimento *</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0" className="rounded-xl" />
                    <span className="text-muted-foreground text-xs">cm</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Peso *</Label>
                  <div className="flex items-center gap-2">
                    <Input placeholder="0" className="rounded-xl" />
                    <span className="text-muted-foreground text-xs">kg</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted/30 rounded-xl flex items-start gap-2">
                <Info size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong>{"Informação"}:</strong> Peso e {"informações"} de tamanho são usados para calcular o frete (PAC ou SEDEX). Os valores acima precisam ser informados, senão poderá gerar erros no envio.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cobrança Recorrente */}
          <Card className="rounded-xl border-border/50 bg-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 font-bold text-sm">$</span>
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{"Cobrança"} Recorrente</CardTitle>
                  <p className="text-xs text-muted-foreground">Configure para que cobranças aconteçam automaticamente</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{"É"} um produto com {"cobrança"} recorrente?</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={13} className="text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Ative para produtos com {"assinatura"} mensal ou recorrente.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch checked={recurringBilling} onCheckedChange={setRecurringBilling} />
              </div>
              <div className="mt-3 p-3 bg-muted/30 rounded-xl flex items-start gap-2">
                <Info size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <strong>{"Informação"}:</strong> Produtos com {"cobrança"} recorrente {"automaticamente"} vão aparecer com o intervalo especificado. O sistema envia automaticamente as cobranças no momento programado.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus size={16} />
              Salvar Produto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const ProdutosDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState('10')

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filteredProducts.length / parseInt(itemsPerPage))

  if (editingProduct) {
    return <EditProductView product={editingProduct} onBack={() => setEditingProduct(null)} />
  }

  return (
    <TooltipProvider>
      <ScrollArea className="flex-1 h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus size={16} />
                Criar Novo Produto
              </Button>
              <Button variant="outline" className="rounded-xl gap-2 border-primary/40 text-primary hover:text-primary">
                <Package size={16} />
                Sincronizar com Shopify
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl bg-background/50"
                  />
                </div>
                <Button variant="outline" className="rounded-xl gap-2">
                  <Filter size={16} />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pl-6">PRODUTO</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">TIPO</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{"PREÇO"}</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">STATUS</TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right pr-6">{"AÇÕES"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-border/50 hover:bg-muted/20">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-muted/30 overflow-hidden shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <span
                            className="text-primary font-medium hover:underline cursor-pointer"
                            onClick={() => setEditingProduct(product)}
                          >
                            {product.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Package size={13} />
                          {product.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through text-xs">
                              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                          <span className="text-cyan-400 font-semibold text-sm">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-36">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Pencil size={14} className="text-green-400" />
                              <span className="text-green-400 font-medium">Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Ban size={14} className="text-muted-foreground" />
                              Inativar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Link2 size={14} className="text-muted-foreground" />
                              Links
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">Mostrar</span>
                  <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                    <SelectTrigger className="w-[70px] rounded-xl h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground text-sm">por página</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Mostrando 1 até {Math.min(parseInt(itemsPerPage), filteredProducts.length)} de {filteredProducts.length} resultados
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="rounded-xl h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                      <ChevronsLeft size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl h-8 w-8" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft size={14} />
                    </Button>
                    {[1, 2, 3].map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="icon"
                        className={`rounded-xl h-8 w-8 text-xs ${currentPage === page ? 'bg-primary hover:bg-primary/90' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <span className="text-muted-foreground px-1 text-sm">...</span>
                    <Button variant="outline" size="icon" className="rounded-xl h-8 w-8 text-xs" onClick={() => setCurrentPage(20)}>
                      20
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl h-8 w-8" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                      <ChevronsRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CreateProductDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      </ScrollArea>
    </TooltipProvider>
  )
}
