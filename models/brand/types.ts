export interface BrandAttributes {
  id: number;
  name: string;
  description: string;
  logo: string;
  status: number;
  country: string;
  phoneNumber: string;
  company: string;
  products: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandCreationAttributes {
  name: string;
  description?: string;
  logo?: string;
  status?: number;
  country?: string;
  phoneNumber?: string;
  company?: string;
  products?: number;
}