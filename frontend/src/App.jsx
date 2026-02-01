import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Blogs from './pages/Blogs';
import Hero from './components/Hero';
import IntroductionVideo from './components/IntroductionVideo';
import CommunityPulse from './components/CommunityPulse';
import MemberSpotlight from './components/MemberSpotlight';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';

import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Mission from './pages/Mission';
import Members from './pages/Members';
import ManageMembers from './pages/ManageMembers';
import ManageBlogs from './pages/ManageBlogs';
import ManageApplications from './pages/ManageApplications';
import MyBlogs from './pages/MyBlogs';
import ReviewBlogs from './pages/ReviewBlogs';
import BugReport from './pages/BugReport';
import BugManagement from './pages/BugManagement';
import BugDetail from './pages/BugDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import ManageEvents from './pages/ManageEvents';
import CreateEvent from './pages/CreateEvent';

const Home = () => (
  <>
    <Hero />
    <IntroductionVideo />
    <CommunityPulse />
    <MemberSpotlight />
    <Contact />
    <Footer />
  </>
);

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/members" element={<Members />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        <Route
          path="/manage-members"
          element={
            <SignedIn>
              <ManageMembers />
            </SignedIn>
          }
        />
        <Route
          path="/manage-blogs"
          element={
            <SignedIn>
              <ManageBlogs />
            </SignedIn>
          }
        />
        <Route
          path="/manage-applications"
          element={
            <SignedIn>
              <ManageApplications />
            </SignedIn>
          }
        />
        <Route
          path="/my-blogs"
          element={
            <SignedIn>
              <MyBlogs />
            </SignedIn>
          }
        />
        <Route
          path="/review-blogs"
          element={
            <SignedIn>
              <ReviewBlogs />
            </SignedIn>
          }
        />
        <Route
          path="/report-bug"
          element={
            <SignedIn>
              <BugReport />
            </SignedIn>
          }
        />
        <Route
          path="/manage-bugs"
          element={
            <SignedIn>
              <BugManagement />
            </SignedIn>
          }
        />
        <Route
          path="/manage-bugs/:id"
          element={
            <SignedIn>
              <BugDetail />
            </SignedIn>
          }
        />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route
          path="/manage-events"
          element={
            <SignedIn>
              <ManageEvents />
            </SignedIn>
          }
        />
        <Route
          path="/create-event"
          element={
            <SignedIn>
              <CreateEvent />
            </SignedIn>
          }
        />
      </Routes>
    </div>
  )
}

export default App
