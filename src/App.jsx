import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Other from './pages/Other';
// import './App.css';
function App (){
  
  return (
    <Router>
      <Header />
      <Nav />
      <div style={appStyles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-intro" element={<ProductIntro />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/functional-system" element={<FunctionalSystem />} />
          <Route path="/test-eval-system" element={<TestEvalSystem />} />
          <Route path="/parallel-twin-system" element={<ParallelTwinSystem />} />
          <Route path="/algorithm-dev-system" element={<AlgorithmDevSystem />} />
          <Route path="/data-vis-system" element={<DataVisSystem />} />
          <Route path="/target-detection" element={<TargetDetection />} />
          <Route path="/cloud-detection" element={<CloudDetection />} />
          <Route path="/image-compression" element={<ImageCompression />} />
          <Route path="/other" element={<Other />} />
        </Routes>
      </div>
    </Router>
  );
};
 const appStyles = {
  content: {
    marginLeft: '-100px',
    padding: '20px',
    paddingTop: '85px', // 确保内容不被固定的标题覆盖
  },
};
export default App;
