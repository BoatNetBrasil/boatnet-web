export {}

declare global {
  interface Window {
    BNChat?: {
      open: (args?: { preset?: string }) => void
      close: () => void
      reset: () => void
    }
  }
}
