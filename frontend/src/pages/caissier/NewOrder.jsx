import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X, Trash2, ChefHat, Table2, Truck, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ORDER_STATUS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Tous', 'Entrées', 'Burgers', 'Plats', 'Accompagnements', 'Desserts', 'Boissons'];

export default function NewOrder() {
  const { menuItems, tables, addOrder } = useData();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('dine-in');
  const [selectedTable, setSelectedTable] = useState('');
  const [clientName, setClientName] = useState('Client sur place');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const availableItems = menuItems.filter(m => m.available);
  const filtered = availableItems.filter(m => activeCategory === 'Tous' || m.category === activeCategory);
  const availableTables = tables.filter(t => t.status !== 'occupied');

  const addItem = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing?.qty === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const deleteItem = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handleSubmit = () => {
    if (cart.length === 0) return;
    const order = {
      clientId: null,
      clientName: clientName || 'Client sur place',
      items: cart.map(c => ({ menuItemId: c.id, name: c.name, price: c.price, quantity: c.qty })),
      total,
      status: ORDER_STATUS.CONFIRMED,
      type: orderType,
      table: orderType === 'dine-in' ? selectedTable || 'Comptoir' : undefined,
      address: orderType === 'delivery' ? 'Adresse à confirmer' : undefined,
      notes,
      createdBy: 'caissier',
      caissierName: currentUser?.name,
    };
    addOrder(order);
    setSuccess(true);
    setTimeout(() => navigate('/caissier/orders'), 2000);
  };

  if (success) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: 24
      }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{
            width: 100, height: 100, borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
            border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Check size={48} color="#10b981" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
          Commande créée !
        </motion.h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirection vers les commandes...</p>
      </div>
    );
  }

  return (
    <div className="caissier-new-order-page">
      <div className="page-header">
        <div>
          <h1>Nouvelle commande</h1>
          <p>Créer une commande manuelle pour un client sur place</p>
        </div>
      </div>

      <div className="new-order-grid">
        {/* Menu - Colonne gauche */}
        <div>
          {/* Filtre par catégorie */}
          <div className="category-filters-container" style={{ marginBottom: 20 }}>
            {/* Version Desktop */}
            <div className="category-filters-desktop" style={{
              display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12,
              scrollbarWidth: 'none'
            }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    background: activeCategory === cat ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'var(--surface-2)',
                    color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Version Mobile */}
            <div className="category-filters-mobile" style={{ position: 'relative' }}>
              <select
                value={activeCategory}
                onChange={e => setActiveCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                  borderRadius: 12,
                  background: 'var(--surface-2)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: 16,
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div style={{
                position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none', color: '#f97316', fontSize: 12
              }}>
                ▼
              </div>
            </div>
          </div>

          {/* Grille des articles */}
          <div className="new-order-items-grid">
            {filtered.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => addItem(item)}
                  style={{
                    background: inCart ? 'rgba(249,115,22,0.08)' : 'var(--surface-2)',
                    border: `2px solid ${inCart ? '#f97316' : 'var(--border-subtle)'}`,
                    borderRadius: 14, padding: 16, cursor: 'pointer',
                    transition: 'all 0.2s', position: 'relative',
                  }}
                >
                  {inCart && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10, background: '#f97316',
                      color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800
                    }}>
                      {inCart.qty}
                    </div>
                  )}
                  <div style={{ fontSize: 36, marginBottom: 10, textAlign: 'center' }}>{item.emoji}</div>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--text-primary)',
                    marginBottom: 4
                  }}>{item.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#f97316' }}>{item.price.toLocaleString('fr-FR')} FCFA</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Panier - Colonne droite */}
        <div className="new-order-sidebar">
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
            borderRadius: 20, overflow: 'hidden'
          }}>
            {/* En-tête du panier */}
            <div style={{
              padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(135deg, rgba(249,115,22,0.08), transparent)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{
                  fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex',
                  alignItems: 'center', gap: 8
                }}>
                  <ShoppingCart size={18} color="#f97316" /> Commande ({cartCount})
                </h3>
                {cart.length > 0 && (
                  <button onClick={() => setCart([])} style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12
                  }}>
                    Vider
                  </button>
                )}
              </div>
            </div>

            {/* Informations client */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{
                  fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.5px', display: 'block', marginBottom: 6
                }}>Nom du client</label>
                <input
                  value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="Nom du client"
                  style={{
                    width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 14, boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{
                  fontSize: 12, color: 'var(--text-muted)', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6
                }}>Type</label>
                <div className="order-type-buttons">
                  {[['dine-in', '🍽️ Sur place', Table2], ['delivery', '🛵 Livraison', Truck]].map(([val, lbl]) => (
                    <button
                      key={val} onClick={() => setOrderType(val)}
                      style={{
                        flex: 1, padding: '8px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                        background: orderType === val ? 'rgba(249,115,22,0.15)' : 'var(--surface-3)',
                        color: orderType === val ? '#f97316' : 'var(--text-secondary)',
                        border: `1px solid ${orderType === val ? 'rgba(249,115,22,0.4)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              {orderType === 'dine-in' && (
                <div>
                  <label style={{
                    fontSize: 12, color: 'var(--text-muted)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 6
                  }}>Table</label>
                  <select
                    value={selectedTable} onChange={e => setSelectedTable(e.target.value)}
                    style={{
                      width: '100%', background: 'var(--surface-3)', border: '1px solid var(--border-subtle)',
                      borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 14
                    }}
                  >
                    <option value="">Comptoir / Sans table</option>
                    {availableTables.map(t => <option key={t.id} value={`Table ${t.number}`}>
                      Table {t.number} ({t.capacity} pers.)</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Articles du panier */}
            <div style={{ padding: '16px 20px', maxHeight: 280, overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px 0', fontSize: 14 }}>
                  <ShoppingCart size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <div>Cliquez sur un article pour l'ajouter</div>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.price.toLocaleString('fr-FR')} FCFA</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => removeItem(item.id)} style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'var(--surface-3)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Minus size={12} />
                      </button>
                      <span style={{
                        fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', minWidth: 20,
                        textAlign: 'center'
                      }}>{item.qty}</span>
                      <button onClick={() => addItem(item)} style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#f97316', border: 'none', color: 'white', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Plus size={12} />
                      </button>
                      <button onClick={() => deleteItem(item.id)} style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4
                      }}>
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Notes */}
            <div style={{ padding: '0 20px 16px' }}>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Notes / instructions spéciales..."
                rows={2}
                style={{
                  width: '100%', background: 'var(--surface-3)',
                  border: '1px solid var(--border-subtle)', borderRadius: 8,
                  padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Total + Valider */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: cart.length === 0 ? 'var(--surface-3)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                  border: 'none', color: cart.length === 0 ? 'var(--text-muted)' : 'white',
                  fontSize: 16, fontWeight: 700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🧾 Valider la commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
