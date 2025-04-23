"use client"
import { Bell, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  darkMode: z.boolean().default(false),
  notifications: z.boolean().default(true),
  autoLogin: z.boolean().default(false),
})

export function SettingsForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      darkMode: false,
      notifications: true,
      autoLogin: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "设置已保存",
      description: "您的偏好设置已更新",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>系统设置</CardTitle>
        <CardDescription>管理您的应用偏好设置</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center">
                      <Moon className="mr-2 h-4 w-4" />
                      深色模式
                    </FormLabel>
                    <FormDescription>启用深色模式以减少眼睛疲劳</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      通知提醒
                    </FormLabel>
                    <FormDescription>接收预约成功和失败的通知</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="autoLogin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">自动登录</FormLabel>
                    <FormDescription>下次访问时自动使用默认账号登录</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">保存设置</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
