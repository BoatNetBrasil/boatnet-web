/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // mantenha simples; o App Router já é padrão
  },
  images: {
    // o site vai usar placeholders locais; você pode liberar domínios depois
    remotePatterns: []
  }
}

module.exports = nextConfig
