import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">iPhoneShopping</h3>
            <p className="text-gray-400 text-sm">
              Marketplace especializado em iPhones e iPads no Brasil. Compre e venda com segurança.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/avaliar" className="text-gray-400 hover:text-white text-sm">
                  Avaliar Aparelho
                </Link>
              </li>
              <li>
                <Link href="/anuncios" className="text-gray-400 hover:text-white text-sm">
                  Ver Anúncios
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-gray-400 hover:text-white text-sm">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/vender" className="text-gray-400 hover:text-white text-sm">
                  Vender
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ajuda" className="text-gray-400 hover:text-white text-sm">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-400 hover:text-white text-sm">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-400 hover:text-white text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-400 hover:text-white text-sm">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>contato@iphoneshopping.com.br</li>
              <li>Suporte: Segunda a Sexta</li>
              <li>09:00 - 18:00</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} iPhoneShopping. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
