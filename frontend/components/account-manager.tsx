"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash, Check, Plus, UserCircle, Key, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Skeleton } from "@/components/ui/skeleton"
import { accountsApi } from "@/lib/api"

interface Account {
  id: string
  username: string
  password?: string
  remark: string
  isDefault: boolean
}

const formSchema = z.object({
  username: z.string().min(1, "学号/工号不能为空"),
  password: z.string().min(1, "密码不能为空"),
  remark: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remark: "",
      isDefault: false,
    },
  })

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const data = await accountsApi.getAccounts()
      setAccounts(data)
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

  useEffect(() => {
    fetchAccounts()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingAccount) {
        // 更新账号
        await accountsApi.updateAccount(editingAccount.id, {
          password: values.password,
          remark: values.remark,
          isDefault: values.isDefault,
        })

        toast({
          title: "更新成功",
          description: "账号信息已更新",
        })
      } else {
        // 添加新账号
        await accountsApi.createAccount({
          username: values.username,
          password: values.password,
          remark: values.remark,
          isDefault: values.isDefault,
        })

        toast({
          title: "添加成功",
          description: "新账号已添加",
        })
      }

      // 重置表单并刷新账号列表
      form.reset()
      setEditingAccount(null)
      setIsDialogOpen(false)
      fetchAccounts()
    } catch (error) {
      console.error("Failed to save account", error)
      toast({
        title: "操作失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    form.reset({
      username: account.username,
      password: "",  // 不显示密码
      remark: account.remark,
      isDefault: account.isDefault,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (account: Account) => {
    setAccountToDelete(account)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!accountToDelete) return

    try {
      await accountsApi.deleteAccount(accountToDelete.id)

      toast({
        title: "删除成功",
        description: "账号已删除",
      })

      setDeleteDialogOpen(false)
      fetchAccounts()
    } catch (error) {
      console.error("Failed to delete account", error)
      toast({
        title: "删除失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (account: Account) => {
    try {
      await accountsApi.updateAccount(account.id, { isDefault: true })

      toast({
        title: "设置成功",
        description: "默认账号已更新",
      })

      fetchAccounts()
    } catch (error) {
      console.error("Failed to set default account", error)
      toast({
        title: "设置失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="space-y-6 animate-fadeIn">
        <Card>
          <CardHeader>
            <CardTitle>账号管理</CardTitle>
            <CardDescription>管理您的预约账号信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                form.reset({
                  username: "",
                  password: "",
                  remark: "",
                  isDefault: false,
                })
                setEditingAccount(null)
                setIsDialogOpen(true)
              }}
              className="mb-6"
            >
              <Plus className="mr-2 h-4 w-4" /> 添加账号
            </Button>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </div>
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <UserCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">暂无账号</h3>
                <p className="text-muted-foreground mt-1">点击"添加账号"按钮创建您的第一个账号</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {accounts.map((account) => (
                  <Card key={account.id} className="hover-card">
                    <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <UserCircle className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="font-medium">{account.username}</h3>
                          {account.isDefault && <Badge className="ml-2">默认</Badge>}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Key className="h-4 w-4 mr-2" />
                          <span>••••••••</span>
                        </div>
                        {account.remark && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>{account.remark}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(account)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">编辑</span>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(account)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-2">删除</span>
                        </Button>
                        {!account.isDefault && (
                          <Button size="sm" variant="outline" onClick={() => handleSetDefault(account)}>
                            <Check className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">设为默认</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAccount ? "编辑账号" : "添加账号"}</DialogTitle>
            <DialogDescription>{editingAccount ? "修改账号信息" : "添加新的预约账号"}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学号/工号</FormLabel>
                    <FormControl>
                      <Input placeholder="请输入学号或工号" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="请输入密码" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Input placeholder="可选，如：个人账号" {...field} />
                    </FormControl>
                    <FormDescription>添加备注以便于区分不同账号</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>设为默认账号</FormLabel>
                      <FormDescription>默认账号将优先用于预约操作</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除账号 {accountToDelete?.username} 吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
