import type { Conversation } from './data/conversations'

interface Props {
  conversations: Conversation[]
  selected: string
  onSelect: (id: string) => void
  searchQuery: string
  onSearch: (q: string) => void
}

export default function ConversationList({
  conversations,
  selected,
  onSelect,
  searchQuery,
  onSearch,
}: Props) {
  const filtered = searchQuery.trim()
    ? conversations.filter(
        c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations

  return (
    <aside className="imsg-sidebar">
      {/* Header */}
      <div className="imsg-sidebar__header">
        <button className="imsg-sidebar__edit">Edit</button>
        <h1 className="imsg-sidebar__title">Messages</h1>
        <button className="imsg-sidebar__compose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"
              stroke="#007AFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="imsg-sidebar__search-wrap">
        <div className="imsg-sidebar__search">
          <svg className="imsg-sidebar__search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#8E8E93" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="imsg-sidebar__search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="imsg-sidebar__search-clear" onClick={() => onSearch('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Conversation rows */}
      <div className="imsg-sidebar__list">
        {filtered.length === 0 && (
          <p className="imsg-sidebar__empty">No results for "{searchQuery}"</p>
        )}
        {filtered.map(conv => (
          <button
            key={conv.id}
            className={`imsg-conv${selected === conv.id ? ' imsg-conv--active' : ''}${conv.unread ? ' imsg-conv--unread' : ''}`}
            onClick={() => onSelect(conv.id)}
          >
            {/* Avatar */}
            <div
              className="imsg-conv__avatar"
              style={{ background: conv.avatarColor }}
              aria-hidden="true"
            >
              {conv.initials}
            </div>

            {/* Body */}
            <div className="imsg-conv__body">
              <div className="imsg-conv__row">
                <span className="imsg-conv__name">{conv.name}</span>
                <span className="imsg-conv__time">{conv.time}</span>
              </div>
              <div className="imsg-conv__preview">{conv.lastMessage}</div>
            </div>

            {/* Unread dot */}
            {conv.unread && <span className="imsg-conv__dot" aria-label="Unread" />}
          </button>
        ))}
      </div>
    </aside>
  )
}
