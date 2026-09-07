import { BrowserRouter, Routes, Route } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { QueryProvider } from './lib/QueryProvider'
import { ClerkProvider } from './lib/ClerkProvider'
import { AuthProvider } from './features/auth/hooks/useAuth'
import { FollowsProvider } from './features/follows/hooks/useFollow'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import GuestRoute from './features/auth/components/GuestRoute'
import HomePage from './features/home/pages/HomePage'
import Login from './features/auth/pages/Login'
import Register from "./features/auth/pages/Register"
import Dashboard from './features/Dashboard/Pages/Dashboard'
import CreateProject from './features/projects/pages/CreateProject'
import EditProject from './features/projects/pages/EditProject'
import MyProjects from './features/projects/pages/MyProjects'
import ProjectWorkspace from './features/projects/pages/ProjectWorkspace'
import PublicProfile from './features/profile/pages/PublicProfile'
import FollowersPage from './features/profile/pages/FollowersPage'
import FollowingPage from './features/profile/pages/FollowingPage'
import Discover from './features/discover/pages/Discover'
import Activity from './features/activity/pages/Activity'
import Community from './features/community/pages/Community'
import SearchPage from './features/search/pages/SearchPage'
import SearchShortcut from './features/search/components/SearchShortcut'
import SettingsPage from './features/settings/pages/SettingsPage'
import Graveyard from './features/graveyard/pages/Graveyard'
import CreateFeedbackRequest from './features/feedback/pages/CreateFeedbackRequest'
import ProjectFeedback from './features/feedback/pages/ProjectFeedback'
import GitHubCallback from './features/github/pages/GitHubCallback'
import ShowcaseProject from './features/showcase/pages/ShowcaseProject'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ClerkProvider>
          <QueryProvider>
            <AuthProvider>
              <FollowsProvider>
                <SearchShortcut />
                <Routes>
                  <Route path="/" element={<GuestRoute><HomePage /></GuestRoute>} />
                  <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                  <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                  <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
                  <Route path="/discover" element={<Discover />} />
                  <Route path="/showcase/:id" element={<ShowcaseProject />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/graveyard" element={<Graveyard />} />
                  <Route path="/profile/:username" element={<PublicProfile />} />
                  <Route path="/profile/:username/followers" element={<FollowersPage />} />
                  <Route path="/profile/:username/following" element={<FollowingPage />} />
                  <Route path="/github/link-callback" element={<GitHubCallback />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                  <Route path="/projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
                  <Route path="/projects/new" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                  <Route path="/projects/:id" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
                  <Route path="/projects/:id/edit" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
                  <Route path="/projects/:id/feedback" element={<ProtectedRoute><ProjectFeedback /></ProtectedRoute>} />
                  <Route path="/projects/:id/feedback/new" element={<ProtectedRoute><CreateFeedbackRequest /></ProtectedRoute>} />
                  <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/settings/:tab" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                </Routes>
                <Analytics />
              </FollowsProvider>
            </AuthProvider>
          </QueryProvider>
        </ClerkProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
