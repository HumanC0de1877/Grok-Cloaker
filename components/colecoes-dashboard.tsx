'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Package,
  UploadCloud,
  Link2,
  Lightbulb,
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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

interface Colecao {
  id: number
  name: string
  slug: string
  description: string
  position: number
  active: boolean
  image?: string
}

const mockColecoes: Colecao[] = []

export function ColecoesDashboard() {
  const [colecoes, setColecoes] = useState<Colecao[]>(mockColecoes)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  // form state
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPosition, setNewPosition] = useState(0)
  const [newActive, setNewActive] = useState(true)
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState('')

  const filtered = colecoes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  function toSlug(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  function handleNameChange(val: string) {
    setNewName(val)
    setNewSlug(toSlug(val))
  }

  function handleCreate() {
    if (!newName.trim()) return
    setColecoes(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newName,
        slug: newSlug,
        description: newDesc,
        position: newPosition,
        active: newActive,
        image: imageUrl || undefined,
      },
    ])
    setShowCreate(false)
    setNewName('')
    setNewSlug('')
    setNewDesc('')
    setNewPosition(0)
    setNewActive(true)
    setImageUrl('')
  }

  function handleDelete(id: number) {
    setColecoes(prev => prev.filter(c => c.id !== id))
  }

  return (
    <ScrollArea className="flex-1 h-screen">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Coleções de Produtos</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize seus produtos em categorias e coleções</p>
          </div>
          <Button
            className="rounded-xl gap-2 bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={16} />
            Nova Coleção
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar coleções..."
            className="pl-9 rounded-xl bg-card/80 border-border/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <Card className="rounded-2xl shadow-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground pl-6">Imagem</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Nome</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-violet-400">Slug</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-violet-400">Posição</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase text-muted-foreground text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Package size={48} className="text-muted-foreground/30" />
                        <p className="text-muted-foreground font-medium">Nenhuma coleção criada ainda</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl gap-1.5 mt-1"
                          onClick={() => setShowCreate(true)}
                        >
                          <Plus size={14} /> Criar primeira coleção
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map(col => (
                    <TableRow key={col.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-6">
                        {col.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={col.image} alt={col.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                            <Package size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{col.name}</TableCell>
                      <TableCell className="text-violet-400 text-sm">{col.slug}</TableCell>
                      <TableCell className="text-muted-foreground">{col.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-full text-xs ${
                            col.active
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}
                        >
                          {col.active ? 'Ativa' : 'Inativa'}
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
                            <DropdownMenuItem
                              className="gap-2 text-red-400 focus:text-red-400"
                              onClick={() => handleDelete(col.id)}
                            >
                              <Trash2 size={14} /> Excluir
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
          <DialogContent className="max-w-md rounded-2xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Nova Coleção</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Crie uma nova coleção para organizar seus produtos
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Nome */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Nome <span className="text-red-400">*</span>
                </Label>
                <Input
                  placeholder="Ex: Eletrônicos"
                  value={newName}
                  onChange={e => handleNameChange(e.target.value)}
                  className="rounded-xl bg-background/50"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">
                  Slug <span className="text-red-400">*</span>
                </Label>
                <Input
                  placeholder="Ex: eletronicos"
                  value={newSlug}
                  onChange={e => setNewSlug(e.target.value)}
                  className="rounded-xl bg-background/50"
                />
                <p className="text-xs text-muted-foreground">URL amigável para a coleção</p>
              </div>

              {/* Descrição */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Descrição</Label>
                <Textarea
                  placeholder="Descreva esta coleção..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  className="rounded-xl bg-background/50 resize-none"
                />
              </div>

              {/* Imagem */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Imagem da Coleção</Label>
                <div className="border border-border/50 rounded-2xl overflow-hidden">
                  <div className="flex">
                    <button
                      onClick={() => setImageTab('upload')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                        imageTab === 'upload' ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground bg-muted/30'
                      }`}
                    >
                      <UploadCloud size={14} /> Upload
                    </button>
                    <button
                      onClick={() => setImageTab('url')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                        imageTab === 'url' ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground bg-muted/30'
                      }`}
                    >
                      <Link2 size={14} /> URL
                    </button>
                  </div>
                  <div className="p-3">
                    {imageTab === 'url' ? (
                      <Input
                        placeholder="https://..."
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        className="rounded-xl bg-background/50"
                      />
                    ) : (
                      <button className="w-full py-2.5 rounded-xl border border-border/50 text-sm text-muted-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2">
                        <Copy size={14} /> Clique para selecionar
                      </button>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">PNG, JPG ou WebP · Max 5MB · 500x500px recomendado</p>
                  </div>
                </div>
              </div>

              {/* Posição */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Posição</Label>
                <Input
                  type="number"
                  value={newPosition}
                  onChange={e => setNewPosition(Number(e.target.value))}
                  className="rounded-xl bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Ordem de exibição da coleção</p>
              </div>

              {/* Ativa */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
                <Switch
                  checked={newActive}
                  onCheckedChange={setNewActive}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <Label className="text-sm font-medium cursor-pointer" onClick={() => setNewActive(!newActive)}>
                  Coleção ativa
                </Label>
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
                disabled={!newName.trim() || !newSlug.trim()}
              >
                Criar Coleção
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  )
}
