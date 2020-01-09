export class Transaction {
  id: number;
  rfid_no: string;
  transaction_no: string;
  customer_id: number;
  customer_name: string;
  customer_type: string;
  type: number;
  credits: any;
  color: string;
  created_at: string;
  fixed_rate: any;
  vehicle_name: string;
  vehicle_rate: number;
  vehicle_id: number;
  plate_no: string;
  model: string;
  transaction_type_id: number;
  payment_type_id: number;
  timed_valid: string;
  timed_in: any;
  timed_allowance: any;
  total_time: any;
  total_amount: number;
  excess_option: string;
  excess_amount_multiplier: any;
}