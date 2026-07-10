// Ref-counted toggle for body.glass-active (see app.css) — the loading
// screen and the project detail overlay can overlap in time, so a plain
// classList.add/remove from each would let one strip the blur out from
// under the other.
let holders = 0

export function acquireGlass() {
  holders += 1
  document.body.classList.add('glass-active')
}

export function releaseGlass() {
  holders = Math.max(0, holders - 1)
  if (holders === 0) document.body.classList.remove('glass-active')
}
