import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, Banknote, Smartphone, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ORDER_STATUS } from '../../data/mockData';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { restaurant, addOrder } = useData();
  const toast = useToast();

  const [orderType, setOrderType] = useState('delivery'); // livraison, sur-place
  const [address, setAddress] = useState(currentUser?.address || '');
  const [table, setTable] = useState('');
  const [notes, setNotes] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // espèces, mobile, carte
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="empty-state" style={{ height: 'calc(100vh - 68px)' }}>
        <div style={{
          width: 80, height: 80, background: 'rgba(249,115,22,0.1)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, border: '1px solid rgba(249,115,22,0.2)'
        }}>
          <ShoppingBag size={32} color="#f97316" />
        </div>
        <h2 style={{ fontSize: 24, marginBottom: 12, color: 'var(--text-primary)' }}>Votre panier est vide</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Découvrez notre menu et ajoutez des plats succulents.</p>
        <Link to="/" className="btn btn-primary btn-lg" style={{
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          border: 'none'
        }}>
          Voir le menu
        </Link>
      </div>
    );
  }

  const deliveryFee = orderType === 'delivery' ? 1000 : 0;
  const finalTotal = cartTotal + deliveryFee;
  const isBelowMin = orderType === 'delivery' && cartTotal < (restaurant?.minOrder || 0);

  const handleCheckout = async () => {
    if (!currentUser) {
      if (!guestName || !guestPhone) {
        toast.error('Veuillez entrer votre nom et numéro de téléphone.');
        return;
      }
    }

    if (orderType === 'delivery' && !address) {
      toast.error('Veuillez renseigner votre adresse de livraison.');
      return;
    }
    if (orderType === 'dine-in' && !table) {
      toast.error('Veuillez renseigner votre numéro de table.');
      return;
    }

    if (paymentMethod === 'mobile' && (!mobileNumber || mobileNumber.length < 8)) {
      toast.error('Veuillez entrer un numéro Airtel Money ou Moov valide.');
      return;
    }

    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvc)) {
      toast.error('Veuillez remplir toutes les informations de votre carte.');
      return;
    }

    setIsSubmitting(true);
    // Simulation d'un délai réseau / traitement du paiement
    await new Promise(r => setTimeout(r, 1500));

    addOrder({
      clientId: currentUser?.id || `guest_${Date.now()}`,
      clientName: currentUser?.name || guestName,
      clientPhone: currentUser?.phone || guestPhone,
      items: cartItems.map(i => ({ menuItemId: i.id, name: i.name, price: i.price, quantity: i.quantity, emoji: i.emoji })),
      total: finalTotal,
      status: ORDER_STATUS.PENDING,
      type: orderType,
      address: orderType === 'delivery' ? address : null,
      table: orderType === 'dine-in' ? table : null,
      paymentMethod,
      notes
    });

    clearCart();
    setIsSubmitting(false);
    toast.success('Commande validée et payée avec succès !');

    if (currentUser) {
      navigate('/orders');
    } else {
      // Guest users go to home and get a toast confirmation
      navigate('/');
      toast.info(`Merci ${guestName}, votre commande est en préparation !`);
    }
  };

  return (
    <div className="cart-page">
      <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--text-primary)' }}>Mon Panier</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Finalisez votre commande chez
        <strong style={{ color: '#f97316' }}>{restaurant?.name}</strong></p>

      <div className="cart-layout">
        {/* Colonne gauche - Articles du panier & Options */}
        <div className="cart-main-column">

          {/* Articles */}
          <div style={{ background: 'var(--surface-2)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20,
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 12, background: 'rgba(249,115,22,0.1)',
                    border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 32, flexShrink: 0
                  }}>
                    {item.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 16, fontWeight: 700, color: 'var(--text-primary)',
                      marginBottom: 4
                    }}>{item.name}</div>
                    <div style={{ color: '#f97316', fontWeight: 800 }}>{item.price.toLocaleString('fr-FR')} FCFA</div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-3)',
                    borderRadius: 'var(--radius-full)', padding: '4px 12px'
                  }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        color: 'var(--text-secondary)', background: 'none', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4
                      }}>
                      <Minus size={14} />
                    </button>
                    <span style={{
                      fontSize: 14, fontWeight: 700, width: 20, textAlign: 'center',
                      color: 'var(--text-primary)'
                    }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4
                      }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{
                      color: '#ef4444', padding: 8, background: 'rgba(239,68,68,0.1)',
                      border: 'none', borderRadius: 8, cursor: 'pointer'
                    }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>
                Notes pour le restaurant (optionnel)</label>
              <textarea
                className="form-input" rows={2}
                placeholder="Ex: Sans oignons, sauce à part..."
                value={notes} onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Informations client & Options de livraison */}
          <div style={{ background: 'var(--surface-2)', borderRadius: 16, border: '1px solid var(--border-subtle)', padding: 24 }}>
            {!currentUser && (
              <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-primary)' }}>Mes informations</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                  Vous commandez en tant qu'invité. <Link to="/login"
                    style={{ color: '#f97316', textDecoration: 'none' }}>Se connecter</Link> pour suivre la commande.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Nom complet</label>
                    <input className="form-input" placeholder="Ex: Ali Moussa"
                      value={guestName} onChange={e => setGuestName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input className="form-input" placeholder="+235 66 00 00 00"
                      value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--text-primary)' }}>Mode de réception</h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <button
                onClick={() => setOrderType('delivery')}
                style={{
                  flex: 1, padding: 16, borderRadius: 12, border: '1px solid',
                  background: orderType === 'delivery' ? 'rgba(249,115,22,0.1)' : 'var(--surface-3)',
                  borderColor: orderType === 'delivery' ? '#f97316' : 'var(--border-subtle)',
                  color: orderType === 'delivery' ? '#f97316' : 'var(--text-secondary)',
                  fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer'
                }}
              >
                🛵 Livraison
              </button>
              <button
                onClick={() => setOrderType('dine-in')}
                style={{
                  flex: 1, padding: 16, borderRadius: 12, border: '1px solid',
                  background: orderType === 'dine-in' ? 'rgba(249,115,22,0.1)' : 'var(--surface-3)',
                  borderColor: orderType === 'dine-in' ? '#f97316' : 'var(--border-subtle)',
                  color: orderType === 'dine-in' ? '#f97316' : 'var(--text-secondary)',
                  fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer'
                }}
              >
                🍽️ Sur place
              </button>
            </div>

            <AnimatePresence mode="wait">
              {orderType === 'delivery' ? (
                <motion.div key="del" initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="form-label">Adresse de livraison</label>
                  <input className="form-input mt-2" placeholder="Quartier, Rue, N°..."
                    value={address} onChange={e => setAddress(e.target.value)} />
                </motion.div>
              ) : (
                <motion.div key="dine" initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <label className="form-label">Numéro de <span translate="no"
                    className="notranslate">table</span></label>
                  <input className="form-input mt-2" placeholder="Ex: Table 12"
                    value={table} onChange={e => setTable(e.target.value)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Colonne droite - Récapitulatif & Paiement */}
        <div className="cart-summary-column">

          <div style={{
            background: 'var(--surface-2)', borderRadius: 16,
            border: '1px solid var(--border-subtle)', padding: 24, marginBottom: 24
          }}>
            <h3 style={{ fontSize: 18, marginBottom: 20, color: 'var(--text-primary)' }}>Moyen de paiement</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                onClick={() => setPaymentMethod('mobile')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderRadius: 12, border: `2px solid ${paymentMethod === 'mobile' ? '#f97316' : 'var(--border-subtle)'}`,
                  background: paymentMethod === 'mobile' ? 'rgba(249,115,22,0.05)' : 'var(--surface-3)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: paymentMethod === 'mobile' ? '#f97316' : 'var(--text-muted)' }}>
                    <Smartphone size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Mobile Money</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Airtel Money / Moov Money</div>
                  </div>
                </div>
                {paymentMethod === 'mobile' && <Check size={18} color="#f97316" />}
              </div>

              <div
                onClick={() => setPaymentMethod('cash')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16,
                  borderRadius: 12, border: `2px solid ${paymentMethod === 'cash' ? '#10b981' : 'var(--border-subtle)'}`,
                  background: paymentMethod === 'cash' ? 'rgba(16,185,129,0.05)' : 'var(--surface-3)', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: paymentMethod === 'cash' ? '#10b981' : 'var(--text-muted)' }}><Banknote size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Paiement en espèces</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>À la livraison ou au comptoir</div>
                  </div>
                </div>
                {paymentMethod === 'cash' && <Check size={18} color="#10b981" />}
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16,
                  borderRadius: 12, border: `2px solid ${paymentMethod === 'card' ? '#3b82f6' : 'var(--border-subtle)'}`,
                  background: paymentMethod === 'card' ? 'rgba(59,130,246,0.05)' : 'var(--surface-3)', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ color: paymentMethod === 'card' ? '#3b82f6' : 'var(--text-muted)' }}>
                    <CreditCard size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Carte Bancaire</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Paiement sécurisé en ligne</div>
                  </div>
                </div>
                {paymentMethod === 'card' && <Check size={18} color="#3b82f6" />}
              </div>
            </div>

            {/* Formulaires spécifiques au paiement */}
            <AnimatePresence mode="wait">
              {paymentMethod === 'mobile' && (
                <motion.div key="mobile" initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 20 }}>
                  <div style={{
                    padding: 16, background: 'rgba(249,115,22,0.05)',
                    borderRadius: 12, border: '1px solid rgba(249,115,22,0.2)'
                  }}>
                    <label className="form-label">Numéro Airtel Money ou Moov</label>
                    <input
                      type="tel" className="form-input mt-2"
                      placeholder="Ex: 66 00 00 00"
                      value={mobileNumber} onChange={e => setMobileNumber(e.target.value)}
                    />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                      <span>Un SMS de confirmation sera envoyé sur ce numéro pour valider le paiement.</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'cash' && (
                <motion.div key="cash" initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: 20 }}>
                  <div style={{
                    padding: 16, background: 'rgba(16,185,129,0.05)',
                    borderRadius: 12, border: '1px solid rgba(16,185,129,0.2)'
                  }}>
                    <p style={{ fontSize: 13, color: '#10b981', margin: 0, fontWeight: 500 }}>
                      <span>Préparez la monnaie exacte si possible pour faciliter l'encaissement.</span>
                    </p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'card' && (
                <motion.div key="card" initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} style={{ marginTop: 20 }}>
                  <div style={{
                    padding: 16, background: 'rgba(59,130,246,0.05)',
                    borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)'
                  }}>
                    <div className="form-group" style={{ marginBottom: 12 }}>
                      <label className="form-label">Numéro de carte</label>
                      <input className="form-input mt-2" placeholder="0000 0000 0000 0000"
                        value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="form-group">
                        <label className="form-label">Expiration</label>
                        <input className="form-input mt-2" placeholder="MM/AA" value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input mt-2" placeholder="123" type="password"
                          maxLength="3" value={cardCvc} onChange={e => setCardCvc(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{
            background: 'var(--surface-2)', borderRadius: 16,
            border: '1px solid var(--border-subtle)', padding: 24
          }}>
            <h3 style={{ fontSize: 18, marginBottom: 24, color: 'var(--text-primary)' }}>Récapitulatif</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Sous-total</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cartTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              {orderType === 'delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Frais de livraison</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{deliveryFee.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              <div style={{ height: 1, background: 'var(--border-subtle)' }} />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                color: 'var(--text-primary)', fontSize: 20, fontWeight: 800
              }}>
                <span>Total à payer</span>
                <span style={{ color: '#10b981' }}>{finalTotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            {isBelowMin && (
              <div style={{
                background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: 12,
                borderRadius: 8, fontSize: 13, marginBottom: 24, border: '1px solid rgba(245,158,11,0.3)', fontWeight: 500
              }}>
                Le minimum de commande pour la livraison est de {restaurant?.minOrder?.toLocaleString('fr-FR')}
                FCFA. Ajoutez encore pour {(restaurant?.minOrder - cartTotal).toLocaleString('fr-FR')} FCFA.
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isBelowMin || isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%', justifyContent: 'center', padding: '16px', fontSize: 16,
                fontWeight: 700, background: (isBelowMin || isSubmitting) ?
                  'var(--surface-3)' : 'linear-gradient(135deg, #10b981, #059669)', border: 'none',
                color: (isBelowMin || isSubmitting) ? 'var(--text-muted)' : 'white'
              }}
            >
              {isSubmitting ? (
                <div className="spinner" style={{
                  width: 24, height: 24, borderWidth: 3,
                  borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)'
                }} />
              ) : (
                <span>Valider et payer {finalTotal.toLocaleString('fr-FR')} FCFA</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
