import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';


export const userNameAtom = atomWithStorage('username', '')
export const createdRoomKeyAtom = atom('')
export const joinRoomId = atom('')
export const usersInRoomAtom = atom([])