export interface VehicleChartData {
    monthlyData: MonthData[]
    recentRecords: RecentRecord[]
  }
  
  export interface MonthData {
    month: string
    total_gallons: number
    total_kilometers: number
  }
  
  export interface RecentRecord {
    id: number
    vehicle_id: number
    driver: string
    mileage: number
    gallons: number
    record_date: string
    comment: string | null | undefined
  }