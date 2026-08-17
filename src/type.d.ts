interface StoreTask {
  id: string,
  gameId: string,
  label: string,
  resetTime: string,
  resetTimeStatus: {
    time: number,
    week?: string,
    day?: number
  },
  priority: string
}

interface StoreGame {
  id: string,
  title: string
}