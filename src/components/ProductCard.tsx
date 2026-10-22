import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { artisanById } from '../data';
import { currency, evidenceCount, statusLabel } from '../utils';
import { ImageWithFallback } from './UI';

export function ProductCard({ product }: { product: Product }) {
  const artisan = artisanById(product.artisanId);
  const count = evidenceCount(product.stages);
  return <article className="market-product-card">
    <Link to={`/products/${product.id}`} className="market-product-image-link" aria-label={`Open ${product.name}`}><ImageWithFallback className="market-product-image" src={product.image} alt={product.name} /><span className="market-product-category">{product.category}</span><span className="market-heart" aria-hidden="true"><Sparkles size={15} /></span></Link>
    <div className="market-product-body"><div className="product-card-meta"><span>{product.craft}</span><span className={product.verificationStatus === 'approved' ? 'verified-label' : 'journey-label'}>{product.verificationStatus === 'approved' ? <ShieldCheck size={13} /> : <Sparkles size={13} />}{product.verificationStatus === 'approved' ? 'Community reviewed' : count > 0 ? `${count}/4 moments` : statusLabel(product.verificationStatus)}</span></div><Link to={`/products/${product.id}`} className="market-product-name">{product.name}</Link><div className="market-maker-line"><span>by {artisan?.name ?? 'KalaSetu artisan'}</span><span><MapPin size={12} />{artisan?.location.split(',')[0] ?? 'India'}</span></div><div className="market-card-bottom"><strong>{currency(product.price)}</strong><Link to={`/products/${product.id}`} className="product-view-link">View product <ArrowUpRight size={15} /></Link></div></div>
  </article>;
}
