import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, PackageCheck, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import { artisanById } from '../data';
import { useApp } from '../store';
import { currency } from '../utils';
import { Button, ImageWithFallback } from '../components/UI';

export function CartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, removeFromCart, clearCart, notify } = useApp();
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const lines = data.cart.map((line) => ({ ...line, product: data.products.find((product) => product.id === line.productId) })).filter((line) => line.product);
  const total = lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.quantity, 0);
  const onCheckout = () => {
    if (!lines.length) return;
    setConfirmedTotal(total);
    setConfirmed(true);
    clearCart();
    notify('Demo order confirmed. No payment was collected.', 'success');
  };

  if (confirmed) return <div className="order-success content-width"><span className="order-success-icon"><CheckCircle2 size={30} /></span><span className="eyebrow-small">ORDER REQUEST · DEMO</span><h1>Thank you for choosing handmade.</h1><p>Your mock order is confirmed. This prototype does not collect payment or send a real order to an artisan.</p><div className="order-success-receipt"><span><PackageCheck size={16} /> KalaSetu order <b>#KS-{new Date().getFullYear()}-024</b></span><span>Amount shown <b>{currency(confirmedTotal)}</b></span><span>Payment status <b>Not collected · demo only</b></span></div><Button onClick={() => navigate('/marketplace')}>Continue exploring <ArrowRight size={16} /></Button></div>;

  return <div className="cart-page content-width"><div className="detail-breadcrumb"><Link to="/marketplace"><ArrowLeft size={14} /> Continue shopping</Link><span>/</span><span>Your bag</span></div><div className="cart-heading"><div><span className="eyebrow-small">A LITTLE CRAFT, ON ITS WAY</span><h1>Your bag <span>{lines.reduce((sum, line) => sum + line.quantity, 0)}</span></h1><p>{searchParams.get('checkout') ? 'Take one last look before placing your demo order.' : 'Every piece is made by hand, with a story attached.'}</p></div><ShoppingBag size={26} /></div>
    {lines.length ? <div className="cart-layout"><section className="cart-items">{lines.map(({ product, quantity }) => product && <article className="cart-line" key={product.id}><Link to={`/products/${product.id}`} className="cart-line-image"><ImageWithFallback src={product.image} alt={product.name} /></Link><div className="cart-line-content"><span>{product.craft}</span><Link to={`/products/${product.id}`}><h2>{product.name}</h2></Link><p>Handmade by {artisanById(product.artisanId)?.name}</p><div className="cart-line-bottom"><span>Qty {quantity}</span><button className="remove-item" onClick={() => removeFromCart(product.id)}><Trash2 size={13} /> Remove</button></div></div><strong className="cart-line-price">{currency(product.price * quantity)}</strong></article>)}</section><aside className="cart-summary"><span className="eyebrow-small">ORDER SUMMARY</span><h2>A fair price, all the way through.</h2><div className="cart-summary-row"><span>Items subtotal</span><strong>{currency(total)}</strong></div><div className="cart-summary-row"><span>Delivery</span><strong>Included</strong></div><div className="cart-summary-total"><span>Demo total</span><strong>{currency(total)}</strong></div><Button size="large" fullWidth onClick={onCheckout}>Place demo order <ArrowRight size={16} /></Button><p className="cart-demo-warning"><ShieldCheck size={15} /> No payment is collected. This is a local prototype order.</p><Link className="cart-back-link" to="/marketplace"><ArrowLeft size={14} /> Keep exploring</Link></aside></div> : <div className="cart-empty"><span className="cart-empty-icon"><ShoppingBag size={25} /></span><h2>Your bag is waiting for a good story.</h2><p>Browse handmade pieces and meet the people who made them.</p><Button onClick={() => navigate('/marketplace')}>Explore the marketplace <ArrowRight size={16} /></Button></div>}
  </div>;
}
