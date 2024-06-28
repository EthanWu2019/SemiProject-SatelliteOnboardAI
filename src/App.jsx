// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Home from './pages/Home';
import ProductIntro from './pages/ProductIntro';
import Workflow from './pages/Workflow';
import FunctionalSystem from './pages/FunctionalSystem';
import TestEvalSystem from './pages/TestEvalSystem';
import ParallelTwinSystem from './pages/ParallelTwinSystem';
import AlgorithmDevSystem from './pages/AlgorithmDevSystem';
import DataVisSystem from './pages/DataVisSystem';
import TargetDetection from './pages/TargetDetection';
import CloudDetection from './pages/CloudDetection';
import ImageCompression from './pages/ImageCompression';
import LoginRegister from './pages/LoginRegister';
import Other from './pages/Other';
import Admin_Dashboard from './pages/Admin_Dashboard';
import UserManagement from './pages/UserManagement';
import ScrollToTopButton from './components/ScrollToTopButton';
import { AuthProvider } from './pages/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
}

function Main() {
  const location = useLocation();
  const hideHeaderAndNav = location.pathname === '/';
  const hideScrollToTopButton = ['/'].includes(location.pathname);

  return (
    <>
      {!hideHeaderAndNav && <Header />}
      {!hideHeaderAndNav && <Nav />}
      <div style={appStyles.content}>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/Admin_Dashboard" element={<ProtectedRoute component={Admin_Dashboard} />} />
          <Route path="/user-management" element={<ProtectedRoute component={UserManagement} />} />
          <Route path="/Home" element={<ProtectedRoute component={Home} />} />
          <Route path="/product-intro" element={<ProtectedRoute component={ProductIntro} />} />
          <Route path="/workflow" element={<ProtectedRoute component={Workflow} />} />
          <Route path="/functional-system" element={<ProtectedRoute component={FunctionalSystem} />} />
          <Route path="/test-eval-system" element={<ProtectedRoute component={TestEvalSystem} />} />
          <Route path="/parallel-twin-system" element={<ProtectedRoute component={ParallelTwinSystem} />} />
          <Route path="/algorithm-dev-system" element={<ProtectedRoute component={AlgorithmDevSystem} />} />
          <Route path="/data-vis-system" element={<ProtectedRoute component={DataVisSystem} />} />
          <Route path="/target-detection" element={<ProtectedRoute component={TargetDetection} />} />
          <Route path="/cloud-detection" element={<ProtectedRoute component={CloudDetection} />} />
          <Route path="/image-compression" element={<ProtectedRoute component={ImageCompression} />} />
          <Route path="/other" element={<ProtectedRoute component={Other} />} />
        </Routes>
      </div>
      {!hideScrollToTopButton && <ScrollToTopButton />}
    </>
  );
}

const appStyles = {
  content: {
    marginLeft: '-100px',
    padding: '20px',
    paddingTop: '85px', // 确保内容不被固定的标题覆盖
  },
};

export default App;
