export default function IconCredit({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="https://github.com/dreamRs/phosphoricons"
      target="_blank"
      rel="noreferrer"
      className={`icon-credit ${dark ? 'icon-credit--dark' : ''}`}
    >
      Icons by Phosphor Icons — Victor Perrier &amp; Fanny Meyer
    </a>
  )
}
