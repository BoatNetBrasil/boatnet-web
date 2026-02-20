// components/Footer.tsx
import { Container } from '@/components/Container'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-12">
      <Container>
        <div className="hr" />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/55">© {year} BOAT NET. Todos os direitos reservados.</div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wide text-white/60">
            <a href="#o-app" className="hover:text-white">Baixar o APP</a>
            <a href="#parceiros" className="hover:text-white">Parceiros</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="mailto:contato@boatnet.com.br" className="hover:text-white">Contato</a>

            {/* LinkedIn (Company Page) */}
            <a
              href="https://www.linkedin.com/company/boat-net/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="BOAT NET no LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
