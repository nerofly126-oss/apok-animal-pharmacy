import { useState } from 'react';
import type { ReactElement } from 'react';
import '../collection.css';
import '../collection-grid.css';
import '../collection-polish.css';
import '../collection-intro.css';
import '../collection-orders.css';

export default function CollectionPage(): ReactElement {
  const [cart, setCart] = useState<Record<number, number>>({});
  const products = Array.from({ length: 63 }, (_, index) => index + 1);
  const cartItems = products.filter((id) => cart[id]);
  const itemCount = cartItems.reduce((total, id) => total + cart[id], 0);
  const changeQuantity = (id: number, amount: number): void => setCart((current) => {
    const nextQuantity = (current[id] || 0) + amount;
    const next = { ...current };
    if (nextQuantity <= 0) delete next[id]; else next[id] = nextQuantity;
    return next;
  });
  const checkout = (): void => {
    const list = cartItems.map((id) => {
      return `• Quantity: ${cart[id]}\n  Image: ${window.location.origin}/products/catalogue-2026/image-${id}.jpg`;
    }).join('\n');
    const message = `Hello APOK, I would like to order:\n${list}\n\nPlease confirm availability, price and delivery or pickup options.`;
    window.open(`https://wa.me/2348039778902?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  return <main className="collection-page"><header className="collection-nav"><a className="brand" href="#home">APOK</a><a className="nav-book" href="#home">← Back to site</a></header><section className="collection-hero"><div><p className="eyebrow">Apok Agricultural Production · Awka</p><h1>Pet shop,<br/>properly stocked.</h1></div><div><p>Choose products below, then send your order directly to APOK on WhatsApp.</p></div></section><section className="collection-content" id="collection-grid"><div className="collection-intro"><p className="eyebrow">Order from our collection</p><h2>Pick what you need.</h2><p>Add items to your order. APOK will confirm current stock and pricing on WhatsApp.</p></div><div className="collection-feature"><img loading="lazy" decoding="async" src="/products/catalogue-2026/image-13.jpg" alt="Product collection"/><div><p className="eyebrow">In store now</p><h2>Everything for their everyday.</h2><p>Find familiar food brands, care supplies and the little extras pets love.</p></div></div><div className="catalogue-gallery">{products.map((id) => <figure className={`tile tile-${id}`} key={id}><img loading="lazy" decoding="async" src={`/products/catalogue-2026/image-${id}.jpg`} alt="Product image"/><figcaption>{cart[id] ? <span className="quantity-controls"><button type="button" onClick={() => changeQuantity(id, -1)} aria-label="Remove one item">−</button><b>{cart[id]}</b><button type="button" onClick={() => changeQuantity(id, 1)} aria-label="Add one more item">+</button></span> : <button type="button" onClick={() => changeQuantity(id, 1)}>Add to order</button>}</figcaption></figure>)}</div></section>{itemCount > 0 && <aside className="order-bar" aria-live="polite"><span><b>{itemCount}</b> {itemCount === 1 ? 'item' : 'items'} in your order</span><button type="button" onClick={checkout}>Checkout on WhatsApp ↗</button></aside>}</main>;
}
