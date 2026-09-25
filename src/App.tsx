import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface Product {
  id: number;
  name: string;
  nameBn: string;
  price: number;
  originalPrice?: number;
  unit: string;
  img: string;
  category: string;
  categorySlug: string;
  badge?: string;
  rating: number;
  reviews: number;
  brand: string;
  description: string;
}
interface CartItem { product: Product; qty: number; }
interface Order { id: string; items: CartItem[]; total: number; name: string; phone: string; address: string; payment: string; }

// ═══════════════════════════════════════════════════════════════
// CATEGORY DATA
// ═══════════════════════════════════════════════════════════════
const navCats = [
  { slug:"all",     nameBn:"সব পণ্য",       nameEn:"All",         emoji:"🛒", bg:"#fff7ed" },
  { slug:"mach",    nameBn:"মাছ",            nameEn:"Fish",        emoji:"🐟", bg:"#eff6ff" },
  { slug:"mangsho", nameBn:"মাংস",           nameEn:"Meat",        emoji:"🍖", bg:"#fff1f2" },
  { slug:"sobji",   nameBn:"সবজি",           nameEn:"Vegetables",  emoji:"🥦", bg:"#f0fdf4" },
  { slug:"dal",     nameBn:"ডাল",            nameEn:"Lentils",     emoji:"🫘", bg:"#fefce8" },
  { slug:"chal",    nameBn:"চাল",            nameEn:"Rice",        emoji:"🌾", bg:"#fdf4ff" },
  { slug:"modhu",   nameBn:"মধু",            nameEn:"Honey",       emoji:"🍯", bg:"#fff7ed" },
  { slug:"mosla",   nameBn:"মশলা",           nameEn:"Spices",      emoji:"🌶️", bg:"#fff1f2" },
  { slug:"tel",     nameBn:"তেল ও ঘি",       nameEn:"Oil & Ghee",  emoji:"🫙", bg:"#fefce8" },
  { slug:"dim",     nameBn:"ডিম",            nameEn:"Eggs",        emoji:"🥚", bg:"#fffbeb" },
  { slug:"fol",     nameBn:"ফল",             nameEn:"Fruits",      emoji:"🍎", bg:"#fff1f2" },
  { slug:"badam",   nameBn:"বাদাম",           nameEn:"Nuts",        emoji:"🌰", bg:"#fdf4ff" },
  { slug:"combo",   nameBn:"কম্বো অফার",     nameEn:"Combos",      emoji:"🎁", bg:"#f0fdf4" },
];

// ═══════════════════════════════════════════════════════════════
// PRODUCT DATA
// ═══════════════════════════════════════════════════════════════
const products = [
  // Vegetables
  { id: 1, name: "চুই ঝাল", category: "Vegetables", price: 150, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 2, name: "সাজনে", category: "Vegetables", price: 60, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 3, name: "পেঁপে", category: "Vegetables", price: 40, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 4, name: "শশা", category: "Vegetables", price: 50, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 5, name: "করল্লা", category: "Vegetables", price: 60, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 6, name: "লাউ", category: "Vegetables", price: 50, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 7, name: "চাল কুমড়া", category: "Vegetables", price: 45, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 8, name: "মিষ্টি কুমড়া", category: "Vegetables", price: 40, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 9, name: "মুলা", category: "Vegetables", price: 30, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 10, name: "ধনিয়া পাতা", category: "Vegetables", price: 20, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 11, name: "কচু ও কচুর লতি", category: "Vegetables", price: 50, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 12, name: "বরবটি", category: "Vegetables", price: 70, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 13, name: "সীম", category: "Vegetables", price: 80, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },
  { id: 14, name: "টমেটো", category: "Vegetables", price: 60, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300" },

  // Fish
  { id: 15, name: "রুই", category: "Fish", price: 350, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 16, name: "কাতলা", category: "Fish", price: 380, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 17, name: "পাঙ্গাস", category: "Fish", price: 180, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 18, name: "কৈ", category: "Fish", price: 250, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 19, name: "টাটকিনি", category: "Fish", price: 220, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 20, name: "তেলাপিয়া", category: "Fish", price: 200, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 21, name: "সিল্ভারকার্প", category: "Fish", price: 160, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },
  { id: 22, name: "মাছের পোনা", category: "Fish", price: 300, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300" },

  // Fruits
  { id: 23, name: "লেবু", category: "Fruits", price: 10, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 24, name: "কলা", category: "Fruits", price: 40, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300" },
  { id: 25, name: "পেঁপে (পাকা)", category: "Fruits", price: 50, image: "https://images.unsplash.com/photo-1517524204227-4844399ace7f?w=300" },
  { id: 26, name: "বেদানা", category: "Fruits", price: 250, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300" },
  { id: 27, name: "নারিকেল", category: "Fruits", price: 70, image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300" },
  { id: 28, name: "সুপারি", category: "Fruits", price: 5, image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=300" },
  { id: 29, name: "কদবেল", category: "Fruits", price: 30, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 30, name: "আমরা", category: "Fruits", price: 40, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 31, name: "জাম", category: "Fruits", price: 120, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 32, name: "জাম্বুরা", category: "Fruits", price: 60, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 33, name: "খেজুর", category: "Fruits", price: 300, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 34, name: "আমলকি", category: "Fruits", price: 60, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 35, name: "তাল", category: "Fruits", price: 50, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 36, name: "কাঁঠাল", category: "Fruits", price: 200, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },
  { id: 37, name: "আলুবোখারা", category: "Fruits", price: 350, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300" },

  // Oil
  { id: 38, name: "সরিষার তেল", category: "Oil", price: 220, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300" },
  { id: 39, name: "তিলের তেল", category: "Oil", price: 300, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300" },
  { id: 40, name: "নারিকেলের তেল", category: "Oil", price: 250, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300" },

  // Crop & Spices
  { id: 41, name: "হলুদ", category: "Crop", price: 180, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300" },
  { id: 42, name: "আদা", category: "Crop", price: 140, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300" },
  { id: 43, name: "ধনিয়া", category: "Crop", price: 160, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300" },
  { id: 44, name: "কালোজিরা", category: "Crop", price: 250, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300" },

  // Honey
  { id: 45, name: "সরিষা ফুলের মধু", category: "Honey", price: 500, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300" },
  { id: 46, name: "মিশ্র ফুলের মধু", category: "Honey", price: 550, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300" },
  { id: 47, name: "লিচু ফুলের মধু", category: "Honey", price: 600, image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=300" },

  // Khejur Gur
  { id: 48, name: "পাটালি গুড়", category: "Gur", price: 200, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300" },
  { id: 49, name: "ঝোলা গুড়", category: "Gur", price: 180, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300" },
  { id: 50, name: "নারিকেল গুড়", category: "Gur", price: 220, image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300" },
];

// ═══════════════════════════════════════════════════════════════
// INLINE SVG ICONS
// ═══════════════════════════════════════════════════════════════
const IC = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Cart: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Heart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Pin: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ChevL: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevD: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Star: ({ f }: { f: boolean }) => <svg width="13" height="13" viewBox="0 0 24 24" fill={f ? "#f5821f" : "none"} stroke="#f5821f" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Minus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Phone: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  WA: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2d8a4e" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>,
  ArrowR: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Filter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Bag: () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
};

// ═══════════════════════════════════════════════════════════════
// BADGE
// ═══════════════════════════════════════════════════════════════
function Badge({ label }: { label: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    "Best Selling": { bg: "#e85d5d", color: "#fff" },
    "New Arrival":  { bg: "#2d8a4e", color: "#fff" },
    "Premium":      { bg: "#6d28d9", color: "#fff" },
    "Fresh":        { bg: "#0284c7", color: "#fff" },
    "Hot!":         { bg: "#dc2626", color: "#fff" },
    "Popular":      { bg: "#d97706", color: "#fff" },
    "Seasonal":     { bg: "#b45309", color: "#fff" },
    "Halal":        { bg: "#065f46", color: "#fff" },
    "Medicinal":    { bg: "#7c3aed", color: "#fff" },
    "Special":      { bg: "#c2410c", color: "#fff" },
    "Certified Organic": { bg: "#166534", color: "#fff" },
    "Offer":        { bg: "#f5821f", color: "#fff" },
  };
  const s = cfg[label] || { bg: "#f5821f", color: "#fff" };
  return (
    <span className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded-md leading-none"
      style={{ backgroundColor: s.bg, color: s.color, fontSize: 10 }}>
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// STARS
// ═══════════════════════════════════════════════════════════════
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => <IC.Star key={i} f={i <= Math.round(rating)} />)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════════════════════════
function PCard({ p, onSelect, onCart }: { p: Product; onSelect: (x: Product) => void; onCart: (x: Product) => void }) {
  const [added, setAdded] = useState(false);
  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdded(true);
    onCart(p);
    setTimeout(() => setAdded(false), 1400);
  };
  return (
    <div
      onClick={() => onSelect(p)}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer shrink-0 flex flex-col"
      style={{ width: 210, border: "1px solid #ede8de", transition: "box-shadow 0.22s, transform 0.22s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {p.badge && <Badge label={p.badge} />}
        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500"
          style={{ transition: "transform 0.4s ease" }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <p className="text-xs font-medium" style={{ color: "#a0845c" }}>{p.nameBn}</p>
        <h3 className="text-sm font-bold leading-snug" style={{ color: "#1a1a1a" }}>{p.name}</h3>
        <Stars rating={p.rating} />
        <p className="text-xs" style={{ color: "#888" }}>{p.unit}</p>
        <p className="text-lg font-black" style={{ color: "#f5821f" }}>৳{p.price.toLocaleString()}</p>
        <button
          onClick={handleCart}
          className="mt-auto w-full py-2 rounded-xl text-xs font-bold border-2 transition-all"
          style={{
            borderColor: "#f5821f",
            color: added ? "#fff" : "#f5821f",
            backgroundColor: added ? "#f5821f" : "transparent",
          }}
        >
          {added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT SLIDER with animation
// ═══════════════════════════════════════════════════════════════
function ProductSlider({ title, emoji, products: ps, onSelect, onCart }: {
  title: string; emoji?: string; products: Product[];
  onSelect: (p: Product) => void; onCart: (p: Product) => void;
}) {
  const CARD = 210; const GAP = 14; const STEP = CARD + GAP;
  const PER = 4;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const max = Math.max(0, ps.length - PER);

  useEffect(() => {
    if (paused || max === 0) return;
    const t = setInterval(() => setIdx(i => i >= max ? 0 : i + 1), 3600);
    return () => clearInterval(t);
  }, [paused, max]);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "'Lora', serif", color: "#1a1a1a" }}>
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          <div className="h-0.5 w-10 mt-1.5 rounded-full" style={{ background: "linear-gradient(90deg, #f5821f, #fbbf24)" }} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all disabled:opacity-25"
            style={{ borderColor: "#f5821f", color: "#f5821f" }}>
            <IC.ChevL />
          </button>
          <button onClick={() => setIdx(i => Math.min(max, i + 1))} disabled={idx >= max}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-25"
            style={{ backgroundColor: "#f5821f" }}>
            <IC.ChevR />
          </button>
        </div>
      </div>
      <div className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}>
        <div style={{ display: "flex", gap: GAP, transform: `translateX(-${idx * STEP}px)`, transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
          {ps.map(p => <PCard key={p.id} p={p} onSelect={onSelect} onCart={onCart} />)}
        </div>
      </div>
      {max > 0 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} className="rounded-full transition-all"
              style={{ width: i === idx ? 22 : 7, height: 7, backgroundColor: i === idx ? "#f5821f" : "#ddd" }} />
          ))}
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CATEGORY ICON GRID (illustrated style)
// ═══════════════════════════════════════════════════════════════
function CategoryGrid({ onCatSelect }: { onCatSelect: (slug: string) => void }) {
  const cats = navCats.slice(1); // skip "All"
  return (
    <section>
      <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily: "'Lora', serif", color: "#1a1a1a" }}>
        Featured Categories
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {cats.map(cat => (
          <button
            key={cat.slug}
            onClick={() => onCatSelect(cat.slug)}
            className="shrink-0 flex flex-col items-center gap-2.5 group"
            style={{ width: 92 }}
          >
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm border-2 transition-all group-hover:shadow-md group-hover:scale-105"
              style={{ backgroundColor: cat.bg, borderColor: "#ede8de", fontSize: 36 }}
            >
              {cat.emoji}
            </div>
            <div className="text-center">
              <p className="text-xs font-bold leading-tight" style={{ color: "#1a1a1a" }}>{cat.nameBn}</p>
              <p className="text-xs leading-tight" style={{ color: "#999", fontSize: 10 }}>{cat.nameEn}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// HERO BANNER
// ═══════════════════════════════════════════════════════════════
function HeroBanner({ onShop }: { onShop: (slug: string) => void }) {
  const slides = [
    { slug:"mach",    headline:"তাজা মাছ এখন\nদোরগোড়ায়!",    sub:"Farm to doorstep in 24hrs",  tag:"🐟 Fresh Fish",  bg:"linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)", img:"https://images.unsplash.com/photo-1611214774777-3d997a9d0e35?w=480&h=300&fit=crop&auto=format" },
    { slug:"modhu",   headline:"100% খাঁটি\nসুন্দরবন মধু",    sub:"Raw • Unfiltered • Certified", tag:"🍯 Pure Honey", bg:"linear-gradient(135deg,#fff7ed 0%,#fed7aa 100%)", img:"https://images.unsplash.com/photo-1536788567643-8c2368376526?w=480&h=300&fit=crop&auto=format" },
    { slug:"sobji",   headline:"সতেজ সবজি\nসরাসরি ক্ষেত থেকে", sub:"No pesticides, all natural",  tag:"🥦 Fresh Vegetables", bg:"linear-gradient(135deg,#f0fdf4 0%,#bbf7d0 100%)", img:"https://images.unsplash.com/photo-1557844352-761f2565b576?w=480&h=300&fit=crop&auto=format" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  const s = slides[active];
  return (
    <section className="relative rounded-2xl overflow-hidden" style={{ minHeight: 260, background: s.bg, border: "1px solid #ede8de", transition: "background 0.6s ease" }}>
      <div className="flex flex-col md:flex-row items-center justify-between h-full p-6 gap-4">
        <div className="flex-1">
          <span className="inline-block text-xs font-bold px-3 py-1.5 rounded-full text-white mb-3"
            style={{ backgroundColor: "#f5821f" }}>{s.tag}</span>
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-2 whitespace-pre-line" style={{ fontFamily: "'Lora', serif", color: "#1a1a1a" }}>
            {s.headline}
          </h2>
          <p className="text-sm mb-5" style={{ color: "#666" }}>{s.sub}</p>
          <button onClick={() => onShop(s.slug)}
            className="px-6 py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#f5821f" }}>
            এখনই কিনুন →
          </button>
        </div>
        <div className="w-48 h-44 md:w-56 md:h-52 rounded-2xl overflow-hidden shrink-0 shadow-lg">
          <img src={s.img} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      {/* dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} className="rounded-full transition-all"
            style={{ width: i === active ? 20 : 6, height: 6, backgroundColor: i === active ? "#f5821f" : "rgba(0,0,0,0.25)" }} />
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT LISTING PAGE
// ═══════════════════════════════════════════════════════════════
function ListingPage({ slug, onSelect, onCart, onBack }: {
  slug: string; onSelect: (p: Product) => void; onCart: (p: Product) => void; onBack: () => void;
}) {
  const cat = navCats.find(c => c.slug === slug);
  const all = bySlug(slug);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [onlyNew, setOnlyNew] = useState(false);
  const [sort, setSort] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);

  const brands = [...new Set(all.map(p => p.brand))];

  let filtered = all.filter(p => p.price <= maxPrice);
  if (selectedBrand.length) filtered = filtered.filter(p => selectedBrand.includes(p.brand));
  if (onlyNew) filtered = filtered.filter(p => p.badge === "New Arrival");
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const Sidebar = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: "#1a1a1a" }}>Price Range</h4>
        <div className="flex justify-between text-xs mb-2" style={{ color: "#888" }}>
          <span>৳0</span><span>৳{maxPrice.toLocaleString()}</span>
        </div>
        <input type="range" min={0} max={5000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
          className="w-full accent-orange-500" />
        <div className="h-0.5 mt-1" style={{ background: "linear-gradient(90deg, #f5821f, #fbbf24)" }} />
      </div>
      <div>
        <h4 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: "#1a1a1a" }}>Brands</h4>
        <div className="space-y-2">
          {brands.map(b => (
            <label key={b} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#444" }}>
              <input type="checkbox" checked={selectedBrand.includes(b)}
                onChange={e => setSelectedBrand(prev => e.target.checked ? [...prev, b] : prev.filter(x => x !== b))}
                className="accent-orange-500 w-4 h-4 rounded" />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: "#1a1a1a" }}>Product Flag</h4>
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "#444" }}>
          <input type="checkbox" checked={onlyNew} onChange={e => setOnlyNew(e.target.checked)} className="accent-orange-500 w-4 h-4 rounded" />
          New Arrival
        </label>
      </div>
      <button onClick={() => { setMaxPrice(5000); setSelectedBrand([]); setOnlyNew(false); }}
        className="w-full py-2 text-sm font-semibold rounded-lg border" style={{ borderColor: "#f5821f", color: "#f5821f" }}>
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f4ee" }}>
      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "#888" }}>
          <button onClick={onBack} className="hover:underline" style={{ color: "#f5821f" }}>Home</button>
          <span>›</span>
          <span style={{ color: "#1a1a1a" }}>{cat?.nameBn || "All Products"}</span>
        </nav>
        <div className="flex gap-6">
          {/* Sidebar desktop */}
          <aside className="w-60 shrink-0 hidden md:block bg-white rounded-2xl p-5 h-fit" style={{ border: "1px solid #ede8de" }}>
            <h3 className="font-black text-base mb-5" style={{ color: "#1a1a1a" }}>{cat?.nameBn || "All"}</h3>
            <Sidebar />
          </aside>
          {/* Main */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm" style={{ color: "#888" }}>{filtered.length} products found</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterOpen(true)} className="md:hidden flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg" style={{ border: "1px solid #f5821f", color: "#f5821f" }}>
                  <IC.Filter /> Filters
                </button>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="text-sm px-3 py-2 rounded-lg border outline-none" style={{ borderColor: "#ede8de", color: "#1a1a1a", backgroundColor: "#fff" }}>
                  <option value="default">Default Sorting</option>
                  <option value="low">Price: Low → High</option>
                  <option value="high">Price: High → Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(p => <PCard key={p.id} p={p} onSelect={onSelect} onCart={onCart} />)}
              {filtered.length === 0 && (
                <div className="col-span-4 text-center py-16" style={{ color: "#888" }}>
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-semibold">No products match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setFilterOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-72 bg-white p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-black text-base">Filters</h3>
              <button onClick={() => setFilterOpen(false)}><IC.X /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT DETAIL PAGE
// ═══════════════════════════════════════════════════════════════
function DetailPage({ p, onBack, onCart, onBuy }: {
  p: Product; onBack: () => void; onCart: (x: Product) => void; onBuy: (x: Product, qty: number) => void;
}) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const imgs = [p.img, p.img + "&sat=20", p.img + "&sat=-20"];
  const related = products.filter(x => x.categorySlug === p.categorySlug && x.id !== p.id).slice(0, 5);

  const handleCart = () => { setAdded(true); for (let i = 0; i < qty; i++) onCart(p); setTimeout(() => setAdded(false), 1500); };

  return (
    <div style={{ backgroundColor: "#f8f4ee", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto px-4 py-5">
        <nav className="flex items-center gap-2 text-sm mb-5" style={{ color: "#888" }}>
          <button onClick={onBack} className="hover:underline" style={{ color: "#f5821f" }}>Home</button>
          <span>›</span>
          <span>Products</span>
          <span>›</span>
          <span style={{ color: "#1a1a1a" }} className="truncate max-w-xs">{p.name}</span>
        </nav>

        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #ede8de" }}>
          <div className="grid md:grid-cols-2">
            {/* Images */}
            <div className="p-5 flex flex-col gap-3">
              <div className="rounded-2xl overflow-hidden bg-gray-50 aspect-square">
                <img src={imgs[activeImg]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-2">
                {imgs.map((src, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
                    style={{ borderColor: i === activeImg ? "#f5821f" : "#ede8de" }}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col">
              {p.badge && <div className="mb-2"><Badge label={p.badge} /></div>}
              <p className="text-sm font-medium mb-1" style={{ color: "#a0845c" }}>{p.nameBn}</p>
              <h1 className="text-2xl font-black leading-snug mb-2" style={{ fontFamily: "'Lora', serif", color: "#1a1a1a" }}>{p.name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <Stars rating={p.rating} />
                <span className="text-xs" style={{ color: "#888" }}>({p.reviews} reviews)</span>
              </div>
              <p className="text-3xl font-black mb-1" style={{ color: "#f5821f" }}>৳{(p.price * qty).toLocaleString()}.00</p>
              {p.originalPrice && (
                <p className="text-sm mb-1"><span className="line-through" style={{ color: "#aaa" }}>৳{p.originalPrice.toLocaleString()}</span></p>
              )}
              <p className="text-xs mb-4" style={{ color: "#888" }}>{p.unit}</p>

              <div className="rounded-xl p-4 mb-5 text-sm leading-relaxed" style={{ backgroundColor: "#f8f4ee", color: "#666" }}>
                {p.description}
              </div>

              {/* Qty */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-bold text-sm" style={{ color: "#1a1a1a" }}>Quantity:</span>
                <div className="flex items-center rounded-xl overflow-hidden border-2" style={{ borderColor: "#ede8de" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50" style={{ color: "#1a1a1a" }}><IC.Minus /></button>
                  <span className="w-10 text-center font-bold">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50" style={{ color: "#1a1a1a" }}><IC.Plus /></button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button onClick={handleCart}
                  className="py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all"
                  style={{ borderColor: "#f5821f", color: added ? "#fff" : "#f5821f", backgroundColor: added ? "#f5821f" : "transparent" }}>
                  <IC.Cart /> {added ? "Added!" : "Add to Cart"}
                </button>
                <button onClick={() => onBuy(p, qty)}
                  className="py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#1a3333" }}>
                  Buy Now
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <a href={`https://wa.me/8801700000000?text=I want to order: ${p.name} (${qty} units)`}
                  target="_blank" rel="noreferrer"
                  className="py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#25d366" }}>
                  <IC.WA /> WhatsApp
                </a>
                <a href="tel:+8801700000000"
                  className="py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#3b5998" }}>
                  <IC.Phone /> Call Order
                </a>
              </div>

              <div className="pt-4" style={{ borderTop: "1px solid #ede8de" }}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: "#888" }}>Brand:</span>
                  <span className="text-sm font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: "#f8f4ee", color: "#1a1a1a", border: "1px solid #ede8de" }}>{p.brand}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "'Lora', serif", color: "#1a1a1a" }}>আরও দেখুন</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {related.map(rp => <PCard key={rp.id} p={rp} onSelect={() => {}} onCart={onCart} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════════════════
function CartDrawer({ cart, onClose, onUpdate, onRemove, onCheckout }: {
  cart: CartItem[]; onClose: () => void;
  onUpdate: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}) {
  const total = cart.reduce((s, x) => s + x.product.price * x.qty, 0);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white flex flex-col shadow-2xl">
        <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid #ede8de" }}>
          <h2 className="font-black text-lg" style={{ fontFamily: "'Lora', serif" }}>My Cart 🛒</h2>
          <button onClick={onClose}><IC.X /></button>
        </div>
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: "#aaa" }}>
            <IC.Bag />
            <p className="font-semibold">Your cart is empty</p>
            <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "#f5821f" }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3 p-3 rounded-xl" style={{ border: "1px solid #ede8de" }}>
                  <img src={item.product.img} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold leading-snug truncate" style={{ color: "#1a1a1a" }}>{item.product.name}</p>
                    <p className="text-sm font-black" style={{ color: "#f5821f" }}>৳{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => onUpdate(item.product.id, item.qty - 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: "#ddd" }}><IC.Minus /></button>
                      <span className="text-sm font-bold">{item.qty}</span>
                      <button onClick={() => onUpdate(item.product.id, item.qty + 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: "#ddd" }}><IC.Plus /></button>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.product.id)} className="text-red-400 hover:text-red-600 self-start"><IC.Trash /></button>
                </div>
              ))}
            </div>
            <div className="p-4 space-y-3" style={{ borderTop: "1px solid #ede8de" }}>
              <div className="flex justify-between text-sm" style={{ color: "#888" }}>
                <span>Subtotal ({cart.reduce((s,x)=>s+x.qty,0)} items)</span>
                <span className="font-bold" style={{ color: "#1a1a1a" }}>৳{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: "#888" }}>
                <span>Delivery</span>
                <span className="font-bold" style={{ color: "#2d8a4e" }}>Free</span>
              </div>
              <div className="flex justify-between font-black text-base" style={{ color: "#1a1a1a" }}>
                <span>Total</span>
                <span style={{ color: "#f5821f" }}>৳{total.toLocaleString()}</span>
              </div>
              <button onClick={onCheckout}
                className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#f5821f" }}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CHECKOUT MODAL
// ═══════════════════════════════════════════════════════════════
function CheckoutModal({ cart, onClose, onSuccess }: {
  cart: CartItem[]; onClose: () => void;
  onSuccess: (order: Order) => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "cod" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const total = cart.reduce((s, x) => s + x.product.price * x.qty, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^\+?[0-9]{10,14}$/.test(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    const order: Order = {
      id: "AGN-" + Math.random().toString(36).slice(2,8).toUpperCase(),
      items: cart,
      total,
      ...form,
    };
    onSuccess(order);
  };

  const payMethods = [
    { val: "cod",   label: "💵 Cash on Delivery" },
    { val: "bkash", label: "📱 bKash" },
    { val: "nagad", label: "📱 Nagad" },
    { val: "card",  label: "💳 Debit / Credit Card" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: "1px solid #ede8de", backgroundColor: "#f8f4ee" }}>
          <h2 className="font-black text-lg" style={{ fontFamily: "'Lora', serif" }}>Complete Your Order</h2>
          <button onClick={onClose}><IC.X /></button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
          {/* Order summary */}
          <div className="rounded-xl p-3 space-y-1" style={{ backgroundColor: "#f8f4ee", border: "1px solid #ede8de" }}>
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span style={{ color: "#666" }}>{item.product.name} × {item.qty}</span>
                <span className="font-bold" style={{ color: "#1a1a1a" }}>৳{(item.product.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-black pt-2" style={{ borderTop: "1px solid #ede8de", color: "#f5821f" }}>
              <span>Total</span>
              <span>৳{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Form fields */}
          {[
            { key: "name",    label: "Full Name *",         type: "text",  placeholder: "আপনার পুরো নাম" },
            { key: "phone",   label: "Phone Number *",      type: "tel",   placeholder: "01XXXXXXXXX" },
            { key: "address", label: "Delivery Address *",  type: "text",  placeholder: "বাড়ি নং, রাস্তা, থানা, জেলা" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-bold block mb-1.5" style={{ color: "#1a1a1a" }}>{f.label}</label>
              <input
                type={f.type}
                value={(form as any)[f.key]}
                placeholder={f.placeholder}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: `2px solid ${errors[f.key] ? "#ef4444" : "#ede8de"}`, color: "#1a1a1a" }}
              />
              {errors[f.key] && <p className="text-xs mt-1 text-red-500">{errors[f.key]}</p>}
            </div>
          ))}

          {/* Payment */}
          <div>
            <label className="text-xs font-bold block mb-2" style={{ color: "#1a1a1a" }}>Payment Method *</label>
            <div className="grid grid-cols-2 gap-2">
              {payMethods.map(m => (
                <button key={m.val} onClick={() => setForm(p => ({ ...p, payment: m.val }))}
                  className="py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all text-left"
                  style={{
                    borderColor: form.payment === m.val ? "#f5821f" : "#ede8de",
                    backgroundColor: form.payment === m.val ? "#fff7ed" : "#fff",
                    color: "#1a1a1a",
                  }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={submit}
            className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#f5821f" }}>
            Place Order ৳{total.toLocaleString()} →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ORDER SUCCESS MODAL
// ═══════════════════════════════════════════════════════════════
function SuccessModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-2xl w-full max-w-sm text-center shadow-2xl p-8">
        <div className="flex justify-center mb-4"><IC.Check /></div>
        <h2 className="text-xl font-black mb-2" style={{ fontFamily: "'Lora', serif", color: "#1a1a1a" }}>
          অর্ডার সম্পন্ন হয়েছে! 🎉
        </h2>
        <p className="text-sm mb-1" style={{ color: "#888" }}>Order ID</p>
        <p className="text-lg font-black mb-4" style={{ color: "#f5821f" }}>{order.id}</p>
        <div className="rounded-xl p-4 text-left space-y-2 mb-5" style={{ backgroundColor: "#f8f4ee", border: "1px solid #ede8de" }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#888" }}>Recipient</span>
            <span className="font-bold" style={{ color: "#1a1a1a" }}>{order.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#888" }}>Phone</span>
            <span className="font-bold" style={{ color: "#1a1a1a" }}>{order.phone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#888" }}>Payment</span>
            <span className="font-bold capitalize" style={{ color: "#1a1a1a" }}>{order.payment}</span>
          </div>
          <div className="flex justify-between text-sm font-black pt-2" style={{ borderTop: "1px solid #ede8de" }}>
            <span>Total Paid</span>
            <span style={{ color: "#f5821f" }}>৳{order.total.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-xs mb-5" style={{ color: "#888" }}>আমাদের টিম ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-black text-white" style={{ backgroundColor: "#f5821f" }}>
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════
function Header({ cartCount, onCartOpen, onHome }: { cartCount: number; onCartOpen: () => void; onHome: () => void }) {
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm" style={{ borderBottom: "1px solid #ede8de" }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <button onClick={onHome} className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black text-white" style={{ background: "linear-gradient(135deg, #f5821f, #f59e0b)" }}>🌿</div>
          <div>
            <div className="font-black text-sm leading-tight" style={{ fontFamily: "'Lora', serif", color: "#1a3333" }}>AGRO</div>
            <div className="font-black text-sm leading-tight -mt-1" style={{ fontFamily: "'Lora', serif", color: "#f5821f" }}>NEXUS</div>
          </div>
        </button>

        {/* Search - desktop */}
        <div className="hidden sm:flex flex-1 max-w-lg mx-4 rounded-xl overflow-hidden border-2" style={{ borderColor: "#ede8de", backgroundColor: "#f8f4ee" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="পণ্য খুঁজুন... (Search products)"
            className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none" style={{ color: "#1a1a1a" }} />
          <button className="px-4 text-white shrink-0" style={{ backgroundColor: "#f5821f" }}><IC.Search /></button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="hidden md:flex flex-col items-center gap-0.5 text-xs hover:opacity-70" style={{ color: "#666" }}>
            <IC.Pin /><span>Track</span>
          </button>
          <button className="hidden md:flex flex-col items-center gap-0.5 text-xs hover:opacity-70" style={{ color: "#666" }}>
            <IC.User /><span>Sign In</span>
          </button>
          <button className="hidden md:flex flex-col items-center gap-0.5 text-xs hover:opacity-70" style={{ color: "#666" }}>
            <IC.Heart /><span>Wishlist</span>
          </button>
          <button onClick={onCartOpen} className="relative flex flex-col items-center gap-0.5">
            <div className="relative">
              <IC.Cart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-white flex items-center justify-center text-xs font-black" style={{ backgroundColor: "#f5821f", fontSize: 9 }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold hidden sm:block" style={{ color: "#f5821f" }}>Cart</span>
          </button>
        </div>
      </div>
      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <div className="flex rounded-xl overflow-hidden border-2" style={{ borderColor: "#ede8de", backgroundColor: "#f8f4ee" }}>
          <input placeholder="পণ্য খুঁজুন..." className="flex-1 px-3 py-2 text-sm bg-transparent outline-none" />
          <button className="px-3 text-white" style={{ backgroundColor: "#f5821f" }}><IC.Search /></button>
        </div>
      </div>
    </header>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAV BAR
// ═══════════════════════════════════════════════════════════════
function NavBar({ active, onSelect }: { active: string; onSelect: (slug: string) => void }) {
  return (
    <nav className="sticky top-16 z-30 shadow-md" style={{ backgroundColor: "#1a3333" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {navCats.map(cat => (
            <button key={cat.slug} onClick={() => onSelect(cat.slug)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-3.5 text-xs font-semibold whitespace-nowrap relative transition-colors"
              style={{ color: active === cat.slug ? "#f5821f" : "rgba(255,255,255,0.82)", fontWeight: active === cat.slug ? 700 : 500 }}>
              <span>{cat.emoji}</span>
              <span>{cat.nameBn}</span>
              {active === cat.slug && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full" style={{ backgroundColor: "#f5821f" }} />}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════
function Footer() {
  const cols = [
    { title: "Information",   links: ["About Us", "Contact Us", "Company Info", "Stories", "Terms & Conditions", "Privacy Policy", "Careers"] },
    { title: "Shop By",       links: ["Oil & Ghee", "Honey", "Dates", "Spices", "Nuts & Seeds", "Beverage", "Functional Foods"] },
    { title: "Support",       links: ["Support Center", "How to Order", "Order Tracking", "Payment", "Shipping", "FAQ"] },
    { title: "Consumer Policy",links: ["Happy Return", "Refund Policy", "Exchange", "Cancellation", "Pre-Order", "Extra Discount"] },
  ];
  return (
    <footer className="mt-14" style={{ backgroundColor: "#1a3333", color: "rgba(255,255,255,0.85)" }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg text-white" style={{ background: "linear-gradient(135deg,#f5821f,#f59e0b)" }}>🌿</div>
              <div>
                <div className="font-black text-xs leading-tight" style={{ fontFamily:"'Lora',serif", color:"#fff" }}>AGRO</div>
                <div className="font-black text-xs leading-tight" style={{ fontFamily:"'Lora',serif", color:"#f5821f" }}>NEXUS</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color:"rgba(255,255,255,0.55)" }}>
              Bangladesh's trusted agro B2C platform — delivering farm-fresh food to every home.
            </p>
            <p className="text-xs mb-1" style={{ color:"rgba(255,255,255,0.55)" }}>📍 Rampura, Dhaka, Bangladesh</p>
            <p className="text-xs mb-1" style={{ color:"rgba(255,255,255,0.55)" }}>📞 +880 1700-000000</p>
            <p className="text-xs mb-4" style={{ color:"rgba(255,255,255,0.55)" }}>✉️ hello@agronexus.com.bd</p>
            <div className="flex gap-2 mb-5">
              {["📘","𝕏","📸"].map((icon,i) => (
                <button key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:scale-110 transition-transform" style={{ backgroundColor:"rgba(255,255,255,0.1)" }}>{icon}</button>
              ))}
            </div>
            <p className="text-xs font-bold mb-2" style={{ color:"rgba(255,255,255,0.7)" }}>Download App:</p>
            <div className="flex gap-2 flex-wrap">
              {["▶ Google Play","🍎 App Store"].map((label,i) => (
                <button key={i} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{ backgroundColor:"rgba(255,255,255,0.12)", color:"#fff" }}>{label}</button>
              ))}
            </div>
          </div>
          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="font-black text-xs mb-4 uppercase tracking-wider text-white">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-xs hover:text-white transition-colors" style={{ color:"rgba(255,255,255,0.55)" }} onClick={e => e.preventDefault()}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment strip */}
        <div className="mt-8 pt-6 space-y-3" style={{ borderTop:"1px solid rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>Pay With:</span>
            {["💳 VISA","💳 MC","📱 bKash","📱 Nagad","📱 Rocket","🏦 DBBL","🏦 Dutch-Bangla","🏦 AB Bank"].map(p => (
              <span key={p} className="text-xs px-2 py-1 rounded-md" style={{ backgroundColor:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)" }}>{p}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color:"rgba(255,255,255,0.4)" }}>
            <span>© 2026 AgroNexus. All rights reserved.</span>
            <span>🔒 SSL Secured • Verified by SSLCommerz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
type Page = "home" | "listing" | "detail";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [activeCat, setActiveCat] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const ex = prev.find(x => x.product.id === p.id);
      return ex ? prev.map(x => x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x)
                : [...prev, { product: p, qty: 1 }];
    });
  };

  const updateCart = (id: number, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(x => x.product.id !== id)); return; }
    setCart(prev => prev.map(x => x.product.id === id ? { ...x, qty } : x));
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(x => x.product.id !== id));

  const goProduct = (p: Product) => { setSelectedProduct(p); setPage("detail"); window.scrollTo(0, 0); };
  const goCat = (slug: string) => { setActiveCat(slug); setPage(slug === "all" ? "home" : "listing"); window.scrollTo(0, 0); };
  const goHome = () => { setPage("home"); setActiveCat("all"); window.scrollTo(0, 0); };

  const handleBuyNow = (p: Product, qty: number) => {
    for (let i = 0; i < qty; i++) addToCart(p);
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setCart([]);
    setShowCheckout(false);
  };

  const sliderSections = [
    { key:"top",     emoji:"🔥", title:"Top Selling Products",      ps: topSelling },
    { key:"mach",    emoji:"🐟", title:"তাজা মাছ (Fresh Fish)",      ps: bySlug("mach") },
    { key:"mangsho", emoji:"🍖", title:"তাজা মাংস (Fresh Meat)",     ps: bySlug("mangsho") },
    { key:"sobji",   emoji:"🥦", title:"সতেজ সবজি (Vegetables)",     ps: bySlug("sobji") },
    { key:"modhu",   emoji:"🍯", title:"খাঁটি মধু (Honey)",           ps: bySlug("modhu") },
    { key:"dal",     emoji:"🫘", title:"ডাল (Lentils)",               ps: bySlug("dal") },
    { key:"chal",    emoji:"🌾", title:"চাল (Rice)",                  ps: bySlug("chal") },
    { key:"tel",     emoji:"🫙", title:"তেল ও ঘি (Oil & Ghee)",       ps: bySlug("tel") },
  ];

  return (
    <div style={{ backgroundColor: "#f8f4ee", minHeight: "100vh" }}>
      <Header cartCount={cartCount} onCartOpen={() => setShowCart(true)} onHome={goHome} />
      <NavBar active={activeCat} onSelect={goCat} />

      {/* Pages */}
      {page === "home" && (
        <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
          <HeroBanner onShop={goCat} />
          <CategoryGrid onCatSelect={goCat} />
          {sliderSections.map(sec => (
            <ProductSlider key={sec.key} title={sec.title} emoji={sec.emoji} products={sec.ps} onSelect={goProduct} onCart={addToCart} />
          ))}
          {/* Why Choose Us */}
          <section>
            <h2 className="text-xl font-bold text-center mb-6" style={{ fontFamily:"'Lora',serif", color:"#1a1a1a" }}>কেন AgroNexus?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon:"🌿", title:"১০০% অর্গানিক", sub:"Certified farm-fresh produce" },
                { icon:"🚚", title:"দ্রুত ডেলিভারি", sub:"24-48 hour home delivery" },
                { icon:"✅", title:"মান নিশ্চিত", sub:"Lab tested, no additives" },
                { icon:"💬", title:"সার্বক্ষণিক সাপোর্ট", sub:"WhatsApp & phone support" },
              ].map(item => (
                <div key={item.title} className="rounded-2xl p-5 text-center bg-white" style={{ border:"1px solid #ede8de" }}>
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-bold text-sm mb-1" style={{ color:"#1a1a1a" }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color:"#888" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {page === "listing" && (
        <ListingPage slug={activeCat} onSelect={goProduct} onCart={addToCart} onBack={goHome} />
      )}

      {page === "detail" && selectedProduct && (
        <DetailPage p={selectedProduct} onBack={goHome} onCart={addToCart} onBuy={handleBuyNow} />
      )}

      <Footer />

      {/* Floating cart bubble */}
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-30 rounded-2xl shadow-xl flex flex-col items-center justify-center p-3 gap-0.5 transition-transform hover:scale-105"
        style={{ backgroundColor: "#f5821f", minWidth: 64 }}
      >
        <IC.Cart />
        <span className="text-white text-xs font-black">{cartCount} Items</span>
      </button>

      {/* Overlays */}
      {showCart && (
        <CartDrawer cart={cart} onClose={() => setShowCart(false)}
          onUpdate={updateCart} onRemove={removeFromCart}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }} />
      )}
      {showCheckout && (
        <CheckoutModal cart={cart} onClose={() => setShowCheckout(false)} onSuccess={handleOrderSuccess} />
      )}
      {completedOrder && (
        <SuccessModal order={completedOrder} onClose={() => setCompletedOrder(null)} />
      )}
    </div>
  );
}
