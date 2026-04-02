import { Geist_Mono, Inter, Poppins } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TopBarProvider } from "@/components/TopBarContext"
import { AppShell } from "@/components/AppShell"
import { ProductsProvider } from "@/components/ProductsContext"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// Display font — used for large headings and section titles
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        poppins.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <TopBarProvider>
            <ProductsProvider>
              <AppShell>{children}</AppShell>
            </ProductsProvider>
          </TopBarProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
