import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BadgeCheck, CircleHelp, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { artisans } from '../data';
import { useApp } from '../store';
import { ProductCard } from '../components/ProductCard';
import { Button, Eyebrow, ImageWithFallback } from '../components/UI';

const categories = ['All craft', 'Embroidery', 'Weaving', 'Block printing', 'Pottery', 'Textiles', 'Home decor'];

export function MarketplacePage() {
  const { data } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All craft');
  const [reviewedOnly, setReviewedOnly] = useState(false);
  const products = useMemo(() => data.products.filter((product) => product.listed).filter((product) => {
    const maker = artisans.find((artisan) => artisan.id === product.artisanId);
    const text = `${product.name} ${product.craft} ${product.category} ${product.material} ${maker?.name ?? ''} ${maker?.location ?? ''}`.toLowerCase();
    return text.includes(query.toLowerCase().trim()) && (category === 'All craft' || product.category === category) && (!reviewedOnly || product.verificationStatus === 'approved');
  }), [data.products, query, category, reviewedOnly]);

  return <div className="marketplace-page content-width">
    <section className="marketplace-hero"><div className="marketplace-hero-copy"><Eyebrow>Thoughtful things, made by hand</Eyebrow><h1>Find the work.<br /><em>Meet the maker.</em></h1><p>Each piece carries a craft story, a fairer price and a window into how it was made.</p><div className="marketplace-hero-stats"><span><b>{data.products.filter((product) => product.listed).length}</b><small>handmade pieces</small></span><i /><span><b>4</b><small>maker communities</small></span><i /><span><b>4</b><small>journey moments</small></span></div></div><div className="marketplace-hero-art"><ImageWithFallback src="/images/block-print-runner.jpg" alt="An artisan block printing a cotton textile" /><div className="market-hero-note"><span className="hero-note-icon"><MapPin size={14} /></span><span><b>Bagru, Rajasthan</b><small>Meena at the print table</small></span><ArrowUpRight size={15} /></div><span className="market-hero-seal"><span>CRAFT<br />IS<br />CULTURE</span></span></div></section>

    <section className="market-browse-section"><div className="section-title-line market-title-line"><div><span className="eyebrow-small">THE KALASETU COLLECTION</span><h2>Find something made with meaning.</h2></div><span className="result-count">{products.length} pieces <span>·</span> slow-made, thoughtfully shared</span></div>
      <div className="market-filters"><label className="market-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search craft, maker or material" aria-label="Search products" />{query && <button onClick={() => setQuery('')} aria-label="Clear search">×</button>}</label><div className="market-filter-toggle"><SlidersHorizontal size={16} /><label><input type="checkbox" checked={reviewedOnly} onChange={(event) => setReviewedOnly(event.target.checked)} /><span>Community reviewed only</span></label><span className="filter-info" title="Review means the sample record was marked by a community coordinator, not independently authenticated."><CircleHelp size={15} /></span></div></div>
      <div className="category-filters" role="group" aria-label="Filter by craft category">{categories.map((item) => <button key={item} className={`category-chip${category === item ? ' category-chip-active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
      {products.length > 0 ? <div className="market-product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="market-empty"><span><Search size={23} /></span><h3>No pieces found yet.</h3><p>Try another craft, maker or search term.</p><Button variant="outline" size="small" onClick={() => { setQuery(''); setCategory('All craft'); setReviewedOnly(false); }}>Clear filters</Button></div>}
    </section>

    <section className="makers-section"><div className="makers-heading"><div><Eyebrow>People behind the process</Eyebrow><h2>Meet our makers.</h2><p>Craft lives in communities — and every maker brings their own story.</p></div><span className="makers-mark"><BadgeCheck size={18} /> Community profiles</span></div><div className="makers-grid">{artisans.map((artisan, index) => <article className="maker-card" key={artisan.id}><div className="maker-image-wrap"><ImageWithFallback src={artisan.image} alt={`${artisan.name}, ${artisan.craft}`} /><span className="maker-number">0{index + 1}</span></div><div className="maker-card-body"><span>{artisan.craft}</span><h3>{artisan.name}</h3><p><MapPin size={13} />{artisan.location}</p><span className="maker-years">{artisan.yearsExperience} years · {artisan.verified ? 'Profile details shared' : 'Profile in progress'}</span></div><Link to={data.products.find((product) => product.artisanId === artisan.id) ? `/products/${data.products.find((product) => product.artisanId === artisan.id)!.id}` : '/marketplace'} className="maker-card-arrow" aria-label={`Explore ${artisan.name}'s work`}><ArrowRight size={16} /></Link></article>)}</div></section>

    <section className="buyer-note-strip"><span className="buyer-note-icon"><Sparkles size={17} /></span><p><b>Made by hands, not a production line.</b> Product journeys are shared by makers and can be reviewed by a local coordinator. See exactly what has — and hasn't — been documented.</p><Link to="/roles" className="text-link">Explore KalaSetu <ArrowRight size={14} /></Link></section>
  </div>;
}
