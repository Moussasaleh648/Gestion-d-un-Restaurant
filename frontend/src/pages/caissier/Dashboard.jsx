import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, ArrowUp, Users, Clock, CheckCircle, AlertCircle, Table2, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';
import { ORDER_STATUS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatOrderId } from '../../utils/orderUtils';

const monthlyOrders = [
  { day: 'Lun', orders: 42 }, { day: 'Mar', orders: 58 },
  { day: 'Mer', orders: 35 }, { day: 'Jeu', orders: 70 },
  { day: 'Ven', orders: 89 }, { day: 'Sam', orders: 95 },
  { day: 'Dim', orders: 62 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--surface-3)', border: '1px solid var(--border-default)', borderRadius: 10,
        padding: '10px 14px'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#f97316', fontWeight: 700 }}>{payload[0].value} commandes</p>
      </div>
    );
  }
  return null;
};

export default function CaissierDashboard() {
  const { orders, tables, restaurant } = useData();
  const { currentUser } = useAuth();

  const todayOrders = orders.filter(o => o.createdAt?.startsWith('2024-06-29'));
  const pendingOrders = orders.filter(o => o.status === ORDER_STATUS.PENDING);
  const preparingOrders = orders.filter(o => o.status === ORDER_STATUS.PREPARING || o.status === ORDER_STATUS.CONFIRMED);
  const readyOrders = orders.filter(o => o.status === ORDER_STATUS.READY);
  const availableTables = tables.filter(t => t.status === 'available');
  const occupiedTables = tables.filter(t => t.status === 'occupied');

  const todayRevenue = todayOrders
    .filter(o => o.status === ORDER_STATUS.DELIVERED)
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: 'Commandes aujourd\'hui', value: todayOrders.length, icon: ShoppingBag,
      color: '#f97316', change: '+8', up: true
    },
    {
      label: 'En attente', value: pendingOrders.length, icon: AlertCircle, color: '#f59e0b',
      change: pendingOrders.length > 0 ? '!' : '✓', up: false
    },
    {
      label: 'Tables occupées', value: occupiedTables.length, icon: Table2, color: '#8b5cf6',
      change: `/${tables.length}`, up: true
    },
    {
      label: 'Recettes du jour', value: `${todayRevenue.toLocaleString('fr-FR')} FCFA`,
      icon: TrendingUp, color: '#10b981', change: '+12%', up: true
    },
  ];

  const recentOrders = [...orders].reverse().slice(0, 5);

  const statusColors = {
    [ORDER_STATUS.PENDING]: { color: '#f59e0b', label: 'En attente' },
    [ORDER_STATUS.CONFIRMED]: { color: '#3b82f6', label: 'Confirmée' },
    [ORDER_STATUS.PREPARING]: { color: '#8b5cf6', label: 'En préparation' },
    [ORDER_STATUS.READY]: { color: '#f97316', label: 'Prête' },
    [ORDER_STATUS.DELIVERED]: { color: '#10b981', label: 'Livrée' },
    [ORDER_STATUS.CANCELLED]: { color: '#ef4444', label: 'Annulée' },
  };

  return (
    <div className="caissier-dashboard-page">
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bonjour, <span style={{ color: '#f97316' }}>{currentUser?.name}</span> - {restaurant?.name}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#10b981' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
          {restaurant?.isOpen ? 'Restaurant ouvert' : 'Restaurant fermé'}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid cashier-stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
                color: stat.up ? '#10b981' : '#f59e0b'
              }}>
                {stat.up ? <ArrowUp size={12} /> : null} {stat.change}
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2 cashier-summary-grid" style={{ gap: 24, marginBottom: 24 }}>
        {/* Chart commandes semaine */}
        <motion.div className="caissier-chart-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 className="caissier-chart-title-mobile" style={{ fontSize: 16, color: 'var(--text-primary)' }}>Commandes cette semaine</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Volume quotidien</p>
            </div>
            <span className="badge" style={{
              background: 'rgba(249,115,22,0.1)', color: '#f97316',
              border: '1px solid rgba(249,115,22,0.2)'
            }}>+15%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={monthlyOrders}>
              <defs>
                <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2} fill="url(#orangeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Statuts en temps réel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, color: 'var(--text-primary)', marginBottom: 20 }}>État des commandes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'En attente', count: pendingOrders.length, color: '#f59e0b', icon: '⏳' },
              { label: 'En préparation', count: preparingOrders.length, color: '#8b5cf6', icon: '👨‍🍳' },
              { label: 'Prêtes à servir', count: readyOrders.length, color: '#f97316', icon: '✅' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: `${item.color}0f`, borderRadius: 12, border: `1px solid ${item.color}20`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 22, fontWeight: 800, color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tables status */}
      <motion.div className="cashier-tables-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        style={{
          background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16,
          padding: 24, marginBottom: 24
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, color: 'var(--text-primary)' }}>Tables - Vue rapide</h3>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{availableTables.length} disponibles sur {tables.length}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {tables.map(table => (
            <div key={table.id} style={{
              width: 72, height: 72, borderRadius: 12,
              background: table.status === 'available' ? 'rgba(16,185,129,0.1)' : table.status === 'occupied' ? 'rgba(249,115,22,0.1)' : 'rgba(139,92,246,0.1)',
              border: `2px solid ${table.status === 'available' ? '#10b981' : table.status === 'occupied' ? '#f97316' : '#8b5cf6'}40`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
              color: table.status === 'available' ? '#10b981' : table.status === 'occupied' ? '#f97316' : '#8b5cf6',
            }}>
              <Table2 size={20} />
              <span>T{table.number}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{table.capacity}p</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981', display: 'inline-block' }} /> Disponible</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#f97316', display: 'inline-block' }} /> Occupée</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: '#8b5cf6', display: 'inline-block' }} /> Réservée</span>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div className="cashier-orders-table-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h3 style={{ fontSize: 16, color: 'var(--text-primary)' }}>Commandes récentes</h3>
        </div>
        <table className="data-table hide-on-mobile">
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Total</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: '#f97316' }}>{formatOrderId(order.id)}</td>
                <td>{order.clientName || 'Client'}</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>{order.total?.toLocaleString('fr-FR')} FCFA</td>
                <td>
                  <span style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: order.type === 'delivery' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                    color: order.type === 'delivery' ? '#60a5fa' : '#a78bfa'
                  }}>
                    {order.type === 'delivery' ? '🛵 Livraison' : '🍽️ Sur place'}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: `${statusColors[order.status]?.color}18`, color: statusColors[order.status]?.color
                  }}>
                    {statusColors[order.status]?.label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Cartes pour mobile */}
        <div className="mobile-order-cards">
          {recentOrders.map(order => (
            <div key={order.id} style={{
              background: 'var(--surface-3)', border: '1px solid var(--border-default)',
              borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                  Commande <span style={{ color: '#f97316' }}>{formatOrderId(order.id)}</span>
                </div>
                <span style={{
                  fontSize: 12, padding: '4px 12px', borderRadius: 20,
                  background: `${statusColors[order.status]?.color}18`, color: statusColors[order.status]?.color,
                  fontWeight: 600
                }}>
                  {statusColors[order.status]?.label}
                </span>
              </div>
              <div style={{ fontWeight: 800, color: '#10b981', fontSize: 16 }}>
                {order.total?.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
