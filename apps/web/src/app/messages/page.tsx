'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import useRealTimeChat from '@/hooks/useRealTimeChat'
import { useSession } from 'next-auth/react'
import { ArrowLeft, MoreVertical, Paperclip, Phone, Search, Send, Video } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef, useState } from 'react'

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

function MessagesContent() {
  const searchParams = useSearchParams()
  const creatorId = searchParams.get('creator')
  const { data: session } = useSession()
  const user = session?.user

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Use the real-time chat hook
  const {
    messages,
    conversations,
    isLoading,
    isConnected,
    fetchMessages,
    sendMessage,
    createConversation
  } = useRealTimeChat()



  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation, fetchMessages])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-select conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].id)
    }
  }, [conversations, selectedConversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    const success = await sendMessage(selectedConversation, newMessage.trim())

    if (success) {
      setNewMessage('')
    } else {
      alert('Failed to send message. Please try again.')
    }
    setIsSending(false)
  }

  // Helper function to get participant name from conversation
  const getParticipantInfo = (conversation: Conversation) => {
    const otherParticipant = conversation.participants.find(p => p !== user?.email)
    return {
      name: conversation.participantName || otherParticipant || 'Unknown User',
      avatar: conversation.participantAvatar || '/placeholder-avatar.jpg',
      title: conversation.participantTitle || 'User'
    }
  }

  const selectedConversationData = conversations.find(c => c.id === selectedConversation)

  const filteredConversations = conversations.filter(conv => {
    const participantInfo = getParticipantInfo(conv)
    return participantInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.metadata.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Messages</h1>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={conversation.participantAvatar} alt={conversation.participantName} />
                    <AvatarFallback>{conversation.participantName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.participantName}</h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessageTime ? new Date(conversation.lastMessageTime).toLocaleDateString() : 'No messages'}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-1">{conversation.participantTitle}</p>

                  {conversation.projectTitle && (
                    <Badge variant="secondary" className="text-xs mb-2">
                      {conversation.projectTitle}
                    </Badge>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate pr-2">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <Badge variant="default" className="text-xs min-w-5 h-5">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversationData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversationData.participantAvatar} alt={selectedConversationData.participantName} />
                      <AvatarFallback>{selectedConversationData.participantName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                    </Avatar>
                    {selectedConversationData.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold">{selectedConversationData.participantName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversationData.isOnline ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.email ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${message.senderId === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted'
                      }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.senderId === user?.email ? 'text-blue-100' : 'text-muted-foreground'
                      }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <Button onClick={(e) => handleSendMessage(e)} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* No conversation selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Send className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}