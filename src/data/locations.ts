export type DropPoint = {
  name: string
  latitude: number
  longitude: number
  hidden?: boolean
}

export type Location = {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  dropPoints: DropPoint[]
}

export const locationsss: Location[] = [
  {
    id: '1',
    name: 'Main Library',
    description: 'Prempeh Library, Administration',
    latitude: 6.675033566213408,
    longitude: -1.5723546778455368,
    dropPoints: [
      { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
      { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
      { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.5675650457295751 },
      { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
      // { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308, hidden: true },
      { name: 'Otumfou Round About', latitude: 6.678623435492123, longitude: -1.570881024852267, hidden: true },
    ],
  },
  {
    id: '2',
    name: 'Brunei',
    description: 'New Brunei, Complex, Katanga',
    latitude: 6.670465091472612,
    longitude: -1.5741574445526254,
    dropPoints: [
      { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
      { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
      { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
      { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
    ],
  },
  {
    id: '3',
    name: 'Commercial Area',
    description: 'Bomso, Central Bus stop',
    latitude: 6.682751297721754,
    longitude: -1.5769726260262382,
    dropPoints: [
      { name: 'Commercial Area', latitude: 6.682751297721754, longitude: -1.5769726260262382 },
      { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
      { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.5675650457295751 },
      { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
      // { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308, hidden: true },
      { name: 'Otumfou Round About', latitude: 6.678623435492123, longitude: -1.570881024852267, hidden: true },
    ],
  },
  {
    id: '4',
    name: 'Hall 7',
    description: 'Halls, Campus, Unity',
    latitude: 6.679295619563862,
    longitude: -1.572807677030472,
    dropPoints: [
      { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
      { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
      { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
    ],
  },
  {
    id: '5',
    name: 'Gaza',
    description: 'Off Campus',
    latitude: 6.686603046574587,
    longitude: -1.556854180379707,
    dropPoints: [
      { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
      { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
      { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
    ],
  },
  {
    id: '6',
    name: 'Medical Village',
    description: 'Off Campus',
    latitude: 6.6800787890749245,
    longitude: -1.549747261104641,
    dropPoints: [
      { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
      { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
      { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
    ],
  },
  {
    id: '7',
    name: 'Pharmacy Busstop',
    description: 'Gaza, Medical Village Loading Spot',
    latitude: 6.67480379472123,
    longitude: -1.5663873751176354,
    dropPoints: [
      { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
      { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
      { name: 'Gaza', latitude: 6.68650432276154, longitude: -1.556854180379707 },
    ],
  },
  {
    id: '8',
    name: 'Pentecost Busstop',
    description: 'On Campus',
    latitude: 6.674545299373284,
    longitude: -1.5675650457295751,
    dropPoints: [
      { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
      // { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 },
      { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
      { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
      { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
    ],
  },
  {
    id: '9',
    name: 'SRC Busstop',
    description: 'Casley Hayford',
    latitude: 6.675223889340042,
    longitude: -1.5678831412482812,
    dropPoints: [
      { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
      { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
      { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
      { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
      { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
      // { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308, hidden: true },
      { name: 'Otumfou Round About', latitude: 6.678623435492123, longitude: -1.570881024852267, hidden: true },
    ],
  },
  {
    id: '10',
    name: 'KSB',
    description: 'Business School',
    latitude: 6.669314250173885,
    longitude: -1.567181795001016,
    dropPoints: [
      { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
      { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
      { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
      { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
      { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
      { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
      { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
      // { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308, hidden: true },
      // { name: 'Otumfou Round About', latitude: 6.678623435492123, longitude: -1.570881024852267, hidden: true },
    ],
  },
  {
    id: '11',
    name: 'Conti Busstop',
    description: 'Halls, Campus, Unity',
    latitude: 6.679644223364716,
    longitude: -1.572967657880401,
    dropPoints: [
      { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
      { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
      { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
      // { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308, hidden: true },
    ],
  },
]
