'use client'

import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'

export interface Notification {
  id: string
  type: 'message' | 'order' | 'like' | 'achievement' | 'review' | 'payment'
  title: string
  message: string
  time: string
  timestamp: number
  read: boolean
  avatar?: string
  userId?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  isLoading: boolean
}

// Simulate notification storage (in real app, this would be a database)
const NOTIFICATIONS_KEY = 'skillshare_notifications'

export function useNotifications(): UseNotificationsReturn {
  const { data: session } = useSession()
  const user = session?.user
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Filter notifications for current user
          const userNotifications = user?.email
            ? parsed.filter((n: Notification) => !n.userId || n.userId === user.email)
            : []
          setNotifications(userNotifications)
        }
      } catch (error) {
        console.error('Failed to load notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [user?.email])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications))
      } catch (error) {
        console.error('Failed to save notifications:', error)
      }
    }
  }, [notifications, isLoading])

  // Simulate real-time notifications (in real app, this would be WebSocket/SSE)
  useEffect(() => {
    if (!user) return

    const simulateNotifications = () => {
      const now = Date.now()
      const randomNotifications = [
        {
          type: 'order' as const,
          title: 'New order received!',
          message: `You have a new order for your project`,
          time: 'Just now',
          read: false,
          userId: user.email || undefined,
          actionUrl: '/dashboard/creator?tab=orders'
        },
        {
          type: 'message' as const,
          title: 'New message',
          message: 'You have a new message from a customer',
          time: 'Just now',
          read: false,
          userId: user.email || undefined,
          actionUrl: '/messages'
        },
        {
          type: 'like' as const,
          title: 'Project liked',
          message: 'Someone liked your project!',
          time: 'Just now',
          read: false,
          userId: user.email || undefined,
          actionUrl: '/dashboard/creator?tab=projects'
        }
      ]

      // Randomly add a notification every 30-60 seconds for demo
      if (Math.random() < 0.3) {
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }

    // Simulate notifications for demo (disable in production)
    const interval = setInterval(simulateNotifications, 45000) // 45 seconds
    return () => clearInterval(interval)
  }, [user])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep max 50 notifications
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    isLoading
  }
}