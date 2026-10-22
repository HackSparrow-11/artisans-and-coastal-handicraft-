import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Banknote, BookOpenCheck, BriefcaseBusiness, Camera, CirclePlus, Clock3, MapPin, Package, Sparkles, UsersRound } from 'lucide-react';
import { artisans } from '../data';
import { useApp } from '../store';
import { Button, ImageWithFallback, PageHeading, StatusTag } from '../components/UI';
import { currency, evidenceCount, statusLabel } from '../utils';

export function ArtisanDashboardPage() {
  const navigate = useNavigate();
  const { data } = useApp();
  const profile = artisans.find((artisan) => artisan.id === 'laxmi')!;
  const myProducts = data.products.filter((product) => product.artisanId === 'laxmi' && product.listed);
  const activeTasks = data.tasks.filter((task) => task.artisanId === 'laxmi' && task.status !== 'completed');

  return <div className="dashboard-page content-width">
    <PageHeading eyebrow="Artisan workspace · Dharwad" title="Namaskara, Laxmi." description="Your craft has a home here. Let's make it easy for the right people to find." action={<Button onClick={() => navigate('/artisan/new')} icon={<CirclePlus size={17} />}>Add a product</Button>} />

    <section className="artisan-profile-banner">
      <ImageWithFallback className="profile-banner-photo" src={profile.image} alt="Laxmi working on Kasuti embroidery" />
      <div className="profile-banner-shade" />
      <div className="profile-banner-content"><span className="profile-kicker"><Sparkles size={13} /> YOUR MAKER PROFILE</span><h2>Laxmi Hegde</h2><p>Kasuti embroidery artisan <span>·</span> {profile.yearsExperience} years of practice</p><div className="profile-meta"><span><MapPin size={15} />{profile.location}</span><span className="profile-status"><BadgeCheck size={15} />{statusLabel(data.artisanVerificationStatus)}</span></div></div>
      <div className="profile-banner-side"><div className="handmade-seal"><span>CRAFTED<br />WITH CARE</span><span className="seal-dot" /></div><span className="profile-banner-note">Your story travels<br />with every piece.</span></div>
    </section>

    <section className="stats-grid" aria-label="Your business at a glance">
      <article className="stat-card"><span className="stat-icon stat-icon-clay"><Package size={18} /></span><span className="stat-label">Listed products</span><strong>{myProducts.length}</strong><span className="stat-foot">{myProducts.length > 0 ? 'Your work is out in the world' : 'Start your first listing'}</span></article>
      <article className="stat-card"><span className="stat-icon stat-icon-blue"><BriefcaseBusiness size={18} /></span><span className="stat-label">Active orders</span><strong>3</strong><span className="stat-foot">One order ready for support</span></article>
      <article className="stat-card"><span className="stat-icon stat-icon-green"><Banknote size={18} /></span><span className="stat-label">Earnings this month</span><strong>{currency(18450)}</strong><span className="stat-foot">Direct from buyers</span></article>
      <article className="stat-card"><span className="stat-icon stat-icon-gold"><Clock3 size={18} /></span><span className="stat-label">Pending payments</span><strong>{currency(4200)}</strong><span className="stat-foot">Mock figures for the demo</span></article>
    </section>

    <section className="dashboard-content-grid">
      <div className="dashboard-main-column">
        <div className="section-title-line"><div><span className="eyebrow-small">YOUR CRAFT, IN VIEW</span><h2>My products</h2></div><Link to="/marketplace" className="text-link">View marketplace <ArrowRight size={15} /></Link></div>
        <div className="artisan-products-list">
          {myProducts.slice(0, 4).map((product) => <article className="artisan-product-row" key={product.id}><Link to={`/products/${product.id}`} className="artisan-product-thumb"><ImageWithFallback src={product.image} alt={product.name} /></Link><div className="artisan-product-info"><Link to={`/products/${product.id}`} className="product-row-name">{product.name}</Link><span>{product.craft} <i>·</i> {evidenceCount(product.stages)} of 4 moments shared</span></div><strong className="artisan-product-price">{currency(product.price)}</strong><StatusTag status={product.verificationStatus} compact /><Link className="row-arrow" to={`/products/${product.id}`} aria-label={`View ${product.name}`}><ArrowRight size={17} /></Link></article>)}
          {myProducts.length === 0 && <div className="empty-state"><Package size={25} /><p>Your first product will appear here after you publish it.</p><Button size="small" onClick={() => navigate('/artisan/new')}>Create a listing</Button></div>}
        </div>
        <div className="story-value-card"><span className="story-value-icon"><BookOpenCheck size={19} /></span><div><b>Your story helps your work stand out.</b><p>Making photos and a clear price breakdown help buyers see the time, skill and care inside every piece.</p><Link to="/artisan/new" className="text-link">Build a product journey <ArrowRight size={14} /></Link></div><div className="story-value-decoration">ಕಲೆ</div></div>
      </div>

      <aside className="dashboard-side-column">
        <div className="quick-actions-card"><span className="eyebrow-small">WHAT WOULD YOU LIKE TO DO?</span><h3>Keep your craft moving.</h3><button onClick={() => navigate('/artisan/new')} className="quick-action"><span className="quick-action-icon clay-action"><CirclePlus size={18} /></span><span><b>Add a product</b><small>Tell its story and set a fair price</small></span><ArrowRight size={16} /></button><button onClick={() => navigate('/marketplace')} className="quick-action"><span className="quick-action-icon blue-action"><Package size={18} /></span><span><b>My products</b><small>See your work as buyers do</small></span><ArrowRight size={16} /></button><button onClick={() => navigate('/collaboration')} className="quick-action"><span className="quick-action-icon green-action"><UsersRound size={18} /></span><span><b>Hire local help</b><small>Bring skilled neighbours into an order</small></span><ArrowRight size={16} /></button></div>
        <div className="collab-mini-card"><div className="collab-mini-top"><span className="collab-mini-icon"><UsersRound size={17} /></span><span className="tiny-live-dot" /> COMMUNITY WORK</div><h3>{activeTasks.length} task{activeTasks.length === 1 ? '' : 's'} moving locally</h3><p>When a larger order needs extra hands, you can work with people who already know the craft.</p><Link to={activeTasks[0] ? `/tasks/${activeTasks[0].id}` : '/collaboration'} className="text-link">{activeTasks[0] ? 'See task progress' : 'Post a task'} <ArrowRight size={14} /></Link></div>
      </aside>
    </section>
  </div>;
}
