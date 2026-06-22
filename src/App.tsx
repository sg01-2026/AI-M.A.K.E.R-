/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import HeritagePage from './pages/HeritagePage';
import ResourcesPage from './pages/ResourcesPage';
import ClubsPage from './pages/ClubsPage';
import StaffPage from './pages/StaffPage';
import PromotionPage from './pages/PromotionPage';
import ContestPage from './pages/ContestPage';
import ActivityPhotosPage from './pages/ActivityPhotosPage';
import HeritageMainPage from './pages/HeritageMainPage';
import HeritageArchivePage from './pages/HeritageArchivePage';

import PurposePage from './pages/PurposePage';
import MakerModelPage from './pages/MakerModelPage';

import BasicLearningPage from './pages/BasicLearningPage';
import Basic1Page from './pages/Basic1Page';
import Basic2Page from './pages/Basic2Page';
import Basic3Page from './pages/Basic3Page';
import AdvancedLearningPage from './pages/AdvancedLearningPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purpose" element={<PurposePage />} />
            <Route path="/maker-model" element={<MakerModelPage />} />
            <Route path="/project/:name" element={<HeritagePage />} />
            <Route path="/heritage" element={<HeritageMainPage />} />
            <Route path="/heritage-archive" element={<HeritageArchivePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/basics" element={<BasicLearningPage />} />
            <Route path="/basics/step1" element={<Basic1Page />} />
            <Route path="/basics/step2" element={<Basic2Page />} />
            <Route path="/basics/step3" element={<Basic3Page />} />
            <Route path="/advanced" element={<AdvancedLearningPage />} />
            <Route path="/clubs/:level" element={<ClubsPage />} />
            <Route path="/activity-photos" element={<ActivityPhotosPage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/promotion" element={<PromotionPage />} />
            <Route path="/contest" element={<ContestPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
