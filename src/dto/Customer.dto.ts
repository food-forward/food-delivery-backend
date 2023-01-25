export interface CreateCustomerInput {
  email: string;
  phone: string;
  password: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export interface customerVerifyInput {
  otp: number;
}

export interface CartItems {
  _id: string;
  unit: number;
}

export interface OrderInputs {
  txnId: string;
  amount: string;
  items: CartItems[];
}
