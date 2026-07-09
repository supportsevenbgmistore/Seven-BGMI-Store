export type PaymentIntentInput = {
  accountId: string;
  amount: number;
  buyerEmail?: string;
  buyerPhone?: string;
};

export type PaymentIntent = {
  provider: string;
  referenceId: string;
  amount: number;
  status: "created" | "pending" | "paid" | "failed";
  checkoutUrl?: string;
};

export interface PaymentProvider {
  name: "razorpay" | "cashfree" | "phonepe" | "stripe";
  createIntent(input: PaymentIntentInput): Promise<PaymentIntent>;
  verifyWebhook(payload: unknown, signature: string): Promise<boolean>;
}

export class PaymentNotConfiguredProvider implements PaymentProvider {
  name: PaymentProvider["name"];

  constructor(name: PaymentProvider["name"]) {
    this.name = name;
  }

  async createIntent(): Promise<PaymentIntent> {
    throw new Error(`${this.name} is not configured yet.`);
  }

  async verifyWebhook(): Promise<boolean> {
    return false;
  }
}
