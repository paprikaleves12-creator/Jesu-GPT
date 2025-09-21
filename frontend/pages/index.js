import { useState } from 'react'

export default function Home() {
  // These are "state variables" that hold our data
  const [input, setInput] = useState('') // Holds the message the user is typing
  const [messages, setMessages] = useState([]) // Holds the list of all messages
  const [loading, setLoading] = useState(false) // Keeps track of when we are waiting for the AI

  // This function runs when the user clicks "Send"
  async function sendMessage() {
    if (!input.trim()) return // Don't do anything if the message is empty
    setLoading(true) // We are now loading

    // Add the user's message to the list
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput(''); // Clear the input box

    try {
      // Send the conversation to OUR backend server
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()

      // Add the AI's response to the list of messages
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      // If there's an error (e.g., server is off), show it
      setMessages((m) => [...m, { role: 'assistant', content: 'Error: ' + err.message }])
    } finally {
      setLoading(false) // We are done loading
    }
  }

  // This is what the webpage looks like
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      <h1>AI Chat Assistant</h1>

      {/* This is the chat box */}
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', minHeight: '300px', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: m.role === 'user' ? '#f0f0f0' : '#e6f7ff', borderRadius: '5px' }}>
            <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {m.content}
          </div>
        ))}
      </div>

      {/* This is the input box and send button */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
          style={{ flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Type your message here..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: loading ? '#ccc' : '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  )
}