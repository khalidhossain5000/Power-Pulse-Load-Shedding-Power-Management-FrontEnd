export interface IQueryParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}




export type FooterLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type StatItem = {
  value: string;
  label: string;
};

export type FooterProps = {
  brandName?: string;
  description?: string;
  quickLinks?: FooterLink[];
  resourceLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  stats?: StatItem[];
  copyrightText?: string;
};


export interface IPaymentCustomer {
  id: string;
  name: string;
  email: string;
}

export interface IPaymentOutage {
  id: string;
  cause: string;
  priority: "NORMAL" | "HIGH";
  status: string;
}

export interface IPaymentRecord {
  id: string;
  amount: string;
  provider: string;
  transactionId: string;
  status: "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED";
  paidAt: string | null;
  createdAt: string;
  customer: IPaymentCustomer;
  outage: IPaymentOutage;
  outageReportId?:string;
}
