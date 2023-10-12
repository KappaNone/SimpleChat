export interface createRoomRequest {
  userName: string
  roomVisibility: boolean
}

export interface createRoomResponse {
  userName: string
  roomKey: string
}

export interface joinRoomRequest {
  roomKey: string
  userName: string
}

export interface joinRoomResponse {
  roomUsers: string[]
  roomKey: string
  joinedUser: string
}

export interface leaveRoomRequest {
  userName: string
  roomUsers: string[]
  roomKey: string
}

export interface leaveRoomResponse {
  userName: string
  roomUsers: string[]
  roomKey: string
}

export interface room {
  key: string
  users: string[]
  visibility: boolean
}

export interface message {
  roomKey: string
  text: string
  sender: string
  time: string
}

export interface error {
  message: string
  target: string
}
