export class Subscription {
  id: number;
  transaction_no: string;
  customer_id: number;
  customer_type: number;
  total_amount: number;
  registration_date: string;
  expiration_date: string;
  subscriber_rate_option: string;
  excess_rate_option: string;
  allowance_minute: string;
  fixedrate: number;
  status: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  editForm: boolean;
  editFormId: number;
}