import { User, PfSession, SxwySession } from '../types'

export interface UserState {
  pfSession: PfSession | null
  sxwySession: SxwySession | null
  current: User | null
}

export interface StoreState {
  user: UserState
}
