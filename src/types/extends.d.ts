import { Discount, GiftCard } from "@medusajs/medusa"

declare module "@medusajs/medusa" {
  export interface CustomerReferral {
    id: string
    customer_id: string
    template_discount: Discount
    template_discount_id: string
    reward_amount: number
    created_at: Date
    updated_at: Date
  }

  export interface CustomerReferralRedemption {
    id: string
    referrer_customer_id: string
    referred_customer_id: string
    referred_customer: Customer
    discount: Discount
    gift_card?: GiftCard
    rewarded: boolean
    created_at: Date
    updated_at: Date
    rewarded_at?: Date
  }

  export interface Customer {
    referral?: CustomerReferral
    referred_redemptions?: CustomerReferralRedemption[]
  }
}
