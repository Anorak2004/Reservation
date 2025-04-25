"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Sidebar } from "@/components/sidebar"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">打开菜单</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="flex items-center mb-6">
              <Activity className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-lg">体育馆</span>
            </div>
            <Sidebar className="px-2" />
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Activity className="h-6 w-6 text-primary hidden md:block" />
          <span className="font-bold text-lg hidden md:inline-block">体育馆预约系统</span>
          <span className="font-bold text-lg md:hidden">体育馆</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center space-x-4 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "transition-colors hover:text-primary text-sm font-medium px-3 py-2 rounded-md",
              pathname === "/" ? "text-primary bg-primary/10" : "text-foreground/60",
            )}
          >
            场馆预约
          </Link>
          <Link
            href="/accounts"
            className={cn(
              "transition-colors hover:text-primary text-sm font-medium px-3 py-2 rounded-md",
              pathname === "/accounts" ? "text-primary bg-primary/10" : "text-foreground/60",
            )}
          >
            账号管理
          </Link>
          <Link
            href="/auto-bookings"
            className={cn(
              "transition-colors hover:text-primary text-sm font-medium px-3 py-2 rounded-md",
              pathname === "/auto-bookings" ? "text-primary bg-primary/10" : "text-foreground/60",
            )}
          >
            自动预约
          </Link>
          <Link
            href="/settings"
            className={cn(
              "transition-colors hover:text-primary text-sm font-medium px-3 py-2 rounded-md",
              pathname === "/settings" ? "text-primary bg-primary/10" : "text-foreground/60",
            )}
          >
            设置
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
