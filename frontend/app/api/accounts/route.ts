import { NextResponse } from "next/server"

// 模拟账号数据
let accounts = [
  {
    id: "1",
    username: "20210101",
    password: "password123",
    remark: "个人账号",
    isDefault: true,
  },
  {
    id: "2",
    username: "20210102",
    password: "password456",
    remark: "朋友账号",
    isDefault: false,
  },
]

export async function GET() {
  return NextResponse.json(accounts)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newAccount = {
    id: Date.now().toString(),
    username: body.username,
    password: body.password,
    remark: body.remark || "",
    isDefault: body.isDefault || false,
  }

  if (newAccount.isDefault) {
    // 如果新账号设为默认，则取消其他账号的默认状态
    accounts = accounts.map((account) => ({
      ...account,
      isDefault: false,
    }))
  }

  accounts.push(newAccount)

  return NextResponse.json(newAccount)
}
