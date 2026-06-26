import { useState } from 'react'
import { useProfile } from '../contexts/ProfileContext'

export default function WhatsAppChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const { profileData } = useProfile()
  const { name, fullName, whatsappLink, profileImage } = profileData

  function handleSend(event) {
    event.preventDefault()
    const text = message.trim() || `Hi ${name}, I'd like to talk about a project.`
    const url = `${whatsappLink}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setMessage('')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={profileImage}
                alt={fullName}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                onError={(e) => { e.target.src = '/images/david2.png' }}
              />
              <div>
                <p className="font-semibold leading-tight">{fullName}</p>
                <p className="text-xs text-green-100">Typically replies within a day</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white/80 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="bg-[#e5ddd5] p-4">
            <div className="bg-white rounded-lg rounded-tl-none px-3 py-2 shadow text-sm text-gray-700 max-w-[85%]">
              Hi there! 👋 How can I help you? Type a message below — it'll open in WhatsApp so we can chat directly.
            </div>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 p-3 bg-white border-t border-gray-100">
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              aria-label="Send via WhatsApp"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#1ebe57] transition-colors"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Chat on WhatsApp'}
        className="relative w-16 h-16 rounded-full bg-[#25D366] text-white shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform"
      >
        {!isOpen && <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping"></span>}
        <i className={`relative ${isOpen ? 'fas fa-times' : 'fab fa-whatsapp'}`}></i>
      </button>
    </div>
  )
}
