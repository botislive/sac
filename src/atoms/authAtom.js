import { atom } from 'jotai'

// Initialize from localStorage if available, otherwise false
const initialAuth = localStorage.getItem('isAuthenticated') === 'true'

export const authAtom = atom(initialAuth)

// A derived atom that updates localStorage whenever it's set
export const authAtomWithStorage = atom(
  (get) => get(authAtom),
  (_get, set, newValue) => {
    set(authAtom, newValue)
    localStorage.setItem('isAuthenticated', String(newValue))
  }
)
