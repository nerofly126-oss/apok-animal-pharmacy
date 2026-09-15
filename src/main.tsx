import { lazy, Suspense, useEffect, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { api } from './api';
import './styles.css';
import './footer.css';
import './mobile.css';
import './products.css';
import './navbar.css';
import './shop.css';
import './home-cta.css';
import './catalogue.css';
import './mobile-tight.css';
import './bento-fit.css';
import './loader.css';
import './brand.css';
import './menu.css';
import './booking.css';
import './icons.css';
import './departments.css';
import './brand-agriculture.css';
import './motion.css';
import './mobile-final.css';

const AdminAccess = lazy(() => import('./pages/AdminPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));

const ArrowIcon = ({ direction = 'right' }: { direction?: 'right' | 'down' | 'down-right' | 'left' }): ReactElement => <svg className={`icon icon-${direction}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SparkIcon = (): ReactElement => <svg className="hero-star" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 1c2.1 11.4 7.6 16.9 19 19-11.4 2.1-16.9 7.6-19 19-2.1-11.4-7.6-16.9-19-19C12.4 17.9 17.9 12.4 20 1Z" fill="currentColor"/></svg>;
const PhoneIcon = (): ReactElement => <svg className="contact-phone" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9.3 7l-1.7 2.1c1.1 2.3 2.9 4.1 5.2 5.2l2.1-1.7 3.5 2.7-1 3.6c-.2.7-.9 1.2-1.7 1.1C8.8 19.3 4.7 15.2 4 8.3c-.1-.8.4-1.5 1.1-1.7l1.5-3.1Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>;
const HeartIcon = (): ReactElement => <svg className="quote-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.3 5.3 0 0 0-7.5 0L12 6.1l-1.3-1.3a5.3 5.3 0 1 0-7.5 7.5L12 21l8.8-8.7a5.3 5.3 0 0 0 0-7.5Z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
const testimonials = [
  { quote: '“They kept Biscuit calm, explained every step, and treated us like family.”', person: 'Rebecca M. · Biscuit’s person' },
  { quote: '“The APOK team made getting the right medication for our dog so easy.”', person: 'Ada N. · Bruno’s person' },
  { quote: '“Helpful, practical advice for our animals—and always a warm welcome.”', person: 'Chinedu O. · Farm customer' },
];
function Testimonial(): ReactElement { const [active, setActive] = useState(0); const reducedMotion = useReducedMotion(); useEffect(() => { const interval = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 5000); return () => window.clearInterval(interval); }, []); const testimonial = testimonials[active]; return <section className="quote"><HeartIcon /><AnimatePresence mode="wait"><motion.div key={testimonial.person} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -12 }} transition={{ duration: 0.35 }}><blockquote>{testimonial.quote}</blockquote><p>{testimonial.person}</p></motion.div></AnimatePresence><div className="testimonial-dots" aria-label="Rotating testimonials">{testimonials.map((item, index) => <button key={item.person} type="button" className={index === active ? 'active' : ''} aria-label={`Show testimonial ${index + 1}`} onClick={() => setActive(index)} />)}</div></section> }

function ClinicSite(): ReactElement {
  const [bookingMessage, setBookingMessage] = useState('');
  const submitBooking = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;
    setBookingMessage('Sending your request…');
    const formData = new FormData(form);
    try {
      await api.createBooking({
        owner_name: String(formData.get('owner_name') || ''), animal_name: String(formData.get('animal_name') || ''),
        phone: String(formData.get('phone') || ''), service: String(formData.get('service') || ''),
      });
      form.reset(); setBookingMessage('Request received — we’ll contact you shortly.');
    } catch {
      setBookingMessage('We could not send your request. Please try again or call us.');
    }
  };
  return <main>
    <section className="hero" id="home">
      <nav><a className="brand" href="#home">APOK</a><div className="links"><a href="#animal">Animal</a><a href="#plant">Plant</a><a href="#products">Products</a><a href="#about">About</a><a href="#contact">Contact</a></div><a className="nav-book" href="#contact">Book a visit</a><details className="mobile-menu"><summary aria-label="Open navigation"><span></span><span></span><span></span></summary><div><a href="#animal">Animal department</a><a href="#plant">Plant department</a><a href="#products">Products</a><a href="#about">About</a><a href="#contact">Contact</a><a className="menu-book" href="#contact">Book a visit <ArrowIcon /></a></div></details></nav>
      <div className="hero-copy"><small>Apok agricultural production</small><h1>Growing<br/>Better,<br/>Caring<br/>Further.</h1><p>Plant and animal solutions for healthier farms, happier pets and thriving communities.</p><div className="hero-actions"><a className="button black" href="#animal">Animal department</a><a className="button yellow" href="#plant">Plant department</a></div></div>
      <SparkIcon /><img className="hero-dog" src="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=90" alt="Happy brown dog" />
    </section>
    <motion.section className="services" id="animal" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}><div className="services-heading"><p className="eyebrow">Animal department</p><h2>Care for every<br/>kind.</h2><p>Veterinary treatment, animal medicines and carefully selected pets—all in one place.</p></div><div className="service-grid">{[['Veterinary clinic', 'Diagnosis, treatment and preventive care for your animals.'], ['Animal pharmacy', 'Medicines, supplements and essentials from trusted brands.'], ['Pets for sale', 'Dogs, cats, rabbits, monkeys and more—ask about availability.'], ['Emergency care', 'Responsive support when your animal needs care urgently.'], ['Grooming & wellness', 'Everyday care for happy, healthy companion animals.'], ['Farm & herd', 'Practical support for livestock and larger animal needs.']].map(([service, description]) => <motion.article key={service} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}><b><ArrowIcon direction="down-right"/></b><h3>{service}</h3><p>{description}</p></motion.article>)}</div></motion.section>
    <motion.section className="plant" id="plant" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}><div className="plant-image"></div><div className="plant-copy"><p className="eyebrow">Plant department</p><h2>Built for better harvests.</h2><p>From planting to harvest, APOK supports farmers with quality agricultural products, practical guidance and dependable supply.</p><div className="plant-list"><span>Crop protection</span><span>Seeds & inputs</span><span>Farm essentials</span></div><a href="#contact">Talk to our team <ArrowIcon /></a></div></motion.section>
    <section className="shop" id="products"><div className="shop-heading"><div><p className="eyebrow">From our shelves</p><h2>Pet shop essentials.</h2></div><p>Food, carriers, treats and everyday accessories for the animals you love.</p></div><div className="shop-grid">{[['/products/dog-food.jpeg', 'Dog food', 'Chiwawa and Club 4 Paws food'], ['/products/nodule-pet-food.jpeg', 'Nodule pet food', 'Delicious food for dogs and cats'], ['/products/collars-leads.jpeg', 'Collars & leads', 'For every walk'], ['/products/cat-treats.jpeg', 'Cat treats', 'A little something special'], ['/products/pet-carriers.jpeg', 'Pet carriers', 'Safe, comfortable trips'], ['/products/pet-shampoo.jpeg', 'Pet shampoo', 'Fresh coat care for pets'], ['/products/retractable-leads.jpeg', 'Retractable leads', 'Easy walks, better control']].map(([image, title, description]) => <article key={title}><img loading="lazy" decoding="async" src={image} alt={title}/><div><h3>{title}</h3><p>{description}</p></div></article>)}</div><a className="collection-link" href="#collection">View full product collection →</a></section>
    <section className="about" id="about"><div className="about-cut"></div><div className="megaphone">◖</div><div className="about-content"><p className="eyebrow">About APOK</p><h2>Agriculture with heart.</h2><article><h3>Plant and animal, together</h3><p>APOK Agricultural Production brings together animal health, pet care and plant-focused agricultural support under one trusted local business.</p></article><article><h3>Care that works in real life</h3><p>Whether you are raising a pet, managing livestock or tending crops, we pair practical products with genuine, knowledgeable support.</p></article><div className="mini-stats"><span><b>2</b>departments</span><span><b>1</b>trusted team</span></div><a className="button black" href="#contact">Talk to APOK</a></div></section>
    <Testimonial />
    <section className="contact" id="contact"><div className="contact-copy"><p className="eyebrow">Come say hello</p><h2>Let’s look after<br/>them.</h2><div><p>No. 128 Enu-Ifite<br/>Awka, Anambra State</p><p className="phone-line"><PhoneIcon /><span><a href="tel:+2348039778902">0803 977 8902</a><br/><a href="tel:+2347003666535">0700 366 6535</a></span></p><p>Contact us to arrange your visit.</p></div></div><div className="contact-form"><p className="eyebrow">Request an appointment</p><form onSubmit={submitBooking}><label>Your name<input name="owner_name" aria-label="Your name" required /></label><label>Animal's name<input name="animal_name" aria-label="Animal's name" required /></label><label>Phone number<input name="phone" type="tel" aria-label="Phone number" required /></label><label>What do you need?<select name="service" aria-label="Visit type" defaultValue="Wellness visit"><option>Wellness visit</option><option>Emergency care</option><option>General consultation</option></select></label><button type="submit">Send request <ArrowIcon /></button>{bookingMessage && <p className="booking-message" role="status">{bookingMessage}</p>}</form></div></section>
    <footer><a className="footer-brand" href="#home">APOK AGRICULTURAL PRODUCTION</a><p>Plant and animal solutions for farms, pets and communities.</p><div className="socials"><a href="https://www.instagram.com/apokagricultural?stkn=MTBpcDF3MHNoMjcy" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/share/19Jx97QNTL/" target="_blank" rel="noreferrer">Facebook ↗</a></div><small>© {new Date().getFullYear()} Apok Agricultural Production</small></footer>
  </main>;
}

function Loader(): ReactElement { return <div className="loader" aria-label="Loading"><div className="loader-bone" aria-hidden="true"></div></div>; }

function App(): ReactElement { const [page, setPage] = useState(window.location.hash); const [loading, setLoading] = useState(true); useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 900); return () => window.clearTimeout(timer); }, []); useEffect(() => { const sync = () => setPage(window.location.hash); window.addEventListener('hashchange', sync); return () => window.removeEventListener('hashchange', sync); }, []); if (loading) return <Loader />; if (page === '#admin') return <Suspense fallback={<Loader />}><AdminAccess /></Suspense>; if (page === '#collection') return <Suspense fallback={<Loader />}><CollectionPage /></Suspense>; return <ClinicSite />; }
createRoot(document.getElementById('root')!).render(<App />);
