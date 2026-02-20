export {}

declare global {
  type Preset = 'default' | 'partner' | 'booking' | 'support'

  interface Window {
    BNChat?: {
      open: (args?: { preset?: Preset }) => void
      close: () => void
      reset: () => void
    }
  }
}
