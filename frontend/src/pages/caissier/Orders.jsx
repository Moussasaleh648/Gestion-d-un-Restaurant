import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, ChevronDown, CheckCircle, Clock, XCircle, Truck, ChefHat, Bell, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ORDER_STATUS } from '../../data/mockData';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: 'En attente', color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)', icon: '⏳', next: ORDER_STATUS.CONFIRMED
  },
  [ORDER_STATUS.CONFIRMED]: {
    label: 'Confirmée', color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)', icon: '✅', next: ORDER_STATUS.PREPARING
  },
  [ORDER_STATUS.PREPARING]: {
    label: 'En préparation', color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)', icon: '👨‍🍳', next: ORDER_STATUS.READY
  },
  [ORDER_STATUS.READY]: {
    label: 'Prête', color: '#f97316',
    bg: 'rgba(249,115,22,0.1)', icon: '🔔', next: ORDER_STATUS.DELIVERED
  },
  [ORDER_STATUS.DELIVERED]: {
    label: 'Livrée', color: '#10b981',
    bg: 'rgba(16,185,129,0.1)', icon: '✓', next: null
  },
  [ORDER_STATUS.CANCELLED]: {
    label: 'Annulée', color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)', icon: '✗', next: null
  },
};

const FILTER_TABS = [
  { key: 'all', label: 'Toutes' },
  { key: ORDER_STATUS.PENDING, label: 'En attente' },
  { key: ORDER_STATUS.PREPARING, label: 'En préparation' },
  { key: ORDER_STATUS.READY, label: 'Prêtes' },
  { key: ORDER_STATUS.DELIVERED, label: 'Livrées' },
];

export default function CaissierOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useData();
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchFilter = activeFilter === 'all' || o.status === activeFilter;
    const matchSearch = o.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search);
    return matchFilter && matchSearch;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pendingCount = orders.filter(o => o.status === ORDER_STATUS.PENDING).length;

  const handleAdvance = (order) => {
    const cfg = STATUS_CONFIG[order.status];
    if (cfg?.next) updateOrderStatus(order.id, cfg.next);
  };

  const handleCancel = (orderId) => {
    if (window.confirm('Annuler cette commande ?')) {
      updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Commandes</h1>
          <p>{orders.length} commandes au total</p>
        </div>
        <Link to="/caissier/new-order" className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', gap: 8 }}>
          <Plus size={16} /> Nouvelle commande
        </Link>
      </div>

      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 12, padding: '12px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12, fontSize: 14,
          }}
        >
          <Bell size={18} color="#f59e0b" />
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>{pendingCount}
            commande{pendingCount > 1 ? 's' : ''} en attente de confirmation</span>
        </motion.div>
      )}

      {/* Filtres + Recherche */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', flex: 1 }}>
          {FILTER_TABS.map(tab => {
            const count = tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                style={{
                  padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: activeFilter === tab.key ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'var(--surface-2)',
                  color: activeFilter === tab.key ? 'white' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                {tab.label}
                <span style={{
                  background: activeFilter === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--surface-3)',
                  borderRadius: 10, padding: '1px 7px', fontSize: 11,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)',
          border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '8px 14px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            placeholder="Rechercher..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)',
              fontSize: 14, width: 160
            }}
          />
        </div>
      </div>

      {/* Liste des commandes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((order, i) => {
          const cfg = STATUS_CONFIG[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--surface-2)', border: `1px solid ${cfg?.color}30`,
                borderLeft: `4px solid ${cfg?.color}`,
                borderRadius: 16, padding: 24, overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                flexWrap: 'wrap', gap: 12
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>{cfg?.icon}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, color: '#f97316', fontSize: 15 }}>#{order.id}</span>
                      <span style={{
                        fontSize: 12, padding: '3px 10px', borderRadius: 20,
                        background: cfg?.bg, color: cfg?.color, fontWeight: 600
                      }}>
                        {cfg?.label}
                      </span>
                      <span style={{
                        fontSize: 12, padding: '3px 10px', borderRadius: 20,
                        background: order.type === 'delivery' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                        color: order.type === 'delivery' ? '#60a5fa' : '#a78bfa'
                      }}>
                        {order.type === 'delivery' ? '🛵 Livraison' : '🍽️ Sur place'}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.clientName}</span>
                      {order.type === 'dine-in' && order.table && <span style={{
                        color: 'var(--text-muted)',
                        marginLeft: 8
                      }}>— {order.table}</span>}
                      {order.type === 'delivery' && <span style={{
                        color: 'var(--text-muted)',
                        marginLeft: 8
                      }}>— {order.address}</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {order.items?.map((item, idx) => (
                        <span key={idx} style={{
                          fontSize: 12, padding: '3px 10px', borderRadius: 20,
                          background: 'var(--surface-3)', color: 'var(--text-secondary)'
                        }}>
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                    {order.notes && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#f59e0b', fontStyle: 'italic' }}>
                        📝 {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>
                    {order.total?.toLocaleString('fr-FR')} FCFA
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED && (
                      <>
                        {cfg?.next && (
                          <button
                            onClick={() => handleAdvance(order)}
                            style={{
                              padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                              background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none',
                              color: 'white', cursor: 'pointer', transition: 'all 0.2s',
                            }}
                          >
                            {cfg.next === ORDER_STATUS.CONFIRMED ? '✓ Confirmer' :
                              cfg.next === ORDER_STATUS.PREPARING ? '👨‍🍳 En préparation' :
                                cfg.next === ORDER_STATUS.READY ? '🔔 Prêt' : '✅ Livré'}
                          </button>
                        )}
                        <button
                          onClick={() => handleCancel(order.id)}
                          style={{
                            padding: '8px 12px', borderRadius: 10, fontSize: 13,
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171', cursor: 'pointer',
                          }}
                        >
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>Aucune commande trouvée</h3>
            <p>Aucune commande ne correspond aux filtres sélectionnés.</p>
          </div>
        )}
      </div>
    </div>
  );
}
