export interface IPricing {
  id: number;
  name: string;
  subscription_type: SubscriptionType;
  price_toman: number;
  max_products: number;
  duration_days: number;
  ai_usage_limit: number;
  description: string;
}

export enum SubscriptionType {
  BASIC = "basic",
}
