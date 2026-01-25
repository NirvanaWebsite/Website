import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Blogs from './pages/Blogs';
import Hero from './components/Hero';
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

const Home = () => (
  <>
    <Hero />
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
      </Routes>
    </div>
  )
}

export default App
