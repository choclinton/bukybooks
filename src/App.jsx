import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import StylistProfile from './pages/StylistProfile';
import Booking from './pages/Booking';
import StylistDashboard from './pages/StylistDashboard';
import ManageServices from './pages/ManageServices';
import ClientAppointments from './pages/ClientAppointments';
import AdminDashboard from './pages/AdminDashboard';
import StylistSetup from './pages/StylistSetup';
import LeaveReview from './pages/LeaveReview';
import ChatList from './pages/ChatList';
import ChatWindow from './pages/ChatWindow';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/discover" element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <Discover />
            </ProtectedRoute>
          } />
          <Route path="/stylist/dashboard" element={
            <ProtectedRoute allowedRoles={['stylist', 'admin']}>
              <StylistDashboard />
            </ProtectedRoute>
          } />
          <Route path="/stylist/services" element={
            <ProtectedRoute allowedRoles={['stylist', 'admin']}>
              <ManageServices />
            </ProtectedRoute>
          } />
          <Route path="/stylist/setup" element={
            <ProtectedRoute allowedRoles={['stylist', 'admin']}>
              <StylistSetup />
            </ProtectedRoute>
          } />
          <Route path="/stylist/:id" element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <StylistProfile />
            </ProtectedRoute>
          } />
          <Route path="/book/:id" element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="/client/appointments" element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <ClientAppointments />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          } />
          <Route path="/chat/:id" element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          } />
          <Route path="/review/:id" element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <LeaveReview />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
