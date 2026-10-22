import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, BadgeCheck, BookOpenCheck, Camera, CircleDollarSign, HandHeart, HeartHandshake, Leaf, MapPin, MoveUpRight, PackageCheck, Sparkles, UsersRound } from 'lucide-react';
import { artisans, initialProducts } from '../data';
import { useApp } from '../store';
import { Button, Eyebrow, ImageWithFallback } from '../components/UI';
import { currency, evidenceCount } from '../utils';

const values = [
  { icon: CircleDollarSign, title: 'Fair value for every craft', body: 'See the materials, time and care behind a price — then choose what feels right.' },
  { icon: BookOpenCheck, title: 'Know who made your product', body: 'Follow the making journey and meet the skilled hands behind every piece.' },
  { icon: HeartHandshake, title: 'Local skills create opportunity', body: 'Artisans can bring in nearby helpers and share the credit for every contribution.' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { data } = useApp();
  const featured = data.products.find((product) => product.id === 'kasuti-blouse') ?? initialProducts[0];
  const artisan = artisans.find((person) => person.id === featured.artisanId)!;

  return (
    <div className="landing-page">
      <section className="hero-section content-width">
        <div className="hero-copy">
          <Eyebrow>Made by hand. Valued by heart.</Eyebrow>
          <h1>Every handmade product has a story. <em>Let the world see it.</em></h1>
          <p className="hero-description">A direct connection between Indian artisans and thoughtful buyers — with fair prices, honest craft stories and a making journey you can follow.</p>
          <div className="hero-actions">
            <Button size="large" onClick={() => navigate('/marketplace')} icon={<ArrowRight size={18} />}>Explore marketplace</Button>
            <Link to="/roles" className="text-link large-link">Get started <ArrowUpRight size={16} /></Link>
          </div>
          <div className="hero-proof-row">
            <div className="avatar-stack"><ImageWithFallback src="/images/kasuti-hero.png" alt="KalaSetu artisan" /><ImageWithFallback src="/images/artisan-portrait.jpg" alt="Craft worker" /><ImageWithFallback src="/images/embroidery-color.jpg" alt="Handmade embroidery" /></div>
            <div><strong>Craft, with its people in view.</strong><span>Rooted in community. Ready for the world.</span></div>
          </div>
        </div>
        <div className="hero-visual-wrap">
          <div className="hero-image-frame"><ImageWithFallback className="hero-image" src="/images/kasuti-hero.png" alt="A Karnataka artisan stitching Kasuti embroidery by hand" /></div>
          <div className="hero-image-caption"><span className="caption-pin"><MapPin size={14} /></span><span><b>Laxmi's Kasuti, Dharwad</b><small>18 years of careful stitching</small></span><span className="caption-arrow"><ArrowUpRight size={16} /></span></div>
          <div className="hero-proof-card"><span className="proof-icon"><Camera size={17} /></span><div><b>A journey, not just a label</b><small>{evidenceCount(featured.stages)} of 4 making moments shared</small></div><span className="proof-check"><BadgeCheck size={17} /></span></div>
          <span className="hero-spark hero-spark-one" aria-hidden="true" /><span className="hero-spark hero-spark-two" aria-hidden="true" />
        </div>
      </section>

      <section className="promise-band content-width" aria-label="KalaSetu impact">
        <span><strong>01</strong> Fair pricing</span><i />
        <span><strong>02</strong> Visible provenance</span><i />
        <span><strong>03</strong> Community collaboration</span>
      </section>

      <section className="value-section content-width" id="why-kalasetu">
        <div className="section-intro"><Eyebrow>A better way to buy handmade</Eyebrow><h2>Good craft deserves <em>good context.</em></h2><p>KalaSetu brings the value, journey and people behind a handmade piece into one thoughtful experience.</p></div>
        <div className="value-grid">
          {values.map(({ icon: Icon, title, body }, index) => <article className="value-card" key={title}><span className={`value-icon value-icon-${index}`}><Icon size={20} strokeWidth={1.8} /></span><span className="value-index">0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="featured-strip content-width">
        <div className="featured-copy"><Eyebrow>In focus · the maker's mark</Eyebrow><h2>A little stitch. <em>A lot of story.</em></h2><p>Discover a Kasuti garden motif, carefully counted and stitched by Laxmi Hegde in Dharwad, Karnataka.</p><Link to={`/products/${featured.id}`} className="text-link">Meet this piece <ArrowRight size={16} /></Link><div className="feature-stat"><span><strong>{featured.pricing.artisanHours} hrs</strong><small>of artisan time</small></span><span><strong>{currency(featured.price)}</strong><small>fair suggested price</small></span></div></div>
        <Link to={`/products/${featured.id}`} className="featured-product-card"><ImageWithFallback src={featured.image} alt={featured.name} /><div className="featured-product-label"><div><span>Kasuti embroidery</span><h3>{featured.name}</h3></div><span className="round-arrow"><ArrowUpRight size={18} /></span></div><span className="featured-stamp"><span>HAND<br />MADE</span><Leaf size={15} /></span></Link>
      </section>

      <section className="how-section content-width" id="how-it-works">
        <div className="how-heading"><Eyebrow>Simple by design</Eyebrow><h2>From skilled hands<br />to the right home.</h2><p>Three thoughtful steps. More value carried all the way through.</p></div>
        <div className="how-steps">
          <article className="how-step"><span className="step-number">01</span><span className="how-icon"><Sparkles size={20} /></span><h3>Artisans create</h3><p>Share a product, its story and the time and materials that shape a fair price.</p><span className="step-thread" /></article>
          <article className="how-step"><span className="step-number">02</span><span className="how-icon how-icon-ochre"><ArrowUpRight size={20} /></span><h3>Buyers discover</h3><p>Choose meaningful handmade work and see the journey behind the finish.</p><span className="step-thread" /></article>
          <article className="how-step"><span className="step-number">03</span><span className="how-icon how-icon-green"><UsersRound size={20} /></span><h3>Every contribution counts</h3><p>Local skilled workers join larger orders — with their work visible too.</p></article>
        </div>
      </section>

      <section className="artisan-invite content-width">
        <div className="invite-image"><ImageWithFallback src="/images/artisan-portrait.jpg" alt="A craftsperson painting handmade pottery" /><span className="invite-image-tag"><MapPin size={13} /> Built around local craft</span></div>
        <div className="invite-copy"><Eyebrow>For makers and collectives</Eyebrow><h2>More than a marketplace.<br /><em>A bridge between people.</em></h2><p>Give your work a fair starting point, show how it came to be, and find trusted hands when a bigger order arrives.</p><Link to="/roles" className="btn btn-secondary">See the artisan experience <MoveUpRight size={17} /></Link><div className="invite-note"><HandHeart size={16} /> Designed with artisans, not just for transactions.</div></div>
      </section>

      <section className="bottom-cta content-width"><div><Eyebrow light>Craft has a place here</Eyebrow><h2>Come closer to the work.</h2><p>Find your way into the KalaSetu community.</p></div><div className="bottom-cta-actions"><Button variant="secondary" size="large" onClick={() => navigate('/marketplace')}>Explore the marketplace <ArrowRight size={16} /></Button><Link to="/roles" className="cta-light-link">Choose a demo role <ArrowDown size={15} /></Link></div><span className="cta-decoration" aria-hidden="true" /></section>
    </div>
  );
}

const roleCards = [
  { role: 'artisan' as const, label: 'Artisan', name: 'Laxmi · Kasuti embroidery', body: 'Create a listing, find a fair price and connect with local helpers.', icon: Sparkles, path: '/artisan', tone: 'role-artisan' },
  { role: 'buyer' as const, label: 'Buyer', name: 'Explore handmade work', body: 'Meet makers, see how a product was made and shop with context.', icon: PackageCheck, path: '/marketplace', tone: 'role-buyer' },
  { role: 'worker' as const, label: 'Worker', name: 'Sunita · Textile finishing', body: 'View an assignment, share progress and make your contribution visible.', icon: HandHeart, path: '/worker', tone: 'role-worker' },
  { role: 'coordinator' as const, label: 'SHG Coordinator', name: 'Annapurna · Community review', body: 'Review artisan details and evidence with care and clear next steps.', icon: BadgeCheck, path: '/coordinator', tone: 'role-coordinator' },
];

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { setRole, notify } = useApp();
  const chooseRole = (role: typeof roleCards[number]['role'], path: string) => {
    setRole(role);
    notify(`Welcome to the ${roleCards.find((item) => item.role === role)?.label} experience.`, 'info');
    navigate(path);
  };
  return <div className="roles-page content-width"><div className="roles-intro"><Eyebrow>Explore KalaSetu</Eyebrow><h1>Choose a perspective.<br /><em>See the full connection.</em></h1><p>No sign-in or long setup. Jump straight into a working demo and switch roles whenever you like.</p></div><div className="role-grid">{roleCards.map(({ role, label, name, body, icon: Icon, path, tone }, index) => <button key={role} className={`role-card ${tone}`} onClick={() => chooseRole(role, path)}><span className="role-card-top"><span className="role-card-icon"><Icon size={21} /></span><span className="role-card-number">0{index + 1}</span></span><span className="role-label">{label}</span><strong>{name}</strong><span className="role-card-body">{body}</span><span className="role-card-bottom">Enter this experience <ArrowRight size={16} /></span></button>)}</div><div className="roles-note"><UsersRound size={17} /><span>Every role shares the same local demo data, so changes in one view appear in the others.</span></div></div>;
}
