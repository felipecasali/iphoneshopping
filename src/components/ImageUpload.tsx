'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (urls: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [error, setError] = useState<string>('')

  const handleSuccess = (result: any) => {
    console.log('Upload successful:', result)
    const newUrl = result.info.secure_url
    const updatedImages = [...images, newUrl]
    onImagesChange(updatedImages)
    setError('')
  }

  const handleError = (error: any) => {
    console.error('Upload error:', error)
    setError('Erro ao fazer upload da imagem. Tente novamente.')
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove)
    onImagesChange(updatedImages)
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-gray-200">
                <Image
                  src={url}
                  alt={`Foto ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  title="Remover foto"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                    Principal
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''}
          onSuccess={handleSuccess}
          onError={handleError}
          options={{
            maxFiles: 1,
            maxFileSize: 5000000, // 5MB
            sources: ['local', 'camera'],
            multiple: false,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            resourceType: 'image',
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                console.log('Opening upload widget...')
                open()
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition"
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                {images.length === 0 
                  ? 'Adicione a primeira foto do seu aparelho'
                  : `Adicionar mais fotos (${images.length}/${maxImages})`
                }
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG ou WEBP até 5MB
              </p>
            </button>
          )}
        </CldUploadWidget>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-medium text-blue-900 mb-1">💡 Dicas para boas fotos:</p>
        <ul className="text-blue-800 space-y-1 text-xs">
          <li>• Use boa iluminação natural</li>
          <li>• Mostre diferentes ângulos do aparelho</li>
          <li>• Inclua foto da tela ligada</li>
          <li>• Mostre possíveis defeitos ou marcas de uso</li>
          <li>• A primeira foto será a capa do anúncio</li>
        </ul>
      </div>
    </div>
  )
}
