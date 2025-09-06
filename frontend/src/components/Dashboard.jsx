import { useUser, useAuth } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'

const Dashboard = () => {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [backendUser, setBackendUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = await getToken()
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setBackendUser(data.user)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please sign in to access the dashboard.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome to Your Dashboard
          </h1>

          {/* Frontend User Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Frontend (Clerk) User Data
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>ID:</strong> {user.id}
                </div>
                <div>
                  <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
                </div>
                <div>
                  <strong>First Name:</strong> {user.firstName}
                </div>
                <div>
                  <strong>Last Name:</strong> {user.lastName}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Profile Image:</strong> 
                  {user.imageUrl && (
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full ml-2 inline"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Backend User Data */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Backend (MongoDB) User Data
            </h2>
            
            {loading && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-700">Loading backend data...</div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <div className="text-red-700">Error: {error}</div>
                <button 
                  onClick={fetchUserProfile}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {backendUser && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>MongoDB ID:</strong> {backendUser.id}
                  </div>
                  <div>
                    <strong>Clerk ID:</strong> {backendUser.clerkId}
                  </div>
                  <div>
                    <strong>Email:</strong> {backendUser.email}
                  </div>
                  <div>
                    <strong>First Name:</strong> {backendUser.firstName}
                  </div>
                  <div>
                    <strong>Last Name:</strong> {backendUser.lastName}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(backendUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sync Status */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Sync Status
            </h3>
            <div className="text-green-700">
              {backendUser && user ? (
                <>
                  ✅ Frontend and Backend are synchronized<br/>
                  ✅ User ID: {user.id === backendUser.clerkId ? 'Match' : 'Mismatch'}<br/>
                  ✅ Email: {user.primaryEmailAddress?.emailAddress === backendUser.email ? 'Match' : 'Mismatch'}
                </>
              ) : (
                '⏳ Checking synchronization...'
              )}
            </div>
          </div>

          {/* Test API Button */}
          <div className="mt-8">
            <button
              onClick={fetchUserProfile}
              disabled={loading}
              className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Backend Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
