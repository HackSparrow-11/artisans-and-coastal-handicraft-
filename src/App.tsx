import { Link, Route, Routes } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { AppFooter, AppHeader, ToastRegion } from './components/AppShell';
import { Button } from './components/UI';
import { ArtisanDashboardPage } from './pages/ArtisanDashboard';
import { AddProductPage } from './pages/AddProduct';
import { CartPage } from './pages/Cart';
import { CollaborationPage, TaskDetailPage, WorkerDashboardPage } from './pages/Collaboration';
import { CoordinatorPage } from './pages/Coordinator';
import { LandingPage, RoleSelectionPage } from './pages/Landing';
import { MarketplacePage } from './pages/Marketplace';
import { ProductDetailPage, VerificationPage } from './pages/ProductDetail';
import { AppProvider } from './store';
import './styles.css';

function NotFoundPage() {
  return <div className="content-width not-found"><span className="not-found-icon"><Compass size={23} /></span><h1>Let's find the right path.</h1><p>This page isn't part of the KalaSetu demo yet.</p><div><Link to="/"><Button variant="outline" icon={<ArrowLeft size={15} />}>Go home</Button></Link><Link to="/marketplace"><Button>Explore marketplace <ArrowRight size={15} /></Button></Link></div></div>;
}

export default function App() {
  return <AppProvider><div className="app-frame"><AppHeader /><main className="main-content"><Routes><Route path="/" element={<LandingPage />} /><Route path="/roles" element={<RoleSelectionPage />} /><Route path="/marketplace" element={<MarketplacePage />} /><Route path="/artisan" element={<ArtisanDashboardPage />} /><Route path="/artisan/new" element={<AddProductPage />} /><Route path="/products/:productId" element={<ProductDetailPage />} /><Route path="/verify/:productId" element={<VerificationPage />} /><Route path="/collaboration" element={<CollaborationPage />} /><Route path="/worker" element={<WorkerDashboardPage />} /><Route path="/tasks/:taskId" element={<TaskDetailPage />} /><Route path="/coordinator" element={<CoordinatorPage />} /><Route path="/cart" element={<CartPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></main><AppFooter /><ToastRegion /></div></AppProvider>;
}
