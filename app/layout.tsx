import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Workbench — Role & Permission Builder',
  description:
    'Build custom roles and manage permissions for your SaaS team. Visual permission matrix, multi-role assignment, and effective permission auditing.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text-1)] antialiased`}
      >
        <Sidebar />
        <main className="min-h-screen pl-16 md:pl-60">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-1)',
            },
          }}
        />
      </body>
    </html>
  )
}
