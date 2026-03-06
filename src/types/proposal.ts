export type ProposalItem = {
  candyId: string
  candyName: string
  unitPrice: number
  quantity: number
  description: string
  ingredients: string[]
  imageDataUrl: string | null
}

export type Proposal = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  items: ProposalItem[]
  total: number
}
