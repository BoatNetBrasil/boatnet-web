import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Marquee } from '@/components/Marquee'
import { AppCTA } from '@/components/AppCTA'
import { Verticals } from '@/components/Verticals'
import { HowItWorks } from '@/components/HowItWorks'
import { Programs } from '@/components/Programs'
import { LeadForm } from '@/components/LeadForm'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <AppCTA />
      <Verticals />
      <HowItWorks />
      <Programs />
      <LeadForm />
      <FAQ />
      <Footer />
    </main>
  )
}
