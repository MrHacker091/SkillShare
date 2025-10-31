import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  content: string
  type: 'text' | 'image' | 'file'
  timestamp: string
  isRead: boolean
  reactions: any[]
}

interface Conversation {
  id: string
  participants: string[]
  createdAt: string
  updatedAt: string
  metadata: {
    projectTitle?: string
    projectId?: string
  }
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  // UI helper properties (computed from participants and metadata)
  participantName?: string
  participantAvatar?: string
  participantTitle?: string
  projectTitle?: string
  isOnline?: boolean
}

export function useRealTimeChat() {
  const { data: session } = useSession()
  const user = session?.user
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Fetch conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user?.email) return

    try {
      const response = await fetch(`/api/messages?userId=${encodeURIComponent(user.email)}`)
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }, [user?.email])

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Send a new message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text'
  ) => {
    if (!user?.email || !user?.name) return false

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          senderId: user.email,
          senderName: user.name,
          content,
          type
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Add the new message to the local state immediately
        setMessages(prev => [...prev, data.message])
        // Refresh conversations to update last message
        await fetchConversations()
        return true
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
    return false
  }, [user?.email, user?.name, fetchConversations])

  // Create or get conversation
  const createConversation = useCallback(async (
    recipientId: string,
    projectTitle?: string,
    projectId?: string
  ) => {
    if (!user?.email) return null

    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: [user.email, recipientId],
          projectTitle,
          projectId
        })
      })

      if (response.ok) {
        const data = await response.json()
        await fetchConversations() // Refresh conversations list
        return data.conversation
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
    return null
  }, [user?.email, fetchConversations])

  // Polling for real-time updates (in a production app, use WebSocket)
  useEffect(() => {
    if (!user?.email) return

    const pollInterval = setInterval(() => {
      fetchConversations()
    }, 5000) // Poll every 5 seconds

    setIsConnected(true)

    return () => {
      clearInterval(pollInterval)
      setIsConnected(false)
    }
  }, [user?.email, fetchConversations])

  // Initial fetch
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  return {
    messages,
    conversations,
    isLoading,
    isConnected,
    fetchMessages,
    sendMessage,
    createConversation,
    refreshConversations: fetchConversations
  }
}

export default useRealTimeChat