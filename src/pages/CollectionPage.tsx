import { useState } from 'react';
import type { ReactElement } from 'react';
import '../collection.css';
import '../collection-grid.css';
import '../collection-polish.css';
import '../collection-intro.css';
import '../collection-orders.css';
import '../collection-card-polish.css';

const productNames: Record<number, string> = {
  1: 'Urinating mat for dogs and cats', 2: 'Flashing pet ball', 4: 'Glitter pet collars', 5: 'Urinating mat for dogs and cats', 6: 'Heavy-duty dog chain', 7: 'Dogby natural dog treats', 8: 'Calu-Pet skin supplement & Pets Fur Cream', 9: 'Plastic pet carrier basket', 11: 'Pet bed', 12: 'Demis antiseptic liquid', 13: 'Ruddy Pet-Cream', 14: 'Slicker pet brush', 15: 'Collagen Keratin Argan Oil', 16: 'D-Plus pet cod liver oil', 17: 'Pet dental care & retractable leash', 18: 'Sulfa-3 antibacterial liquid', 19: 'Rowe perfume & Fresh Pearl canine cologne', 20: 'Zito pet multivitamin & Pawsitive Vigor-Vit', 21: 'MangeQ medicated cream', 22: 'WormQ & Combiworm dewormer', 23: 'Dualish anti-acaricidal body spray', 24: 'Plastic pet tray', 25: 'Albiovit & Bio-Finil pet treatment', 26: 'Pet collars and leads', 27: 'Pet grooming brushes', 28: 'Peticure, Roadans & Fresh Pearl pet soap', 29: 'Predicure, Uniflox & iodine tincture', 30: 'Extra-Energy pet supplement', 31: 'Collagen Keratin Argan Oil', 32: 'Urinating mat for dogs and cats', 33: 'Petrim pet medicine', 34: 'Mon-amic glass cleaner', 35: 'Pet-Cure & Roadans dog soap', 36: 'Silva-Pet acaricidal dog soap', 37: 'J.A.P. pet multivitamin tablets', 38: 'Laser LED pet light', 39: 'Cocci-Cure anti-protozoa treatment', 40: 'Blue Diamond air freshener', 41: 'Broad Killer surface spray', 42: 'Pets Pet-On pour-on treatment', 43: 'B-NOR vitamin B complex', 44: 'Pet shoes', 45: 'Moko isopropyl alcohol', 46: 'Vetzyme B Plus E tablets', 47: 'Pet wound-healing treatment', 48: 'Plastic pet tray', 49: 'Sulfa-3 antibacterial liquid', 50: 'G-Lisol germicide', 51: 'Brooder-Booster immune stimulant', 52: 'Tetra-Cure antibiotic', 53: 'Fiprocare tick and flea spray', 54: 'Healer wound-healing oil', 55: 'Albiovit pet multivitamin', 56: 'Retractable pet leash', 57: 'Pet ID tags and chains', 58: 'Astor washing-cleaner disinfectant', 59: 'Tetra-Pet dog and cat antibiotic', 60: 'P-Pet anti-pavo-enteritis treatment', 61: 'Command dog wound-healing oil', 62: 'Pox-Cure anti-virus treatment', 63: 'Pox-Cure anti-virus treatment', 64: 'Multivita-Extra supplement', 65: 'T-Viral granules', 66: 'Wormico anti-helminthic treatment', 67: 'Extra-Energy-Plus supplement', 68: 'Flamingo antibiotic', 69: 'El-Rox Growth Booster', 70: 'Bone-Hardener calcium stimulant', 71: 'Ostio-Cap calcium stimulant', 72: 'Fungate anti-fungi treatment', 73: 'Vitamino-Plus supplement', 74: 'Brooder-Booster immune stimulant', 75: 'Tetracin oxytetracycline', 76: 'Red-Patch anti-protozoan treatment', 77: 'Boostamin immune stimulant', 78: "Chick's Diet feed supplement", 79: 'Tetra-Cure antibiotic', 80: 'Egg-Plus egg-boosting formula',
};

const additionalProductImages = [
  '/products/catalogue-2026/new/IMG-20260915-WA0065.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0066.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0067.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0068.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0069.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0070.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0071.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0072.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0086.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0087.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0088.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0089.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0092.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0093.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0094.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0098.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0099.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0100.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0101.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0102.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0103.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0104.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0105.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0106.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0107.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0108.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0109.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0110.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0111.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0112.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0113.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0114.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0115.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0116.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0117.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0118.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0127.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0128.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0129.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0130.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0131.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0132.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0133.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0134.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0135.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0154.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0155.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0156.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0157.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0158.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0159.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0160.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0161.jpg', '/products/catalogue-2026/new/IMG-20260915-WA0162.jpg',
];

const additionalProductNames = [
  'Healer wound-healing oil', 'Multivita-Pet multivitamin syrup', 'Pedrum dog and cat snacks (1 kg)', 'Ruddy Pet-Cream',
  'Petrim antibiotic syrup', 'Cipro-D appetite stimulant syrup', 'P-Pet anti-pavo-enteritis treatment', 'Tetra-Pet dog and cat antibiotic',
  'Beige plastic pet carrier', 'Black plastic pet carrier', 'NTC-Worm broad-spectrum dewormer', 'NTC-Worm broad-spectrum dewormer',
  'Large stainless-steel pet bowl', 'Medium stainless-steel pet bowl', 'Small stainless-steel pet bowl', 'Nodule-Pet dry food (10 kg)',
  'Plush black dog toy', 'Moon-Shine pet shampoo', 'Flashing bunny ball', 'Chiwawa puppy dry food, 6 mm (1 kg)',
  'Flashing spiky pet balls', 'Paw-print pet bed', 'Chiwawa adult dry food, 9 mm (25 kg)', 'Laser pet light',
  'Foldable wire pet cage', 'Chiwawa adult dry food, 12 mm (10 kg)', 'Lich-Yolk pet custard (400 g)', 'Chiwawa puppy dry food, 6 mm (25 kg)',
  'Rowe perfume and body spray', 'Chiwawa puppy dry food, 6 mm (2 kg)', 'Nodule-Pet dry food (25 kg)', 'Silva-Pet acaricidal dog soap (400 g)',
  'G-Lisol germicide', '404 Pet-milk (400 g)', 'Tennis balls', 'Nodule-Pet dry food (2 kg)',
  'Demis antiseptic liquid', 'Astor washing-cleaner disinfectant', 'Multivita-Pet multivitamin syrup', 'Dualish anti-ectoparasitic body spray',
  'Flution fluralaner chewable tablet', 'Triple-R rust remover reagent', 'DGS dog grooming spray', 'Honey',
  'Beware of Dog sign', 'Mint double stainless-steel pet bowl set', 'Plastic pet carrier basket', 'Plastic pet tray',
  'Pink double stainless-steel pet bowl set', 'Gravity pet food and water dispenser', 'Stainless-steel pet bowl',
  'Jacdon stainless-steel pet bowl', 'D-Plus pet cod liver oil (250 ml)', 'Extra-Energy-Plus pet supplement',
] as const;

const catalogueCategories = [
  { title: 'Pet accessories', description: 'Beds, bowls, carriers, toys, leads and everyday essentials.', ids: [1, 2, 4, 5, 6, 9, 11, 14, 17, 24, 26, 27, 32, 38, 44, 48, 56, 57, 89, 90, 93, 94, 95, 97, 99, 101, 102, 104, 105, 116, 126, 127, 128, 129, 130, 131, 132] },
  { title: 'Food and treats', description: 'Dry food, snacks, milk and special pet foods.', ids: [7, 78, 83, 96, 100, 103, 106, 107, 108, 110, 111, 113] },
  { title: 'Grooming and hygiene', description: 'Coat care, soaps, shampoos, sprays and cleaning products.', ids: [13, 15, 19, 23, 28, 31, 34, 35, 36, 40, 41, 45, 50, 53, 58, 84, 98, 109, 112, 114, 115, 118, 120, 123] },
  { title: 'Medicines and supplements', description: 'Treatments, antibiotics, vitamins and wellness support.', ids: [8, 12, 16, 18, 20, 21, 22, 25, 29, 30, 33, 37, 39, 42, 43, 46, 47, 49, 51, 52, 54, 55, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 79, 80, 81, 82, 85, 86, 87, 88, 91, 92, 117, 119, 121, 133, 134] },
  { title: 'Other supplies', description: 'Useful shop and household items.', ids: [122, 124, 125] },
] as const;

const animalListings = [
  { name: 'Golden Retriever puppies', image: '/animals/golden-retriever-puppies.jpg', type: 'Dogs' },
  { name: 'Doberman Pinscher', image: '/animals/doberman-pinscher.jpg', type: 'Dogs' },
  { name: 'Neapolitan Mastiff puppies', image: '/animals/neapolitan-mastiff-puppies.jpg', type: 'Dogs' },
  { name: 'Shih Tzu', image: '/animals/shih-tzu.jpg', type: 'Dogs' },
  { name: 'British Shorthair kitten', image: '/animals/british-shorthair-kitten.jpg', type: 'Cats' },
  { name: 'Zebu bull', image: '/animals/zebu-bull.jpg', type: 'Livestock' },
  { name: 'Bullmastiff puppies', image: '/animals/bullmastiff-puppies.jpg', type: 'Dogs' },
  { name: 'White Persian kitten', image: '/animals/white-persian-kitten.jpg', type: 'Cats' },
  { name: 'Bicolour Persian kitten', image: '/animals/bicolour-persian-kitten.jpg', type: 'Cats' },
  { name: 'German Shepherd', image: '/animals/german-shepherd.jpg', type: 'Dogs' },
  { name: 'German Shepherd puppy', image: '/animals/german-shepherd-puppy.jpg', type: 'Dogs' },
  { name: 'Doberman Pinscher puppies', image: '/animals/doberman-pinscher-puppies.jpg', type: 'Dogs' },
  { name: 'Siberian Husky puppy', image: '/animals/siberian-husky-puppy.jpg', type: 'Dogs' },
  { name: 'Persian cats', image: '/animals/persian-cats.jpg', type: 'Cats' },
  { name: 'Day-old chicks', image: '/animals/day-old-chicks.jpg', type: 'Poultry' },
  { name: 'Cream puppy', image: '/animals/cream-puppy.jpg', type: 'Dogs' },
  { name: 'Grey kitten', image: '/animals/grey-kitten.jpg', type: 'Cats' },
  { name: 'Brown puppy', image: '/animals/brown-puppy.jpg', type: 'Dogs' },
  { name: 'Fluffy puppy', image: '/animals/fluffy-puppy.jpg', type: 'Dogs' },
  { name: 'Blue-eyed kittens', image: '/animals/blue-eyed-kittens.jpg', type: 'Cats' },
  { name: 'Cattle herd', image: '/animals/cattle-herd.jpg', type: 'Livestock' },
  { name: 'Monkey', image: '/animals/monkey.jpg', type: 'Exotic pets' },
  { name: 'White Persian cat', image: '/animals/white-persian-cat.jpg', type: 'Cats' },
  { name: 'Ginger kitten', image: '/animals/ginger-kitten.jpg', type: 'Cats' },
  { name: 'Brown bull', image: '/animals/brown-bull.jpg', type: 'Livestock' },
  { name: 'White Persian cat (striped shirt)', image: '/animals/white-persian-cat-shirt.jpg', type: 'Cats' },
  { name: 'Grey tuxedo kitten', image: '/animals/grey-tuxedo-kitten.jpg', type: 'Cats' },
  { name: 'Neapolitan Mastiff litter', image: '/animals/neapolitan-mastiff-puppies-2.jpg', type: 'Dogs' },
  { name: 'Ball pythons', image: '/animals/ball-pythons.jpg', type: 'Exotic pets' },
  { name: 'Black and white puppy', image: '/animals/black-and-white-puppy.jpg', type: 'Dogs' },
] as const;

export default function CollectionPage(): ReactElement {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>(catalogueCategories[0].title);
  const [collectionTab, setCollectionTab] = useState<'products' | 'animals'>('products');
  const products = [...Array.from({ length: 80 }, (_, index) => index + 1).filter((id) => id !== 3 && id !== 10), ...additionalProductImages.map((_, index) => index + 81)];
  const productName = (id: number): string => id <= 80 ? productNames[id] : additionalProductNames[id - 81];
  const productImage = (id: number): string => id <= 80 ? `/products/catalogue-2026/image-${id}.jpg` : additionalProductImages[id - 81];
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
      const name = productName(id);
      return `• ${name}\n  Quantity: ${cart[id]}\n  Image: ${window.location.origin}${productImage(id)}`;
    }).join('\n');
    const message = `Hello APOK, I would like to order:\n${list}\n\nPlease confirm availability, price and delivery or pickup options.`;
    window.open(`https://wa.me/2348039778902?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  const renderProduct = (id: number): ReactElement => { const name = productName(id); return <figure className={`tile tile-${id}`} key={id}><img loading="lazy" decoding="async" src={productImage(id)} alt={name}/><figcaption><span className="product-name">{name}</span>{cart[id] ? <span className="quantity-controls"><button type="button" onClick={() => changeQuantity(id, -1)} aria-label={`Remove one ${name}`}>−</button><b>{cart[id]}</b><button type="button" onClick={() => changeQuantity(id, 1)} aria-label={`Add one more ${name}`}>+</button></span> : <button type="button" onClick={() => changeQuantity(id, 1)}>Add to order</button>}</figcaption></figure>; };
  const enquireAboutAnimal = (name: string): void => { window.open(`https://wa.me/2348039778902?text=${encodeURIComponent(`Hello APOK, I would like to enquire about the ${name}. Please confirm availability, price and pickup or delivery options.`)}`, '_blank', 'noopener,noreferrer'); };
  const renderAnimal = (animal: typeof animalListings[number]): ReactElement => <figure className="tile animal-tile" key={animal.name}><img loading="lazy" decoding="async" src={animal.image} alt={animal.name}/><figcaption><span className="product-name"><small>{animal.type}</small>{animal.name}</span><button type="button" onClick={() => enquireAboutAnimal(animal.name)}>Enquire</button></figcaption></figure>;
  const visibleCategory = catalogueCategories.find((category) => category.title === activeCategory) || catalogueCategories[0];
  return <main className="collection-page"><header className="collection-nav"><a className="brand" href="#home">APOK</a><a className="nav-book" href="#home">← Back to site</a></header><section className="collection-hero"><div><p className="eyebrow">Apok Agricultural Production · Awka</p><h1>Pet shop,<br/>properly stocked.</h1></div><div><p>Choose products below, then send your order directly to APOK on WhatsApp.</p></div></section><section className="collection-content" id="collection-grid"><div className="collection-intro"><p className="eyebrow">Order from our collection</p><h2>Pick what you need.</h2><p>Add items to your order. APOK will confirm current stock and pricing on WhatsApp.</p></div><div className="collection-type-tabs" role="tablist" aria-label="Collection type"><button type="button" role="tab" aria-selected={collectionTab === 'products'} className={collectionTab === 'products' ? 'active' : ''} onClick={() => setCollectionTab('products')}>Products</button><button type="button" role="tab" aria-selected={collectionTab === 'animals'} className={collectionTab === 'animals' ? 'active' : ''} onClick={() => setCollectionTab('animals')}>Animals</button></div>{collectionTab === 'products' ? <><div className="collection-feature"><img loading="lazy" decoding="async" src="/products/catalogue-2026/image-3.jpg" alt="Stainless-steel pet bowls and raised feeders"/><div><p className="eyebrow">In store now</p><h2>Everything for their everyday.</h2><p>Find familiar food brands, care supplies and the little extras pets love.</p></div></div><div className="catalogue-tabs" role="tablist" aria-label="Product categories">{catalogueCategories.map((category) => <button type="button" role="tab" aria-selected={activeCategory === category.title} className={activeCategory === category.title ? 'active' : ''} key={category.title} onClick={() => setActiveCategory(category.title)}>{category.title}</button>)}</div><section className="catalogue-category" key={visibleCategory.title}><div className="catalogue-category-heading"><p className="eyebrow">{visibleCategory.title}</p><p>{visibleCategory.description}</p></div><div className="catalogue-gallery">{visibleCategory.ids.filter((id) => products.includes(id)).map(renderProduct)}</div></section></> : <section className="catalogue-category animals-catalogue"><div className="catalogue-category-heading"><p className="eyebrow">Animals available</p><p>Selected dogs, cats, livestock and poultry. Ask us about current availability, care and collection.</p></div><div className="catalogue-gallery">{animalListings.map(renderAnimal)}</div></section>}</section>{itemCount > 0 && <aside className="order-bar" aria-live="polite"><span><b>{itemCount}</b> {itemCount === 1 ? 'item' : 'items'} in your order</span><button type="button" onClick={checkout}>Checkout on WhatsApp ↗</button></aside>}</main>;
}
