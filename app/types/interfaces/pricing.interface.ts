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

export interface ITrxStatus {
  plan_id: number;
  amount: number;
  status: TrxStatus;
}

export enum TrxStatus {
  VERIFIED = "VERIFIED",
  UNVERIFIED = "UNVERIFIED",
}

export enum SubscriptionType {
  BASIC = "basic",
  STARTER = "starter",
  PROFESSIONAL = "professional",
  ENTERPRISE = "enterprise",
  
}
