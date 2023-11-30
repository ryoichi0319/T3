import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getAuthSession } from '@/lib/nextauth'
import AuthProvider from '@/components/providers/AuthProvider'
import TrpcProvider from '@/components/providers/TrpcProviders'
import ToastProvider from '@/components/providers/ToastProviders'
import Navigation from '@/components/auth/Navigation'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'T3stack入門',
  description: 'T3stack入門',
}
interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = async ({children,}: RootLayoutProps) => {
  //認証情報取得
  const user = await getAuthSession()
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='flex min-h-screen flex-col '> 
        <AuthProvider>
          <TrpcProvider>
         <Navigation user={user}/>
         <ToastProvider />
           <main className='container mx-auto max-w-screen-md flex-1 px-2 '>
           {children}
           </main>
          <footer className=' py-5'>
           <div className=' text-center text-sm'>
            copyright ©︎ All rights reserved | {""}
            <a 
            href='https://ww.youtube.com/@fullstackchannel'
            target='_blank'
            rel=' noopener noreferrer'
            className=' underline'
            >
              FullstackChannel
            </a>
          </div>
         </footer>
         </TrpcProvider>
        </AuthProvider>
      </div>
  </body>
    </html>
  )
}
export default RootLayout