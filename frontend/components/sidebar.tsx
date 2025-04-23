"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Users, Clock, Settings, Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="mb-6 hidden md:flex items-center px-2">
            <Activity className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold tracking-tight">南医大体育馆</h2>
          </div>
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">主菜单</h2>
          <div className="space-y-1">
            <Button asChild variant={pathname === "/" ? "default" : "ghost"} size="sm" className="w-full justify-start">
              <Link href="/">
                <CalendarDays className="mr-2 h-4 w-4" />
                场馆预约
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/accounts" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              <Link href="/accounts">
                <Users className="mr-2 h-4 w-4" />
                账号管理
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/auto-bookings" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              <Link href="/auto-bookings">
                <Clock className="mr-2 h-4 w-4" />
                自动预约
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname === "/settings" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
            >
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                设置
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">帮助</h2>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              使用帮助
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" />
              </svg>
              预约规则
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
