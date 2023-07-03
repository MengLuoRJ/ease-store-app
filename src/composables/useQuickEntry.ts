export const useQuickEntryShilfLife = (): { text: string; value: number }[] => [
  {
    text: '15天',
    value: 15
  },
  {
    text: '30天',
    value: 30
  },
  {
    text: '1个月',
    value: 30
  },
  {
    text: '2个月',
    value: 60
  },
  {
    text: '3个月（90天）',
    value: 90
  },
  {
    text: '6个月（180天）',
    value: 180
  },
  {
    text: '1年（365天）',
    value: 365
  },
  {
    text: '18个月（540天）',
    value: 540
  }
]

export const useQuickEntrySpecs = (): { text: string; value: string }[] => [
  {
    text: '500mL/瓶',
    value: '500mL/瓶'
  },
  {
    text: '1L/瓶',
    value: '1L/瓶'
  }
]

export const useQuickEntryCategory = (): { text: string; value: string }[] => [
  {
    text: '奶茶饮料',
    value: '奶茶饮料'
  }
]
