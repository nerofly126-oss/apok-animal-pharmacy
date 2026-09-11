import type { ReactElement } from 'react';
import '../collection.css';
import '../collection-grid.css';
import '../collection-polish.css';
import '../collection-intro.css';

export default function CollectionPage(): ReactElement {
  return <main className="collection-page"><header className="collection-nav"><a className="brand" href="#home">APOK</a><a className="nav-book" href="#home">← Back to site</a></header><section className="collection-hero"><div><p className="eyebrow">Apok Agricultural Production · Awka</p><h1>Pet shop,<br/>properly stocked.</h1></div><div><p>Browse our in-store range of food, care essentials, carriers, leads and more.</p><a href="#collection-grid">Explore products ↓</a></div></section><section className="collection-content" id="collection-grid"><div className="collection-intro"><p className="eyebrow">In store collection</p><h2>Browse what’s on our shelves.</h2></div><div className="collection-feature"><img loading="lazy" decoding="async" src="/products/catalogue/product-13.jpeg" alt="Apok pet shop collection"/><div><p className="eyebrow">In store now</p><h2>Everything for their everyday.</h2><p>Find familiar food brands, care supplies and the little extras pets love.</p></div></div><div className="catalogue-gallery">{Array.from({ length: 26 }, (_, index) => <figure className={`tile tile-${index + 1}`} key={index}><img loading="lazy" decoding="async" src={`/products/catalogue/product-${String(index + 1).padStart(2, '0')}.jpeg`} alt={`Apok product ${index + 1}`}/><figcaption><span>Apok product</span><b>Available in store</b></figcaption></figure>)}</div></section></main>;
}
