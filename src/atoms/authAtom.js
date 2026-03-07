import { atom } from 'jotai'


const initialAuth = localStorage.getItem('isAuthenticated') === 'true'

export const authAtom = atom(initialAuth)


export const authAtomWithStorage = atom(
  (get) => get(authAtom),
  (_get, set, newValue) => {
    set(authAtom, newValue)
    localStorage.setItem('isAuthenticated', String(newValue))
  }
)
