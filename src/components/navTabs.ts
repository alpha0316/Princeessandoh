// Work sections live on the home page; Pictures and About are their own pages.
export type WorkTab = 'mobile' | 'web' | 'components' | 'store'
export type NavKey = WorkTab | 'snaps' | 'about'

export const WORK_TABS: WorkTab[] = ['mobile', 'web', 'components', 'store']
export const isWorkTab = (key: string): key is WorkTab => (WORK_TABS as string[]).includes(key)
