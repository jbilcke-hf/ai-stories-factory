import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { inter, salsa } from './fonts'

export const metadata: Metadata = {
  title: 'Illustrateur (non-commercial usage only)',
  description: 'Illustrateur - for non-commercial usage only',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        `h-full w-full overflow-none`,
        salsa.className
        )}>
        {children}
      </body>
    </html>
  )
}
