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

export interface ProjectProps {
  status: "PROCESSING" | "SUCCESS" | "FAILED",
  taskId?: string,
  thumbnail: string,
  title: string,
  identifier: string,
  createdAt: string
}
export interface InvoiceDataProps {
  date: string,
  amount: number,
  number: string,
  pdf_link: string,
  status: "draft" | "paid" | "open" | "uncollectible" | "void"
}

export interface SocialMediaCardProps {
  name: string,
  type: string,
  description?: string,
  icon: IconDefinition
}

export interface PlatformDataProps {
  email: string,
  name: string,
  provider: string,
  scope: "YouTube" | "TikTok" | "Facebook" | "Instagram",
  details: string
  id: string
}