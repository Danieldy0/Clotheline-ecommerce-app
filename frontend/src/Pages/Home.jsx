import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../Componets/Header'
import HeroCarosel from '../Componets/HeroCarosel'
import LogDialog from '../Componets/Utils/LogDialog'

const Home = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogModal, setShowLogModal] = useState(false)
  const [loggedUserName, setLoggedUserName] = useState('')

  useEffect(() => {
    if (location.state?.showLogModal) {
      setShowLogModal(true)
      try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
        setLoggedUserName(user.firstname ? `${user.firstname} ${user.lastname}` : '')
      } catch {
        setLoggedUserName('')
      }
      // Clear state so refreshing doesn't show modal again
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.showLogModal, location.pathname, navigate])

  const closeLogModal = () => setShowLogModal(false)

  return (
    <div>
      <Header />
      <main className="flex-1 relative">
        {showLogModal && (
          <LogDialog
            open={showLogModal}
            onClose={closeLogModal}
            userName={loggedUserName}
          />
        )}
        <HeroCarosel />
      </main>
    </div>
  )
}

export default Home