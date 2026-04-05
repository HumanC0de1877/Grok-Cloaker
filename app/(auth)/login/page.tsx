'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#1f1f23] rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-400">Acesse sua conta para continuar</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-[#b81d77]" />
            </div>
            <Input 
              type="email" 
              placeholder="Email" 
              className="pl-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-[#b81d77] transition-all"
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-[#b81d77]" />
            </div>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Senha" 
              className="pl-10 pr-10 bg-[#0f0f11] border-[#1f1f23] text-white placeholder-gray-500 rounded-xl h-12 focus-visible:ring-[#b81d77] transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Lembrar e Recuperar */}
          <div className="flex items-center justify-between pt-2 pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-[#1f1f23] data-[state=checked]:bg-[#b81d77] data-[state=checked]:border-[#b81d77]" />
              <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer">Lembrar de mim</label>
            </div>
            <Link href="#" className="text-xs text-[#b81d77] hover:underline">Esqueceu a senha?</Link>
          </div>

          <Button className="w-full bg-[#b81d77] hover:bg-[#9a1561] text-white font-bold h-12 rounded-xl transition-all">
            ENTRAR &rarr;
          </Button>

        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          Não tem uma conta? <Link href="/register" className="text-[#b81d77] hover:underline font-semibold">Criar conta</Link>
        </p>

      </div>
    </div>
  )
}
