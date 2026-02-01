import { useUser, useAuth } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiUrl, API_ENDPOINTS } from '../config/api'
import ApplicationForm from './ApplicationForm'
import ApplicationStatus from './ApplicationStatus'

const Dashboard = () => {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [backendUser, setBackendUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [eligibility, setEligibility] = useState(null)

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
      checkEligibility()
    }
  }, [isLoaded, user])

  const checkEligibility = async () => {
    try {
      const token = await getToken()
      const response = await fetch(getApiUrl(API_ENDPOINTS.USER_ELIGIBILITY), {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      setEligibility(data)
    } catch (error) {
      console.error('Error checking eligibility:', error)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-2xl font-bold text-gray-900 mb-2">Access Denied</p>
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
        </div>
      </div>
    )
  }

  const getRoleBadge = (role) => {
    const badges = {
      'SUPER_ADMIN': { color: 'from-purple-500 to-pink-500', icon: '👑', label: 'SUPER_ADMIN' },
      'LEAD': { color: 'from-blue-500 to-purple-500', icon: '⭐', label: 'Lead' },
      'CO_LEAD': { color: 'from-green-500 to-blue-500', icon: '🌟', label: 'Co-Lead' },
      'DOMAIN_LEAD': { color: 'from-orange-500 to-yellow-500', icon: '🎯', label: 'Domain Lead' },
      'MEMBER': { color: 'from-gray-500 to-gray-600', icon: '👤', label: 'Member' }
    }
    return badges[role] || badges['MEMBER']
  }

  const roleBadge = backendUser?.role ? getRoleBadge(backendUser.role) : null
  const isAdmin = backendUser?.role && ['SUPER_ADMIN', 'LEAD', 'CO_LEAD'].includes(backendUser.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-pink-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-orange-100 text-lg">
                {isAdmin
                  ? '✨ Admin Dashboard - Manage your club with ease'
                  : '🧘 Your personal Nirvana Club space'}
              </p>
            </div>
            {roleBadge && (
              <div className={`hidden md:block bg-gradient-to-r ${roleBadge.color} px-6 py-3 rounded-full text-white font-bold text-lg shadow-lg`}>
                {roleBadge.icon} {roleBadge.label}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Card with Enhanced Design */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="mr-2">👤</span> Profile
              </h2>
              {roleBadge && (
                <div className={`md:hidden bg-gradient-to-r ${roleBadge.color} px-4 py-2 rounded-full text-white font-semibold text-sm shadow-md`}>
                  {roleBadge.icon} {roleBadge.label}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {user?.imageUrl && (
                <div className="relative">
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-orange-200 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-600 text-lg mb-2">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    📅 Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  {isAdmin && (
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      🔑 Admin Access
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Panel with Enhanced Cards */}
          {isAdmin && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">⚡</span> Admin Panel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/manage-applications')}
                  className="group relative overflow-hidden p-6 border-2 border-orange-200 rounded-xl hover:border-orange-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">📋</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Applications</div>
                    <div className="text-sm text-gray-600">Review membership requests</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/manage-members')}
                  className="group relative overflow-hidden p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">👥</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Members</div>
                    <div className="text-sm text-gray-600">Edit team hierarchy</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/manage-blogs')}
                  className="group relative overflow-hidden p-6 border-2 border-green-200 rounded-xl hover:border-green-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">📝</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Blogs</div>
                    <div className="text-sm text-gray-600">Create and edit posts</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/review-blogs')}
                  className="group relative overflow-hidden p-6 border-2 border-purple-200 rounded-xl hover:border-purple-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">✅</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Review Blogs</div>
                    <div className="text-sm text-gray-600">Approve pending posts</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/report-bug')}
                  className="group relative overflow-hidden p-6 border-2 border-pink-200 rounded-xl hover:border-pink-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">🐛</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Report Bug</div>
                    <div className="text-sm text-gray-600">Submit an issue</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/manage-bugs')}
                  className="group relative overflow-hidden p-6 border-2 border-red-200 rounded-xl hover:border-red-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">🛠️</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Manage Bugs</div>
                    <div className="text-sm text-gray-600">Track and resolve issues</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/manage-events')}
                  className="group relative overflow-hidden p-6 border-2 border-indigo-200 rounded-xl hover:border-indigo-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-5xl mb-3">📅</div>
                    <div className="font-bold text-xl text-gray-900 mb-2">Manage Events</div>
                    <div className="text-sm text-gray-600">Create and organize events</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Quick Links for Non-Admin Users */}
          {!isAdmin && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🚀</span> Quick Links
              </h3>
              <div className={`grid grid-cols-1 gap-4 ${!backendUser?.memberId && backendUser?.role === 'USER' && eligibility?.isIIITSEmail ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
                <button
                  onClick={() => navigate('/blogs')}
                  className="group relative overflow-hidden p-6 border-2 border-indigo-200 rounded-xl hover:border-indigo-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-4xl mb-2">📚</div>
                    <div className="font-semibold text-lg text-gray-900">Read Blogs</div>
                    <div className="text-sm text-gray-600">Explore our latest posts</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/members')}
                  className="group relative overflow-hidden p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-4xl mb-2">🌟</div>
                    <div className="font-semibold text-lg text-gray-900">Team Members</div>
                    <div className="text-sm text-gray-600">Meet the Nirvana team</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/my-blogs')}
                  className="group relative overflow-hidden p-6 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-4xl mb-2">✍️</div>
                    <div className="font-semibold text-lg text-gray-900">Write a Blog</div>
                    <div className="text-sm text-gray-600">Share your thoughts</div>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/report-bug')}
                  className="group relative overflow-hidden p-6 border-2 border-rose-200 rounded-xl hover:border-rose-400 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  <div className="relative">
                    <div className="text-4xl mb-2">🐛</div>
                    <div className="font-semibold text-lg text-gray-900">Report Bug</div>
                    <div className="text-sm text-gray-600">Found an issue? Let us know</div>
                  </div>
                </button>

                {/* Apply Button - Only for IIITS email users who aren't members */}
                {!backendUser?.memberId && backendUser?.role === 'USER' && eligibility?.isIIITSEmail && (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="group relative overflow-hidden p-6 border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl hover:border-orange-500 text-left transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                    <div className="relative">
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="font-semibold text-lg text-orange-600">Apply for Team</div>
                      <div className="text-sm text-orange-700">Join Nirvana Club</div>
                    </div>
                  </button>

                )}

                {/* Manage Bugs for Technical Members (Non-Admin) */}
                {backendUser?.domain === 'Technical' && !isAdmin && (
                  <button
                    onClick={() => navigate('/manage-bugs')}
                    className="group p-6 border-2 border-red-200 rounded-xl hover:border-red-400 text-left transition-all hover:shadow-md"
                  >
                    <div className="text-4xl mb-2">🛠️</div>
                    <div className="font-semibold text-lg text-gray-900">Manage Bugs</div>
                    <div className="text-sm text-gray-600">Track and resolve issues</div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Application Section */}
          {showApplicationForm ? (
            <ApplicationForm
              onSuccess={() => {
                setShowApplicationForm(false);
                checkEligibility();
                fetchUserProfile();
              }}
              onCancel={() => setShowApplicationForm(false)}
            />
          ) : (
            <>
              {/* Eligibility Banner - Enhanced */}
              {eligibility?.eligible && (
                <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl p-8 text-white shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-3 flex items-center">
                      🎯 Join the Nirvana Club Team!
                    </h3>
                    <p className="text-orange-100 text-lg mb-6 max-w-2xl">
                      You're eligible to apply for team membership with your @iiits.in email.
                      Be part of our amazing community and contribute to exciting projects!
                    </p>
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      🚀 Apply Now
                    </button>
                  </div>
                </div>
              )}

              {/* Member Status - Enhanced */}
              {backendUser?.memberId && (
                <div className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white shadow-xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-3 flex items-center">
                      ✅ You're a Nirvana Club Member!
                    </h3>
                    <p className="text-green-100 text-lg mb-2">
                      <strong>Role:</strong> {backendUser.role}
                    </p>
                    <p className="text-green-100">
                      You're part of the team hierarchy and can access member features.
                    </p>
                  </div>
                </div>
              )}

              {/* Application Status */}
              {!eligibility?.eligible && !backendUser?.memberId && eligibility?.isIIITSEmail && (
                <ApplicationStatus />
              )}
            </>
          )}

          {/* Error Display - Enhanced */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-md">
              <div className="flex items-start">
                <div className="text-3xl mr-4">⚠️</div>
                <div className="flex-1">
                  <div className="text-red-800 font-semibold text-lg mb-2">Error Occurred</div>
                  <div className="text-red-700">{error}</div>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-red-600 hover:text-red-800 font-medium underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
