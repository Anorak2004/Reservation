"use client"

import { CardFooter } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Trash, AlertCircle, Clock, Calendar, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { autoBookingsApi } from "@/lib/api"

interface AutoBooking {
  id: string
  venue_id: string
  account_id: string
  booking_date: string
  time_no: string
  status: string
  created_at: string
  venue?: {
    sname: string
  }
  account?: {
    username: string
    remark: string
  }
  scheduled_time?: string
  executed_at?: string
  result?: any
}

export function AutoBookingList() {
  const [bookings, setBookings] = useState<AutoBooking[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<AutoBooking | null>(null)
  const [viewType, setViewType] = useState("grid")
  const { toast } = useToast()

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const data = await autoBookingsApi.getAutoBookings()
      setBookings(data)
    } catch (error) {
      console.error("Failed to fetch bookings", error)
      toast({
        title: "获取预约任务失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleDelete = (booking: AutoBooking) => {
    setBookingToDelete(booking)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!bookingToDelete) return

    try {
      await autoBookingsApi.cancelAutoBooking(bookingToDelete.id)

      toast({
        title: "取消成功",
        description: "自动预约任务已取消",
      })

      setDeleteDialogOpen(false)
      fetchBookings()
    } catch (error) {
      console.error("Failed to delete booking", error)
      toast({
        title: "取消失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 获取预约执行时间（场次前一天的8:00:05）
  const getBookingExecutionTime = (date: string) => {
    const bookingDate = new Date(date)
    bookingDate.setDate(bookingDate.getDate() - 1)
    bookingDate.setHours(8, 0, 5)

    return format(bookingDate, "yyyy-MM-dd HH:mm:ss")
  }

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"
        >
          等待执行
        </Badge>
      )
    } else if (status === "completed") {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
        >
          预约成功
        </Badge>
      )
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
        >
          预约失败
        </Badge>
      )
    }
  }

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>自动预约任务</CardTitle>
                <CardDescription>查看和管理您的自动预约任务</CardDescription>
              </div>
              <Tabs defaultValue="grid" className="w-full md:w-auto" onValueChange={setViewType}>
                <TabsList className="grid w-full md:w-auto grid-cols-2">
                  <TabsTrigger value="grid">卡片视图</TabsTrigger>
                  <TabsTrigger value="list">列表视图</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>自动预约说明</AlertTitle>
              <AlertDescription>
                系统将在场次前一天的上午8:00:05自动为您发送预约请求。请确保账号信息正确且有效。
              </AlertDescription>
            </Alert>

            <Tabs value={viewType} className="w-full">
              <TabsContent value="grid" className="mt-0">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="rounded-lg border p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-9 w-9" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">暂无自动预约任务</h3>
                    <p className="text-muted-foreground mt-1">您还没有设置任何自动预约任务</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="hover-card overflow-hidden">
                        <div
                          className={`h-2 w-full ${
                            booking.status === "pending"
                              ? "bg-yellow-500"
                              : booking.status === "completed"
                                ? "bg-green-500"
                                : "bg-red-500"
                          }`}
                        />
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{booking.venue?.sname}</CardTitle>
                          <CardDescription className="flex items-center justify-between">
                            <span>{booking.booking_date}</span>
                            {getStatusBadge(booking.status)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.time_no}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{booking.account?.remark || booking.account?.username}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>执行时间: {getBookingExecutionTime(booking.booking_date)}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          {booking.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => handleDelete(booking)}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              取消预约
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>场馆</TableHead>
                        <TableHead>日期</TableHead>
                        <TableHead>时间段</TableHead>
                        <TableHead>使用账号</TableHead>
                        <TableHead>执行时间</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        [...Array(3)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-16" />
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-9 w-24 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : bookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            暂无自动预约任务
                          </TableCell>
                        </TableRow>
                      ) : (
                        bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.venue?.sname}</TableCell>
                            <TableCell>{booking.booking_date}</TableCell>
                            <TableCell>{booking.time_no}</TableCell>
                            <TableCell>{booking.account?.remark || booking.account?.username}</TableCell>
                            <TableCell>{getBookingExecutionTime(booking.booking_date)}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell className="text-right">
                              {booking.status === "pending" && (
                                <Button size="sm" variant="outline" onClick={() => handleDelete(booking)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认取消</DialogTitle>
            <DialogDescription>您确定要取消此自动预约任务吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              返回
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              取消预约
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
