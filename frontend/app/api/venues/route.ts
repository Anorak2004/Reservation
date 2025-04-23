import { NextResponse } from "next/server"

// 模拟场馆数据
const venues = [
  {
    id: "1",
    sname: "羽毛球馆1号场",
    serviceid: "1",
    time_no: "08:00-10:00",
    status: "available",
    date: "2023-05-20",
  },
  {
    id: "2",
    sname: "羽毛球馆2号场",
    serviceid: "1",
    time_no: "10:00-12:00",
    status: "available",
    date: "2023-05-20",
  },
  {
    id: "3",
    sname: "篮球馆1号场",
    serviceid: "2",
    time_no: "14:00-16:00",
    status: "available",
    date: "2023-05-20",
  },
  {
    id: "4",
    sname: "篮球馆2号场",
    serviceid: "2",
    time_no: "16:00-18:00",
    status: "booked",
    date: "2023-05-20",
  },
  {
    id: "5",
    sname: "羽毛球馆1号场",
    serviceid: "1",
    time_no: "08:00-10:00",
    status: "available",
    date: "2023-05-21",
  },
  {
    id: "6",
    sname: "羽毛球馆2号场",
    serviceid: "1",
    time_no: "10:00-12:00",
    status: "available",
    date: "2023-05-21",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serviceid = searchParams.get("serviceid")
  const date = searchParams.get("date")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

  let filteredVenues = [...venues]

  if (serviceid) {
    filteredVenues = filteredVenues.filter((venue) => venue.serviceid === serviceid)
  }

  if (date) {
    filteredVenues = filteredVenues.filter((venue) => venue.date === date)
  }

  const start = (page - 1) * pageSize
  const paginatedVenues = filteredVenues.slice(start, start + pageSize)

  return NextResponse.json({
    data: paginatedVenues,
    total: filteredVenues.length,
    page,
    pageSize,
  })
}
