"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CalendarIcon, Filter, Clock, MapPin } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AutoBookingDialog } from "@/components/auto-booking-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { venuesApi, preBookApi } from "@/lib/api"

interface Venue {
  id: string
  sname: string
  serviceid: string
  time_no: string
  status: string
  date: string
}

export function VenueList() {
  const [date, setDate] = useState<Date>(new Date())
  const [serviceId, setServiceId] = useState<string>("all")
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [autoBookingDialogOpen, setAutoBookingDialogOpen] = useState(false)
  const [viewType, setViewType] = useState("grid")
  const { toast } = useToast()

  const fetchVenues = async () => {
    setLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const params: any = {
        date: formattedDate,
      }
      
      if (serviceId && serviceId !== "all") {
        params.serviceid = serviceId
      } else {
        // 如果没有选择特定场馆类型，提供默认值
        params.serviceid = "22" // 默认使用羽毛球馆ID
      }

      // 移除分页参数，因为后端API可能不支持
      // params.page = page.toString()
      // params.pageSize = "10"
      
      console.log("请求参数:", params);
      const result = await venuesApi.getVenues(params)
      console.log("API响应:", result);
      
      // 如果需要手动处理分页
      const allVenues = result || [];
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      setVenues(Array.isArray(allVenues) ? allVenues.slice(startIndex, endIndex) : []);
      setTotal(Array.isArray(allVenues) ? allVenues.length : 0);
    } catch (error) {
      console.error("获取场馆失败", error);
      if (axios.isAxiosError(error)) {
        console.error("API错误详情:", error.response?.data);
        toast({
          title: "获取场馆失败",
          description: error.response?.data?.message || "请稍后重试",
          variant: "destructive",
        });
      } else {
        toast({
          title: "获取场馆失败",
          description: "请稍后重试",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVenues()
  }, [date, serviceId, page])

  const handleBookNow = async (venue: Venue) => {
    try {
      // 这里需要用户选择一个账号，简化处理，假设已有默认账号
      await preBookApi.preBookWithAccount({
        stockid: venue.id, // 假设venue.id就是stockid
        serviceid: venue.serviceid,
        venue_id: venue.id,
        users: "", // 这里需要用户填写使用者学号
        account_id: "1" // 默认账号ID，实际应用中应该让用户选择或使用默认账号
      });
      
      toast({
        title: "预约成功",
        description: `已成功预约 ${venue.sname} ${venue.time_no}`,
      });
    } catch (error) {
      console.error("预约失败", error);
      toast({
        title: "预约失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  }

  const handleSetAutoBooking = (venue: Venue) => {
    setSelectedVenue(venue)
    setAutoBookingDialogOpen(true)
  }

  const handleConfirmAutoBooking = () => {
    if (selectedVenue) {
      toast({
        title: "自动预约设置成功",
        description: `已设置 ${selectedVenue.sname} ${selectedVenue.time_no} 的自动预约`,
      })
    }
    setAutoBookingDialogOpen(false)
  }

  // 获取场馆类型名称
  const getVenueTypeName = (serviceId: string) => {
    switch (serviceId) {
      case "22":
        return "羽毛球馆"
      case "42":
        return "乒乓球馆"
      default:
        return "其他场馆"
    }
  }

  // 判断场馆是否可预约
  const isVenueAvailable = (venue: Venue) => {
    // 根据后端API返回，可能状态是数字1表示可用
    if (venue.status === "available" || venue.status === "1" || venue.status === 1) {
      return true;
    }
    return false;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>场馆预约</CardTitle>
              <CardDescription>查看并预约可用场馆</CardDescription>
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
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-muted/50 p-4 rounded-lg">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">选择日期</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: zhCN }) : <span>选择日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">场馆类型</label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="场馆类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="22">羽毛球馆</SelectItem>
                  <SelectItem value="42">乒乓球馆</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={viewType} className="w-full">
            <TabsContent value="grid" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="flex justify-between mt-4">
                        <Skeleton className="h-9 w-24" />
                        <Skeleton className="h-9 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : venues.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Filter className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">暂无可预约场馆</h3>
                  <p className="text-muted-foreground mt-1">请尝试更改日期或场馆类型</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {venues.map((venue) => (
                    <Card key={venue.id} className="hover-card overflow-hidden">
                      <div className={cn("h-2 w-full", isVenueAvailable(venue) ? "bg-green-500" : "bg-red-500")} />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-start justify-between">
                          <span>{venue.sname}</span>
                          {isVenueAvailable(venue) ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                            >
                              可预约
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                            >
                              已预约
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{getVenueTypeName(venue.serviceid)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>南京医科大学体育中心</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{venue.time_no}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 pt-0">
                        <Button
                          className="flex-1"
                          onClick={() => handleBookNow(venue)}
                          disabled={!isVenueAvailable(venue)}
                        >
                          立即预约
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleSetAutoBooking(venue)}
                          disabled={!isVenueAvailable(venue)}
                        >
                          自动预约
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">场馆名称</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">类型</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">时间段</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">状态</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4">
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-5 w-20" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-5 w-24" />
                          </td>
                          <td className="p-4">
                            <Skeleton className="h-5 w-16" />
                          </td>
                          <td className="p-4 text-right">
                            <Skeleton className="h-9 w-32 ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : venues.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      venues.map((venue) => (
                        <tr key={venue.id} className="border-b">
                          <td className="p-4 font-medium">{venue.sname}</td>
                          <td className="p-4 text-muted-foreground">{getVenueTypeName(venue.serviceid)}</td>
                          <td className="p-4">{venue.time_no}</td>
                          <td className="p-4">
                            {isVenueAvailable(venue) ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                              >
                                可预约
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                              >
                                已预约
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleBookNow(venue)}
                                disabled={!isVenueAvailable(venue)}
                              >
                                立即预约
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSetAutoBooking(venue)}
                                disabled={!isVenueAvailable(venue)}
                              >
                                自动预约
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          {total > 0 && (
            <div className="flex items-center justify-between space-x-2 py-4 mt-4">
              <div className="text-sm text-muted-foreground">
                共 {total} 个场次，第 {page} 页，共 {Math.ceil(total / 10)} 页
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 10)}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AutoBookingDialog
        open={autoBookingDialogOpen}
        onOpenChange={setAutoBookingDialogOpen}
        venue={selectedVenue}
        onConfirm={handleConfirmAutoBooking}
      />
    </div>
  )
}
