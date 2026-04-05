'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { User, Mail, Phone, Lock, Eye, EyeOff, ChevronDown, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f23] rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-sm text-gray-400">Preencha os dados abaixo para começar</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Nome Completo */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-white" />
            </div>
            <Input 
              type="text" 
              placeholder="Nome Completo *" 
              className="pl-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-white transition-all"
            />
          </div>

          {/* Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign size={18} className="text-white" />
            </div>
            <Input 
              type="text" 
              placeholder="usuario" 
              className="pl-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-white transition-all"
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1 pl-1">Apenas letras, números e underscore</p>

          {/* Email */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-white" />
            </div>
            <Input 
              type="email" 
              placeholder="Email *" 
              className="pl-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-white transition-all"
            />
          </div>

          {/* Telefone */}
          <div className="flex gap-2">
            <div className="w-1/3 relative flex items-center justify-between px-3 bg-[#0f0f11] border border-[#1f1f23] rounded-xl h-12 cursor-pointer hover:border-gray-700 transition-colors">
              <span className="text-white text-sm font-semibold flex items-center gap-1">
                <span className="text-white uppercase text-xs">BR</span> +55
              </span>
              <ChevronDown size={14} className="text-white" />
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-white" />
              </div>
              <Input 
                type="tel" 
                placeholder="Telefone *" 
                className="pl-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-white transition-all"
              />
            </div>
          </div>

          {/* Senhas */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-white" />
              </div>
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha *" 
                className="pl-10 pr-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-white transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#b81d77]" />
              </div>
              <Input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirmar *" 
                className="pl-10 pr-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-[#b81d77] transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start space-x-3 pt-2 pb-2">
            <Checkbox id="terms" className="mt-1 border-[#1f1f23] data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black" />
            <label htmlFor="terms" className="text-[11px] text-gray-500 leading-tight">
              Li e concordo com os <Link href="#" className="text-[#b81d77] hover:underline">Termos de Uso</Link>, <Link href="#" className="text-[#b81d77] hover:underline">Política de Privacidade</Link> e <Link href="#" className="text-[#b81d77] hover:underline">Política de Cookies</Link>.
            </label>
          </div>

          <Button className="w-full bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-xl transition-all">
            CRIAR CONTA &rarr;
          </Button>

        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          Já tem uma conta? <Link href="/login" className="text-[#b81d77] hover:underline font-semibold">Entrar</Link>
        </p>

      </div>
    </div>
  )
}
