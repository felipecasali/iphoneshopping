import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'

interface ListingCardProps {
  listing: {
    id: string
    price: number
    condition: string
    images: string[]
    location: string
    createdAt: string
    device: {
      model: string
      type: string
      storage: number
      color: string
    }
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  const conditionLabels: Record<string, string> = {
    NOVO: 'Novo',
    EXCELENTE: 'Excelente',
    MUITO_BOM: 'Muito Bom',
    BOM: 'Bom',
    REGULAR: 'Regular',
    DEFEITO: 'Com Defeito',
  }

  return (
    <Link href={`/anuncio/${listing.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative h-64 bg-gray-200">
          {listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.device.model}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sem imagem
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
            {conditionLabels[listing.condition]}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">
            {listing.device.model}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">
            {listing.device.storage}GB • {listing.device.color}
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              R$ {listing.price.toLocaleString('pt-BR')}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              Hoje
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
