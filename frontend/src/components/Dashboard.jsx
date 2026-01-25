import { useUser, useAuth, SignOutButton } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { getApiUrl, API_ENDPOINTS } from '../config/api'

const Dashboard = () => {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [backendUser, setBackendUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({ firstName: '', lastName: '' })

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await getToken()
      const response = await fetch(getApiUrl(API_ENDPOINTS.USER_PROFILE), {
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

  const updateProfile = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const response = await fetch(getApiUrl(API_ENDPOINTS.USER_PROFILE), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        await fetchUserProfile()
        setEditMode(false)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const refreshUserData = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const response = await fetch(getApiUrl(API_ENDPOINTS.USER_REFRESH), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchUserProfile()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'profile', name: 'Profile', icon: '👤' },
              { id: 'settings', name: 'Settings', icon: '⚙️' },
              { id: 'activity', name: 'Activity', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-orange-100">
                Ready to explore the Nirvana Club dashboard?
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="text-2xl font-bold text-gray-900">Active</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Sync Status</p>
                    <p className="text-2xl font-bold text-green-600">Synced</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-medium">Edit Profile</div>
                  <div className="text-sm text-gray-500">Update your information</div>
                </button>

                <button
                  onClick={refreshUserData}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium">Refresh Data</div>
                  <div className="text-sm text-gray-500">Sync from Clerk</div>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-medium">Settings</div>
                  <div className="text-sm text-gray-500">Manage preferences</div>
                </button>

                <button
                  onClick={() => setActiveTab('activity')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="text-2xl mb-2">📈</div>
                  <div className="font-medium">Activity</div>
                  <div className="text-sm text-gray-500">View your activity</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => {
                    setEditMode(!editMode)
                    if (!editMode && backendUser) {
                      setEditData({
                        firstName: backendUser.firstName,
                        lastName: backendUser.lastName
                      })
                    }
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={updateProfile}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Clerk Data</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        {user?.imageUrl && (
                          <img src={user.imageUrl} alt="Profile" className="w-16 h-16 rounded-full" />
                        )}
                        <div>
                          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>User ID:</strong> {user?.id}</p>
                        <p><strong>Joined:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">MongoDB Data</h3>
                    {backendUser ? (
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">{backendUser.firstName} {backendUser.lastName}</p>
                          <p className="text-gray-500">{backendUser.email}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>MongoDB ID:</strong> {backendUser.id}</p>
                          <p><strong>Clerk ID:</strong> {backendUser.clerkId}</p>
                          <p><strong>Created:</strong> {new Date(backendUser.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">Loading...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={refreshUserData}
                      disabled={loading}
                      className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
                    >
                      {loading ? 'Refreshing...' : 'Refresh User Data from Clerk'}
                    </button>

                    <button
                      onClick={fetchUserProfile}
                      disabled={loading}
                      className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 ml-0 md:ml-4"
                    >
                      {loading ? 'Loading...' : 'Reload Backend Data'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Status</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-green-700">
                      {backendUser && user ? (
                        <>
                          ✅ Frontend and Backend are synchronized<br />
                          ✅ User ID: {user.id === backendUser.clerkId ? 'Match' : 'Mismatch'}<br />
                          ✅ Email: {user.primaryEmailAddress?.emailAddress === backendUser.email ? 'Match' : 'Mismatch'}
                        </>
                      ) : (
                        '⏳ Checking synchronization...'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div>
                    <p className="font-medium">Account Created</p>
                    <p className="text-sm text-gray-500">{new Date(user?.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">🔄</span>
                  </div>
                  <div>
                    <p className="font-medium">Data Synchronized</p>
                    <p className="text-sm text-gray-500">Clerk and MongoDB data synced</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">👋</span>
                  </div>
                  <div>
                    <p className="font-medium">Welcome to Nirvana Club</p>
                    <p className="text-sm text-gray-500">Dashboard access granted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="text-red-700">Error: {error}</div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
