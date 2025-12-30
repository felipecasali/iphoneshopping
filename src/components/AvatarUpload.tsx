'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
  currentAvatar?: string | null
  onUploadComplete: (avatarUrl: string) => void
}

export default function AvatarUpload({ currentAvatar, onUploadComplete }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Criar preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Fazer upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'iphoneshopping_preset')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dizpzljoy/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem')
      }

      const data = await response.json()
      
      // Atualizar no banco de dados
      const updateResponse = await fetch('/api/user/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: data.secure_url }),
      })

      if (!updateResponse.ok) {
        throw new Error('Erro ao salvar avatar')
      }

      onUploadComplete(data.secure_url)
      setPreviewUrl(data.secure_url)
    } catch (err) {
      console.error('Erro ao fazer upload:', err)
      setError('Erro ao fazer upload da imagem. Tente novamente.')
      setPreviewUrl(currentAvatar || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    setError(null)

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: null }),
      })

      if (!response.ok) {
        throw new Error('Erro ao remover avatar')
      }

      setPreviewUrl(null)
      onUploadComplete('')
    } catch (err) {
      console.error('Erro ao remover avatar:', err)
      setError('Erro ao remover foto. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Avatar"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <span className="text-4xl font-bold text-primary-600">
                {currentAvatar ? '?' : 'Você'}
              </span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
        
        {previewUrl && !isUploading && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
            title="Remover foto"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Camera className="h-5 w-5" />
        <span>{previewUrl ? 'Trocar Foto' : 'Adicionar Foto'}</span>
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <p className="mt-2 text-xs text-gray-500 text-center">
        JPG, PNG ou GIF. Máximo 5MB.
      </p>
    </div>
  )
}
