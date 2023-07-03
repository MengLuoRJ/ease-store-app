export type Merchandise = {
  id: number
  name: string
  barcode: string
  price: number
  picture_url?: string
  specs: string
  category: string
  shilf_life: number
  tags?: string[]
  quick_tags?: string[]
}

export type MerchandiseEntry = Pick<
  Merchandise,
  | 'name'
  | 'barcode'
  | 'price'
  | 'picture_url'
  | 'specs'
  | 'category'
  | 'shilf_life'
  | 'tags'
  | 'quick_tags'
>

export type MerchandiseItem = Merchandise & { price_settlement?: number; count: number }

export type OrderStatus = 'created' | 'credit' | 'paid' | 'closed'

export type Order = {
  id: number
  code: string
  user_uuid: string
  amount: number
  payment_method: string
  credit_person: string
  status: OrderStatus
  start_at: string
  close_at: string
}

export type OrderItem = {
  id: number
  order_id: number
  merchandise_id: number
  merchandise?: Merchandise
  price: number
  price_settlement?: number
  count: number
}
