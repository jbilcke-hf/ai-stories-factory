import { cn } from '@/lib/utils/cn'
import './globals.css'
import type { Metadata } from 'next'
import { inter, salsa } from './fonts'

export const metadata: Metadata = {
  title: 'AI Stories Factory - Generate video stories using AI ✨',
  description: 'AI Stories Factory - Generate video stories using AI ✨',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        `h-full w-full overflow-none light`,
        salsa.className
        )}>
        {children}
      </body>
    </html>
  )
}
