export type Candy = {
  id: string
  name: string
  price: number
  description: string
  ingredients: string[]
  imageDataUrl: string | null
  createdAt: string
  updatedAt: string
}

export type CandyPayload = Omit<Candy, 'id' | 'createdAt' | 'updatedAt'>
