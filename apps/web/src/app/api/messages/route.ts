import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get('otherUserId')

    if (otherUserId) {
      // Get messages between current user and another user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.user.id }
          ]
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: session.user.id,
          isRead: false
        },
        data: {
          isRead: true
        }
      })

      const transformedMessages = messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.sender.name || 'Unknown User',
        content: msg.content,
        timestamp: msg.createdAt.toISOString(),
        isRead: msg.isRead
      }))

      return NextResponse.json({ success: true, messages: transformedMessages })
    } else {
      // Get all conversations (unique users the current user has messaged with)
      const sentMessages = await prisma.message.findMany({
        where: { senderId: session.user.id },
        distinct: ['receiverId'],
        orderBy: { createdAt: 'desc' },
        include: {
          receiver: {
            select: { id: true, name: true, avatar: true }
          }
        }
      })

      const receivedMessages = await prisma.message.findMany({
        where: { receiverId: session.user.id },
        distinct: ['senderId'],
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: { id: true, name: true, avatar: true }
          }
        }
      })

      // Combine and deduplicate conversations
      const conversationMap = new Map()

      sentMessages.forEach(msg => {
        if (!conversationMap.has(msg.receiverId)) {
          conversationMap.set(msg.receiverId, {
            otherUserId: msg.receiverId,
            otherUserName: msg.receiver.name,
            otherUserAvatar: msg.receiver.avatar,
            lastMessageTime: msg.createdAt.toISOString()
          })
        }
      })

      receivedMessages.forEach(msg => {
        const existing = conversationMap.get(msg.senderId)
        if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessageTime)) {
          conversationMap.set(msg.senderId, {
            otherUserId: msg.senderId,
            otherUserName: msg.sender.name,
            otherUserAvatar: msg.sender.avatar,
            lastMessageTime: msg.createdAt.toISOString()
          })
        }
      })

      // Get unread counts and last messages for each conversation
      const conversations = []
      for (const [otherUserId, conv] of conversationMap) {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: session.user.id, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: session.user.id }
            ]
          },
          orderBy: { createdAt: 'desc' }
        })

        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: session.user.id,
            isRead: false
          }
        })

        conversations.push({
          ...conv,
          lastMessage: lastMessage?.content || '',
          lastMessageTime: lastMessage?.createdAt.toISOString() || conv.lastMessageTime,
          unreadCount
        })
      }

      conversations.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

      return NextResponse.json({ success: true, conversations })
    }

    return NextResponse.json({ success: true, messages: [], conversations: [] })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { receiverId, content, type = 'text' } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing receiverId or content' }, { status: 400 })
    }

    // Create new message in database
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        content,
        isRead: false,
        attachments: type !== 'text' ? { type } : null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    const transformedMessage = {
      id: message.id,
      senderId,
      senderName,
      content,
      type,
      timestamp: new Date().toISOString(),
      isRead: false,
      reactions: []
    }

    // Store message
    messages.push(newMessage)

    // Update conversation timestamp
    const conversation = conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      conversation.updatedAt = new Date().toISOString()
    }

    // In a real app, here you would:
    // 1. Save to database
    // 2. Broadcast to other participants via WebSocket
    // 3. Send push notifications

    return NextResponse.json({
      success: true,
      message: newMessage
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create or get conversation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { participants, projectTitle, projectId } = body

    if (!participants || participants.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 participants' }, { status: 400 })
    }

    // Check if conversation already exists
    const existingConv = conversations.find(conv =>
      conv.participants.length === participants.length &&
      participants.every((p: string) => conv.participants.includes(p))
    )

    if (existingConv) {
      return NextResponse.json({ conversation: existingConv })
    }

    // Create new conversation
    const newConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        projectTitle: projectTitle || '',
        projectId: projectId || ''
      }
    }

    conversations.push(newConversation)

    return NextResponse.json({
      success: true,
      conversation: newConversation
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}