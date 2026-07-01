import { motion } from 'framer-motion';
import { Clock, CheckCircle, ChefHat, Truck, XCircle, Store, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ORDER_STATUS } from '../../data/mockData';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: { label: 'En attente', color: '#f59e0b', icon: Clock },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmée', color: '#3b82f6', icon: CheckCircle },
  [ORDER_STATUS.PREPARING]: { label: 'En préparation', color: '#8b5cf6', icon: ChefHat },
  [ORDER_STATUS.READY]: { label: 'En route / Prête', color: '#10b981', icon: Truck },
  [ORDER_STATUS.DELIVERED]: { label: 'Terminée', color: 'var(--text-muted)', icon: CheckCircle },
  [ORDER_STATUS.CANCELLED]: { label: 'Annulée', color: '#ef4444', icon: XCircle },
};

const DEFAULT_STATUS = { label: 'Inconnu', color: 'var(--text-muted)', icon: Clock };

export default function ClientOrders() {
  const { currentUser } = useAuth();
  const { orders, restaurant } = useData();

  if (!currentUser) {
    return (
      <div className="empty-state" style={{ height: 'calc(100vh - 68px)' }}>
        <div className="empty-state-icon">🔐</div>
        <h3 style={{ color: 'var(--text-primary)' }}>Veuillez vous connecter</h3>
        <p>Connectez-vous pour voir vos commandes.</p>
        <Link to="/login" className="btn btn-primary" style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
        }}>Se connecter</Link>
      </div>
    );
  }

  const myOrders = (orders || [])
    .filter(o => o.clientId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 32, marginBottom: 32, color: 'var(--text-primary)' }}>Mes Commandes</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {myOrders.map((order, i) => {
          // Safe status config with fallback for unknown/stale statuses
          const conf = STATUS_CONFIG[order.status] || DEFAULT_STATUS;
          const isDone = [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(order.status);
          // Safe number conversion in case old localStorage had string values
          const total = Number(order.total) || 0;
          const StatusIcon = conf.icon;

          return (
            <motion.div
              key={order.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)',
                background: isDone ? 'transparent' : `linear-gradient(90deg, ${conf.color}15, transparent)`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Store size={20} color="#f97316" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {restaurant?.name || 'FastFood_Tchad'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR',
                      { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, color: conf.color,
                    fontWeight: 700, fontSize: 14
                  }}>
                    <StatusIcon size={16} /> {conf.label}
                  </div>
                </div>
              </div>

              <div style={{
                padding: 24, display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', flexWrap: 'wrap', gap: 24
              }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(order.items || []).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          background: 'rgba(249,115,22,0.1)', width: 24, height: 24,
                          borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#f97316'
                        }}>{item.quantity}</span>
                        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item.name}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                          {(Number(item.price) * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 200, alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>{total.toLocaleString('fr-FR')} FCFA</div>

                  {order.status === ORDER_STATUS.DELIVERED && (
                    <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end', color: 'var(--text-secondary)' }}>
                      <MessageSquare size={14} /> <span>Laisser un avis</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}

        {myOrders.length === 0 && (
          <div className="empty-state" style={{ padding: 80 }}>
            <div className="empty-state-icon">🛍️</div>
            <h3 style={{ color: 'var(--text-primary)' }}>Aucune commande pour le moment</h3>
            <p>Retrouvez ici l'historique de vos repas.</p>
            <Link to="/" className="btn btn-primary" style={{
              marginTop: 24,
              background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
            }}>
              Découvrir le menu
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
