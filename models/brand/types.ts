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
  createdAt?: Date; // Make optional since Sequelize handles it
  updatedAt?: Date; // Make optional since Sequelize handles it
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