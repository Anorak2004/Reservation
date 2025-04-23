import { NextResponse } from "next/server"

// 引用模拟自动预约数据
let autoBookings = [
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  const bookingIndex = autoBookings.findIndex((booking) => booking.id === id)

  if (bookingIndex === -1) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 })
  }

  autoBookings = autoBookings.filter((booking) => booking.id !== id)

  return NextResponse.json({ success: true })
}
