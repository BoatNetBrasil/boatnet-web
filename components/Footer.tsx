import { Container } from '@/components/Container'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="py-12">
      <Container>
        <div className="hr" />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/55">
            © {year} BoatNet. Todos os direitos reservados.
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold tracking-wide text-white/60">
            <a href="#o-app" className="hover:text-white">App</a>
            <a href="#programas" className="hover:text-white">Parceiros</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#contato" className="hover:text-white">Contato</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
