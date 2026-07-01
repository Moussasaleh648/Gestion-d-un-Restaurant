import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Clock, ShoppingBag, Plus, ShoppingCart, Flame, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Tous', 'Entrées', 'Burgers', 'Plats', 'Accompagnements', 'Desserts', 'Boissons'];

export default function ClientHome() {
  const { menuItems, restaurant } = useData();
  const { addToCart, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [addedItem, setAddedItem] = useState(null);

  const availableItems = menuItems.filter(m => m.available);

  const filtered = availableItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tous' || m.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  const popularItems = availableItems.filter(m => m.popular).slice(0, 4);

  return (
    <div>
      {/* Section héro */}
      <section style={{
        position: 'relative', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(8,10,14,0.85) 0%, rgba(20,10,5,0.9) 100%), url("/images/home-bg.jpg") center/cover',
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 700, width: '100%', padding: 24, textAlign: 'center', zIndex: 10, position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ fontSize: 64, marginBottom: 16 }}
          >
            🍔
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 800, color: 'white',
              marginBottom: 12, lineHeight: 1.1, fontFamily: 'Playfair Display'
            }}
          >
            <span style={{ color: '#f97316' }}>FastFood</span> - Tchad
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', marginBottom: 12 }}
          >
            {restaurant?.description}
          </motion.p>

          {/* Badges d'information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}
          >
            <span style={{
              background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 20, padding: '4px 14px', fontSize: 13, color: '#f97316', display: 'flex',
              alignItems: 'center', gap: 6
            }}>
              <Star size={13} fill="#f97316" /> {restaurant?.rating} ({restaurant?.reviewCount} avis)
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '4px 14px', fontSize: 13, color: 'rgba(255,255,255,0.8)', display: 'flex',
              alignItems: 'center', gap: 6
            }}>
              <Clock size={13} /> {restaurant?.deliveryTime}
            </span>
            <span style={{
              background: restaurant?.isOpen ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${restaurant?.isOpen ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 20, padding: '4px 14px', fontSize: 13, color: restaurant?.isOpen ? '#34d399' : '#f87171'
            }}>
              {restaurant?.isOpen ? '● Ouvert' : '● Fermé'}
            </span>
          </motion.div>

          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              display: 'flex', background: 'rgba(13,17,23,0.9)', borderRadius: 50,
              padding: '6px 6px 6px 20px', border: '1px solid rgba(249,115,22,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', color: '#f97316', marginRight: 12 }}>
              <Search size={18} />
            </div>
            <input
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15 }}
            />
            <button
              className="btn btn-primary"
              style={{
                borderRadius: 40, padding: '10px 28px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
              }}
            >
              Rechercher
            </button>
          </motion.div>
        </div>
      </section>

      {/* Contenu principal */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Populaires */}
        {!search && activeCategory === 'Tous' && popularItems.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Flame size={20} color="#f97316" />
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Les plus populaires</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {popularItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{
                    background: 'linear-gradient(135deg, var(--surface-2), var(--surface-3))',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: 16, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12,
                      background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                    }}>{item.emoji}</div>
                    <div>
                      <div style={{
                        fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
                        marginBottom: 4
                      }}>{item.name}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#f97316' }}>
                        {item.price.toLocaleString('fr-FR')} FCFA</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: addedItem === item.id ? '#22c55e' : 'linear-gradient(135deg, #f97316, #ea580c)',
                      border: 'none', color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s', flexShrink: 0,
                    }}
                  >
                    {addedItem === item.id ? <CheckCircle size={16} /> : <Plus size={16} />}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Filtre par catégorie */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16, marginBottom: 32, scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '9px 20px', borderRadius: 50, fontSize: 14, fontWeight: 600,
                background: activeCategory === cat ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'var(--surface-2)',
                color: activeCategory === cat ? 'white' : 'var(--text-primary)',
                border: '1px solid', borderColor: activeCategory === cat ? 'transparent' : 'var(--border-subtle)',
                whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille du menu */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                borderRadius: 20, overflow: 'hidden', transition: 'all 0.2s',
                display: 'flex', flexDirection: 'column',
              }}
              whileHover={{ y: -4 }}
            >
              {/* Image / Émoji du plat */}
              <div style={{
                height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.04))',
                borderBottom: '1px solid var(--border-subtle)', fontSize: 64, position: 'relative',
              }}>
                {item.emoji}
                {item.popular && (
                  <span style={{
                    position: 'absolute', top: 12, left: 12,
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white', fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 20,
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Flame size={10} /> Populaire
                  </span>
                )}
              </div>

              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.name}</h3>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#f97316', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {item.price.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, flex: 1, lineHeight: 1.5 }}>{item.description}</p>

                <button
                  onClick={() => handleAddToCart(item)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 12,
                    background: addedItem === item.id ? '#22c55e' : 'linear-gradient(135deg, #f97316, #ea580c)',
                    border: 'none', color: 'white', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', transition: 'all 0.3s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginTop: 8,
                  }}
                >
                  {addedItem === item.id ? (
                    <><CheckCircle size={16} /> <span>Ajouté !</span></>
                  ) : (
                    <><Plus size={16} /> <span>Ajouter au panier</span></>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state" style={{ padding: 80 }}>
            <div className="empty-state-icon">🍽️</div>
            <h3>Aucun plat ne correspond à votre recherche</h3>
            <p>Essayez un autre mot-clé ou une autre catégorie.</p>
          </div>
        )}
      </section>
    </div>
  );
}
