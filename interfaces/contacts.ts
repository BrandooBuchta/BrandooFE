export interface Contact {
  id: string;
  formId: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  companyName?: string;
  job?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  prefferedContactMethod?: string;
  prefferedContactTime?: string;
  secondaryEmail?: string;
  secondaryPhone?: string;
  referralSource?: string;
  notes?: string;
  email?: string;
  phone?: string;
  address?: string;
  initialMessage?: string;
  aggreedToPrivacyPolicy: boolean;
  aggreedToNewsLetter: boolean;
  hasReadInitialMessage: boolean;
  updatedAt: string;
  createdAt: string;
  labels: string[];
  description: string;
  [key: string]: any;
}

export interface Label {
  id: string;
  userId: string;
  updatedAt: string;
  createdAt: string;
  title: string;
  color: string;
}

export interface Form {
  id: string;
  userId: string;
  name: string;
  description: string;
  formProperties: string[];
  updatedAt: string;
  createdAt: string;
}
