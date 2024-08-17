export interface FoodModel {
  id: number;
  name: string;
  description: string;
  category: string;
  area: string;
  price: number;
  image?: {
    id: number;
    url: string;
  };
  ingredients: {
    id: number
    name: string
  }[];
  createdAt: string;
  updatedAt: string;
}
