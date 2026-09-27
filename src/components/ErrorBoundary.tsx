import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false }

  static getDerivedStateFromError(): State { return { hasError: true } }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Cronologia Bíblica: falha de interface', error, info.componentStack)
  }

  override render() {
    if (this.state.hasError) {
      return <div className="error-state"><span><AlertTriangle size={21} /></span><h2>Não foi possível carregar esta tela.</h2><p>Tente novamente para abrir esta consulta.</p><button className="button button-dark" onClick={() => this.setState({ hasError: false })}><RotateCcw size={15} /> Tentar novamente</button></div>
    }
    return this.props.children
  }
}
