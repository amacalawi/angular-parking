export class SubscriptionRate {
    id: number;
    customer_type: string;
    starting_period: string;
    ending_period: string;
    subscription_rate: number;
    excess_rate_per_minute: number;
    excess_rate_per_hour: number;
    created_at: string;
    updated_at: string;
    is_active: boolean
}