export type createRoomRequest = {
  userName: string
  roomVisibility: boolean
}

export type createRoomResponse = {
  userName: string
  roomKey: string
}

export type joinRoomRequest = {
  roomKey: string
  userName: string
}

export type joinRoomResponse = {
  roomUsers: string[]
  roomKey: string
  joinedUser: string
}

export type leaveRoomRequest = {
  userName: string
  roomUsers: string[]
  roomKey: string
}

export type leaveRoomResponse = {
  userName: string
  roomUsers: string[]
  roomKey: string
}

export type room = {
  key: string
  users: string[]
  visibility: boolean
}

export type message = {
  roomKey: string
  text: string
  sender: string
  time: string
}

export type error = {
  message: string
  target: string
}
