export type ComponentEntry = {
  id: string
  title: string
  project: string
  /** Static preview until the live, interactive version is wired in. */
  image: string
  /** Scenic card artwork supplied in public/bgs. */
  background: string
  /** Render a live simulated interaction instead of a static screen image. */
  kind?: 'shift-clock' | 'shift-calendar' | 'gas-sizes' | 'gas-tracking' | 'rider-home' | 'product-catalog'
  width: number
  height: number
}

export const componentEntries: ComponentEntry[] = [
  {
    id: 'shift-clock-out',
    title: 'Shift Clock Out',
    project: 'Shifts App',
    image: '',
    background: '/bgs/bg1.webp',
    kind: 'shift-clock',
    width: 1170,
    height: 1411,
  },
  {
    id: 'shift-calendar',
    title: 'Shift Calendar',
    project: 'Shifts App',
    image: '',
    background: '/bgs/bg 2.webp',
    kind: 'shift-calendar',
    width: 1170,
    height: 1411,
  },
  {
    id: 'gasapp-cylinder-sizes',
    title: 'Cylinder Size Picker',
    project: 'Gas App',
    image: '',
    background: '/bgs/bg 3.webp',
    kind: 'gas-sizes',
    width: 1170,
    height: 1411,
  },
  {
    id: 'gasapp-delivery-tracking',
    title: 'Rider Delivery Tracking',
    project: 'Gas App',
    image: '',
    background: '/bgs/bg 4.webp',
    kind: 'gas-tracking',
    width: 1170,
    height: 1411,
  },
  {
    id: 'gasapp-rider-home',
    title: 'Rider Home',
    project: 'Gas App',
    image: '',
    background: '/bgs/bg 5.webp',
    kind: 'rider-home',
    width: 1170,
    height: 1411,
  },
  {
    id: 'gears-product-catalog',
    title: 'Product Catalog',
    project: 'GEARS',
    image: '',
    background: '/bgs/image 782958.webp',
    kind: 'product-catalog',
    width: 1170,
    height: 1411,
  },
]
