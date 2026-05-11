import type { Message } from './data/conversations'

export default function ChatBubble({ message }: { message: Message }) {
  const side = message.sent ? 'sent' : 'received'
  return (
    <div className={`imsg-row imsg-row--${side}${message.isNew ? ' imsg-row--new' : ''}`}>
      {!message.sent && message.sender && (
        <span className="imsg-sender">{message.sender}</span>
      )}
      <div className={`imsg-bubble imsg-bubble--${side}`}>
        {message.text}
      </div>
      <span className="imsg-time">{message.time}</span>
    </div>
  )
}
