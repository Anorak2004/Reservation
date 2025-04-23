"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Clock, Calendar, User, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { accountsApi, autoBookingsApi } from "@/lib/api"

interface Account {
  id: string
  username: string
  remark: string
  isDefault: boolean
}

interface Venue {
  id: string
  sname: string
  serviceid: string
  time_no: string
  status: string
  date: string
}

interface AutoBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  venue: Venue | null
  onConfirm: () => void
}

export function AutoBookingDialog({ open, onOpenChange, venue, onConfirm }: AutoBookingDialogProps) {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchAccounts()
    }
  }, [open])

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const data = await accountsApi.getAccounts()
      setAccounts(data)

      // 如果有默认账号，则自动选择
      const defaultAccount = data.find((account: Account) => account.isDefault)
      if (defaultAccount) {
        setSelectedAccountId(defaultAccount.id)
      } else if (data.length > 0) {
        setSelectedAccountId(data[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch accounts", error)
      toast({
        title: "获取账号失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!venue || !selectedAccountId) {
      toast({
        title: "请选择账号",
        description: "请先选择用于预约的账号",
        variant: "destructive",
      })
      return
    }

    try {
      await autoBookingsApi.createAutoBooking({
        venue_id: venue.id,
        account_id: selectedAccountId,
        booking_date: venue.date,
        time_no: venue.time_no,
        users: "" // 实际使用中应该让用户填写使用者学号
      })

      onConfirm()
    } catch (error) {
      console.error("Failed to create auto booking", error)
      toast({
        title: "设置失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 计算预约时间（场次前一天的8:00:05）
  const getBookingTime = () => {
    if (!venue) return ""

    const bookingDate = new Date(venue.date)
    bookingDate.setDate(bookingDate.getDate() - 1)
    bookingDate.setHours(8, 0, 5)

    return format(bookingDate, "yyyy年MM月dd日 HH:mm:ss", { locale: zhCN })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>设置自动预约</DialogTitle>
          <DialogDescription>系统将在指定时间自动为您预约场馆</DialogDescription>
        </DialogHeader>

        {venue && (
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">预约日期</div>
                  <div className="text-sm">{venue.date}</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">时间段</div>
                  <div className="text-sm">{venue.time_no}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    <path d="M9 2v7" />
                    <path d="M15 2v7" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">场馆</div>
                  <div className="text-sm">{venue.sname}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                选择账号
              </div>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择账号" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.length === 0 ? (
                      <SelectItem value="none" disabled>
                        暂无账号，请先添加账号
                      </SelectItem>
                    ) : (
                      accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.remark || account.username}
                          {account.isDefault && " (默认)"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Alert
              variant="default"
              className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                系统将在 <span className="font-semibold">{getBookingTime()}</span> 自动发送预约请求
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedAccountId || accounts.length === 0}>
            确认预约
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
