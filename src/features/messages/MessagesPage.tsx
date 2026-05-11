import { useState } from 'react'
import { conversations } from './data/conversations'
import ConversationList from './ConversationList'
import ChatView from './ChatView'
import './messages.css'

interface Props {
  onBack: () => void
  inline?: boolean
}

export default function MessagesPage({ onBack, inline }: Props) {
  const initialId = conversations[0]?.id ?? ''
  const [selected, setSelected]     = useState(initialId)
  const [readIds, setReadIds]       = useState<Set<string>>(() => new Set(initialId ? [initialId] : []))
  const [listSearch, setListSearch] = useState('')
  const [chatSearch, setChatSearch] = useState('')

  function handleSelect(id: string) {
    setSelected(id)
    setReadIds(prev => new Set([...prev, id]))
    setChatSearch('')
  }

  const displayConversations = conversations.map(c => ({ ...c, unread: !readIds.has(c.id) }))
  const selectedConv = displayConversations.find(c => c.id === selected) ?? null

  return (
    <div className={`imsg-page${inline ? ' imsg-page--inline' : ''}`}>
      {/* Status bar — only shown as standalone page */}
      {!inline && (
        <div className="imsg-status-bar">
          <span className="imsg-status-bar__time">9:41</span>
          <span className="imsg-status-bar__right">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0"  y="4" width="3" height="8" rx="1"/>
              <rect x="4"  y="2.5" width="3" height="9.5" rx="1"/>
              <rect x="8"  y="1" width="3" height="11" rx="1"/>
              <rect x="12" y="0" width="3" height="12" rx="1"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 24 18" fill="currentColor">
              <path d="M12 3C7.92 3 4.26 4.77 1.73 7.56L0 5.83C3 2.25 7.26 0 12 0s9 2.25 12 5.83l-1.73 1.73C19.74 4.77 16.08 3 12 3zm0 4c-2.75 0-5.23 1.12-7.03 2.93L3.24 8.2C5.47 5.84 8.57 4.5 12 4.5s6.53 1.34 8.76 3.7l-1.73 1.73C17.23 8.12 14.75 7 12 7zm0 4c-1.38 0-2.63.56-3.54 1.46L12 16l3.54-3.54C14.63 11.56 13.38 11 12 11z"/>
            </svg>
            <span>100%</span>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
              <rect x="0" y="1" width="22" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/>
              <rect x="1.5" y="2.5" width="18" height="7" rx="1.5"/>
              <path d="M23 4.5v3a1.5 1.5 0 000-3z"/>
            </svg>
          </span>
        </div>
      )}

      {/* Two-panel layout */}
      <div className="imsg-layout">
        <ConversationList
          conversations={displayConversations}
          selected={selected}
          onSelect={handleSelect}
          searchQuery={listSearch}
          onSearch={setListSearch}
        />
        <ChatView
          conversation={selectedConv}
          chatSearch={chatSearch}
          onChatSearch={setChatSearch}
        />
      </div>

      {/* Back button — only shown when used as a standalone page */}
      {!inline && (
        <button className="imsg-back-btn" onClick={onBack} aria-label="Back">
          <svg width="10" height="16" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}
