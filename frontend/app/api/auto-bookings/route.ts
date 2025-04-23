import { NextResponse } from "next/server"

// 模拟自动预约数据
const autoBookings = [
  {
    id: "1",
    venue_id: "1",
    account_id: "1",
    booking_date: "2023-05-21",
    time_no: "08:00-10:00",
    status: "pending",
    created_at: "2023-05-19T10:00:00Z",
  },
  {
    id: "2",
    venue_id: "3",
    account_id: "2",
    booking_date: "2023-05-21",
    time_no: "14:00-16:00",
    status: "completed",
    created_at: "2023-05-19T11:00:00Z",
  },
]

export async function GET() {
  return NextResponse.json(autoBookings)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newBooking = {
    id: Date.now().toString(),
    venue_id: body.venue_id,
    account_id: body.account_id,
    booking_date: body.booking_date,
    time_no: body.time_no,
    status: "pending",
    created_at: new Date().toISOString(),
  }

  autoBookings.push(newBooking)

  return NextResponse.json(newBooking)
}
