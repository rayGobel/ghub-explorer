import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { setupWorker } from 'msw'
import { handlers } from '../resource/mocks/handlers'

const devEnvironment = process.env.NODE_ENV == 'development'
const inBrowserOnly = global.window !== undefined
const mswFlag = process.env.NEXT_PUBLIC_ENABLE_MSW


const enableMSW = devEnvironment && inBrowserOnly && mswFlag

if (enableMSW) {
  const worker = setupWorker(...handlers)
  worker.start()
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
