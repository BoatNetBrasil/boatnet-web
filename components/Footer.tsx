import { Container } from '@/components/Container'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="py-12">
      <Container>
        <div className="hr" />

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/55">
            © {year} BOAT NET. Todos os direitos reservados.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wide text-white/60">
            <a href="#o-app" className="hover:text-white">Baixar o APP</a>
            <a href="#parceiros" className="hover:text-white">Parceiros</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="mailto:contato@boatnet.com.br" className="hover:text-white">Contato</a>

            <span className="mx-1 hidden sm:inline text-white/20">|</span>

            <a
              href="https://www.linkedin.com/company/boat-net/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="BOAT NET no LinkedIn"
            >
              LinkedIn
            </a>

            <a
              href="https://www.instagram.com/boatnet/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="BOAT NET no Instagram"
            >
              Instagram
            </a>

            <a
              href="https://www.youtube.com/@BOATNET-BR"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="BOAT NET no YouTube"
            >
              YouTube
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61588025934462"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
              aria-label="BOAT NET no Facebook"
            >
              Facebook
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
