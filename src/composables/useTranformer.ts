import type { OrderStatus } from '@/types'

export function transformOrderStatus(status: OrderStatus) {
  switch (status) {
    case 'created':
      return '已创建'
    case 'credit':
      return '已赊账'
    case 'paid':
      return '已支付'
    case 'closed':
      return '已关闭'
    default:
      return '未知状态'
  }
}
