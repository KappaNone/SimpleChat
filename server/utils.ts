import { room } from './types'	

export const generateRoomKey = (): string => {
  const keyLength = 6
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < keyLength; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return key
}

export const removeEmptyRooms = (rooms: room[], lastUserInRoom: string): void => {
  for (let i = rooms.length - 1; i >= 0; i--) {
    if (rooms[i].users.length === 0) {
      console.log(`Room ${rooms[i].key} has been removed by ${lastUserInRoom}`)
      rooms.splice(i, 1)
    }
  }
}

export const findRoomByKey = (rooms: room[], roomKey: string): number => {
  return rooms.findIndex((room) => room.key === roomKey)
}