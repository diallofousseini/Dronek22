import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ADMIN_EMAIL } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

export const useAdminAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Fallback to mock auth if it exists
        if (typeof window !== 'undefined' && localStorage.getItem('dronek_mock_auth') === 'true') {
          setUser({ email: ADMIN_EMAIL, id: 'mock-admin' } as any)
          setIsAdmin(true)
        } else {
          router.push('/admin/login')
        }
      } else if (session.user.email !== ADMIN_EMAIL) {
        supabase.auth.signOut()
        router.push('/admin/login')
      } else {
        setUser(session.user)
        setIsAdmin(true)
      }
      setIsLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          if (localStorage.getItem('dronek_mock_auth') !== 'true') {
            setIsAdmin(false)
            setUser(null)
            router.push('/admin/login')
          }
        } else if (session.user.email !== ADMIN_EMAIL) {
          setIsAdmin(false)
          setUser(null)
          supabase.auth.signOut()
          router.push('/admin/login')
        } else {
          setUser(session.user)
          setIsAdmin(true)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  return { isLoading, isAdmin, user }
}
