'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  SlidersHorizontal,
  Package,
  UploadCloud,
  Link2,
  ImageIcon,
  Lightbulb,
  Trash2,
  MoreHorizontal,
  Pencil,
  Ban,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface KitItem {
  id: number
  name: string
  qty: number
  price: number
}

interface Kit {
  id: number
  name: string
  description: string
  status: 'Publicado' | 'Rascunho' | 'Inativo'
  items: KitItem[]
  total: number
  image?: string
}

const mockKits: Kit[] = []

export function KitsDashboard() {
  const [kits, setKits] = useState<Kit[]>(mockKits)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  // form state
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newStatus, setNewStatus] = useState('Rascunho')
  const [newItems, setNewItems] = useState<KitItem[]>([])
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState('')

  const filtered = kits.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase())
  )

  function addItem() {
    setNewItems(prev => [
      ...prev,
      { id: Date.now(), name: '', qty: 1, price: 0 },
    ])
  }

  function removeItem(id: number) {
    setNewItems(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id: number, field: keyof KitItem, value: string | number) {
    setNewItems(prev =>
      prev.map(i => (i.id === id ? { ...i, [field]: value } : i))
    )
  }

  function handleCreate() {
    if (!newName.trim()) return
    const total = newItems.reduce((s, i) => s + i.price * i.qty, 0)
    setKits(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newName,
        description: newDesc,
        status: newStatus as Kit['status'],
        items: newItems,
        total,
        image: imageUrl || undefined,
      },
    ])
    setShowCreate(false)
    setNewName('')
    setNewDesc('')
    setNewStatus('Rascunho')
    setNewItems([])
    setImageUrl('')
  }

  const statusColor: Record<Kit['status'], string> = {
    Publicado: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Rascunho:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    Inativo:   'bg-red-500/15 text-red-400 border-red-500/30',
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">Kits</h1>
          <Button
            className="rounded-xl gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={16} />
            Criar Novo Kit
          </Button>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar kits..."
              className="pl-9 rounded-xl bg-card/80 border-border/50"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl gap-2">
            <SlidersHorizontal size={16} />
            Filtros
          </Button>
        </div>

        {/* Table */}
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground pl-6">Kit</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Itens</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Total</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Package size={48} className="text-muted-foreground/30" />
                        <p className="text-muted-foreground font-medium">Nenhum kit encontrado</p>
                        <p className="text-muted-foreground/60 text-sm">Crie seu primeiro kit para começar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(kit => (
                    <TableRow key={kit.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          {kit.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={kit.image} alt={kit.name} className="w-10 h-10 rounded-xl object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                              <Package size={18} className="text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium text-foreground">{kit.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{kit.items.length} {kit.items.length === 1 ? 'item' : 'itens'}</TableCell>
                      <TableCell className="text-foreground font-medium">
                        R$ {kit.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`rounded-full text-xs ${statusColor[kit.status]}`}>
                          {kit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl w-36">
                            <DropdownMenuItem className="gap-2 text-emerald-400 focus:text-emerald-400">
                              <Pencil size={14} /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Ban size={14} /> Inativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg rounded-2xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Criar Novo Kit</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Preencha os dados para criar um novo kit
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Nome */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Nome do Kit <span className="text-red-400">*</span>
                </Label>
                <Input
                  placeholder="Ex: Kit Premium Body Oil"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  maxLength={100}
                  className="rounded-xl bg-background/50"
                />
                <p className="text-xs text-muted-foreground text-right">{newName.length}/100 caracteres</p>
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea
                  placeholder="Descreva o kit..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="rounded-xl bg-background/50 resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{newDesc.length}/500 caracteres</p>
              </div>

              {/* Imagem */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Imagem do Kit</Label>
                <div className="border-2 border-dashed border-border/50 rounded-2xl p-6">
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <UploadCloud size={32} className="text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Adicione uma imagem do seu produto</p>
                  </div>
                  <div className="flex rounded-xl overflow-hidden border border-border/50 mb-3">
                    <button
                      onClick={() => setImageTab('upload')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
                        imageTab === 'upload' ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <UploadCloud size={14} /> Upload
                    </button>
                    <button
                      onClick={() => setImageTab('url')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors ${
                        imageTab === 'url' ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Link2 size={14} /> URL
                    </button>
                  </div>
                  {imageTab === 'url' ? (
                    <Input
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      className="rounded-xl bg-background/50"
                    />
                  ) : (
                    <button className="w-full py-2.5 rounded-xl border border-border/50 text-sm text-violet-400 hover:bg-muted/30 transition-colors">
                      Clique para selecionar um arquivo
                    </button>
                  )}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lightbulb size={12} className="text-yellow-400" />
                      <span className="font-medium">Dicas para uma boa imagem:</span>
                    </div>
                    {['Formato: PNG, JPG ou WebP', 'Tamanho: 500px x 500px (1:1)', 'Fundo branco ou transparente', 'Boa iluminação e foco'].map(tip => (
                      <p key={tip} className="text-xs text-muted-foreground pl-4">• {tip}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="rounded-xl bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Publicado">Publicado</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Itens do Kit */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Itens do Kit <span className="text-red-400">*</span>
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-1.5 text-violet-400 border-violet-500/30 hover:bg-violet-500/10"
                    onClick={addItem}
                  >
                    <Plus size={14} /> Adicionar Item
                  </Button>
                </div>

                {newItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 border border-dashed border-border/50 rounded-2xl">
                    <Package size={36} className="text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm">Nenhum item adicionado</p>
                    <p className="text-muted-foreground/60 text-xs">Clique em &quot;Adicionar Item&quot; para começar</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {newItems.map(item => (
                      <div key={item.id} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={14} className="text-muted-foreground" />
                        </div>
                        <Input
                          placeholder="Nome do produto"
                          value={item.name}
                          onChange={e => updateItem(item.id, 'name', e.target.value)}
                          className="rounded-lg h-8 text-sm bg-background/50 flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Qtd"
                          value={item.qty}
                          onChange={e => updateItem(item.id, 'qty', Number(e.target.value))}
                          className="rounded-lg h-8 text-sm bg-background/50 w-16"
                        />
                        <Input
                          type="number"
                          placeholder="Preço"
                          value={item.price}
                          onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                          className="rounded-lg h-8 text-sm bg-background/50 w-24"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="opacity-30" />
            <DialogFooter className="gap-2 pt-2">
              <Button variant="outline" className="rounded-xl" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button
                className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
                onClick={handleCreate}
                disabled={!newName.trim()}
              >
                Criar Kit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  )
}
