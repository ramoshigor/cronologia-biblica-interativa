import { Link } from 'react-router'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFoundPage() {
  return <div className="not-found-page"><span className="not-found-icon"><Compass size={27} /></span><span className="eyebrow">PÁGINA NÃO ENCONTRADA</span><h1>Este caminho ainda não está no mapa.</h1><p>O endereço pode estar incorreto ou o conteúdo pode não fazer parte desta amostra.</p><Link to="/" className="button button-dark"><ArrowLeft size={16} /> Voltar ao início</Link></div>
}
