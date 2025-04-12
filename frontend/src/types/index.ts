import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { BillingDetails } from '@stripe/stripe-js';


export interface ListItemProps {
    title: string;
    href: string;
    description: string;
}
  
export interface ListItemGroupProps {
    title: string;
    items: ListItemProps[];
}

export interface IconProps {
  icon: IconDefinition
  label: string
  id: string,
  tab: string
}

export interface IconPropsGroup {
  title: string
  items: IconProps[]
}

export interface SubscriptionDataProps {
  type: "Free" | "Clipper" | "Creator" | "Business";
  rate: string;
  status: string;
  endDate: string;
  default_payment: DefaultPayment;
}

export interface DefaultPayment {
  type: string;
  formatted_type: string;
  billing: BillingDetails;
  // One of these two depending on the method type
  brand?: string;
  last4: string;
  card_type?: string;
  exp_date?: string;
  bank_name?: string;
  account_type?: string;
  account_holder_type?: string;
  routing_number?: string;
}