export interface Property {
  id: string;
  agentId: string; // To associate property with a mock agent
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  status: 'active' | 'pending' | 'sold';
  imageUrl?: string; // Optional image URL
  dateListed: string;
  sqft?: number; // Optional
  propertyType?: string; // Optional
  agent?: {
    name: string;
    email: string;
  };
}

export interface Inquiry {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  dateSubmitted: string;
}

export interface InquiryWithProperty extends Inquiry {
  property: Property;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}
