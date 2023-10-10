import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const userNameAtom = atomWithStorage('username', '')
export const roomKeyAtom = atom('')
export const usersInRoomAtom = atom<string[]>([])
export const errorText = atom('')
