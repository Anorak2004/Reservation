import { NextResponse } from "next/server"

// 引用模拟账号数据
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await request.json()

  const accountIndex = accounts.findIndex((account) => account.id === id)

  if (accountIndex === -1) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  if (body.isDefault) {
    // 如果账号设为默认，则取消其他账号的默认状态
    accounts = accounts.map((account) => ({
      ...account,
      isDefault: false,
    }))
  }

  const updatedAccount = {
    ...accounts[accountIndex],
    username: body.username || accounts[accountIndex].username,
    password: body.password || accounts[accountIndex].password,
    remark: body.remark !== undefined ? body.remark : accounts[accountIndex].remark,
    isDefault: body.isDefault !== undefined ? body.isDefault : accounts[accountIndex].isDefault,
  }

  accounts[accountIndex] = updatedAccount

  return NextResponse.json(updatedAccount)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const accountIndex = accounts.findIndex((account) => account.id === id)

  if (accountIndex === -1) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 })
  }

  const deletedAccount = accounts[accountIndex]
  accounts = accounts.filter((account) => account.id !== id)

  // 如果删除的是默认账号，则将第一个账号设为默认（如果有的话）
  if (deletedAccount.isDefault && accounts.length > 0) {
    accounts[0].isDefault = true
  }

  return NextResponse.json({ success: true })
}
