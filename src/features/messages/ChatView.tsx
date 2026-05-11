import { useEffect, useRef, useState } from 'react'
import type { Conversation, Message } from './data/conversations'
import ChatBubble from './ChatBubble'

interface Props {
  conversation: Conversation | null
  chatSearch: string
  onChatSearch: (q: string) => void
}

export default function ChatView({ conversation, chatSearch, onChatSearch }: Props) {
  const [messages, setMessages]   = useState<Message[]>([])
  const [searching, setSearching] = useState(false)
  const threadRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  // Sync messages when conversation changes
  useEffect(() => {
    setMessages(conversation ? [...conversation.messages] : [])
  }, [conversation?.id])

  // Scroll to bottom whenever messages update
  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  // Filter for in-chat search highlight
  const displayMessages = chatSearch.trim()
    ? messages.filter(m =>
        m.text.toLowerCase().includes(chatSearch.toLowerCase()),
      )
    : messages

  if (!conversation) {
    return (
      <div className="imsg-view imsg-view--empty">
        <div className="imsg-view__empty-icon">💬</div>
        <p>Select a conversation to start messaging</p>
      </div>
    )
  }

  return (
    <div className="imsg-view">
      {/* ── Header ── */}
      <div className="imsg-view__header">
        <div
          className="imsg-view__contact-avatar"
          style={{ background: conversation.avatarColor }}
        >
          {conversation.initials}
        </div>
        <div className="imsg-view__contact-info">
          <span className="imsg-view__contact-name">{conversation.name}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* In-chat search toggle */}
        <button
          className="imsg-view__search-btn"
          onClick={() => { setSearching(s => !s); if (!searching) setTimeout(() => inputRef.current?.focus(), 50) }}
          aria-label="Search this conversation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#007AFF" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#007AFF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── In-chat search bar ── */}
      {searching && (
        <div className="imsg-view__chat-search">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search in conversation…"
            value={chatSearch}
            onChange={e => onChatSearch(e.target.value)}
            className="imsg-view__chat-search-input"
          />
          <button onClick={() => { setSearching(false); onChatSearch('') }} className="imsg-view__chat-search-cancel">
            Cancel
          </button>
        </div>
      )}

      {/* ── Message thread ── */}
      <div className="imsg-view__thread" ref={threadRef}>
        {displayMessages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </div>

    </div>
  )
}
