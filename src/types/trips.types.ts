export interface TripRegister {
  id: number;
  vehicle_tag: string;
  concept: string | null;
  amount: number | null;
  date: string;
  payment_date: string | null;
  driver: string;
  user: string;
  status: string;
}
