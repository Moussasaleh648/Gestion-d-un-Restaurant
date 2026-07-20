import { motion } from 'framer-motion';
import { Users, ShoppingBag, TrendingUp, ArrowUp, Activity, Table2, Star, UserCog } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useData } from '../../context/DataContext';
import { ROLES, ORDER_STATUS } from '../../data/mockData';
import { formatOrderId } from '../../utils/orderUtils';

const monthlyRevenue = [
  { month: 'Jan', revenue: 850000 }, { month: 'Fév', revenue: 720000 },
  { month: 'Mar', revenue: 1100000 }, { month: 'Avr', revenue: 950000 },
  { month: 'Mai', revenue: 1350000 }, { month: 'Juin', revenue: 1580000 },
];

const categoryData = [
  { name: 'Burgers', orders: 450 }, { name: 'Plats', orders: 380 },
  { name: 'Entrées', orders: 220 }, { name: 'Boissons', orders: 310 },
  { name: 'Desserts', orders: 120 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--surface-3)', border: '1px solid var(--border-default)',
        borderRadius: 10, padding: '10px 14px'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#f97316', fontWeight: 700 }}>{payload[0].value?.toLocaleString('fr-FR')}
          {payload[0].dataKey === 'revenue' ? 'FCFA' : ''}</p>
      </div>
    );
  }
  return null;
};

export default function SuperAdminDashboard() {
  const { users, restaurant, orders, staff, tables } = useData();

  const clientCount = users.filter(u => u.role === ROLES.CLIENT).length;
  const caissierCount = users.filter(u => u.role === ROLES.CAISSIER).length;
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const deliveredOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);
  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const availableTables = tables.filter(t => t.status === 'available').length;

  const stats = [
    { label: 'Clients inscrits', value: clientCount, icon: Users, color: '#10b981', change: '+12', up: true },
    { label: 'Caissiers', value: caissierCount, icon: UserCog, color: '#f97316', change: `${caissierCount}`, up: true },
    { label: 'Commandes totales', value: orders.length, icon: ShoppingBag, color: '#3b82f6', change: '+8%', up: true },
    {
      label: 'Chiffre d\'affaires', value: `${(totalRevenue / 1000).toFixed(0)}k FCFA`,
      icon: TrendingUp, color: '#f97316', change: '+15%', up: true
    },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const statusColors = {
    [ORDER_STATUS.PENDING]: { color: '#f59e0b', label: 'En attente' },
    [ORDER_STATUS.CONFIRMED]: { color: '#3b82f6', label: 'Confirmée' },
    [ORDER_STATUS.PREPARING]: { color: '#8b5cf6', label: 'En préparation' },
    [ORDER_STATUS.READY]: { color: '#f97316', label: 'Prête' },
    [ORDER_STATUS.DELIVERED]: { color: '#10b981', label: 'Livrée' },
    [ORDER_STATUS.CANCELLED]: { color: '#ef4444', label: 'Annulée' },
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue globale - <span style={{ color: '#f97316' }}>{restaurant?.name}</span></p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#10b981' }}>
          <Activity size={16} />
          Restaurant opérationnel
        </div>
      </div>

      {/* Carte d'information du restaurant */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.04))',
          border: '1px solid rgba(249,115,22,0.2)', borderRadius: 16, padding: 24, marginBottom: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
          }}>🍔</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{restaurant?.name}</h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{restaurant?.cuisine} · {restaurant?.address}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#f97316' }}>★ {restaurant?.rating}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{restaurant?.reviewCount} avis</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{activeStaff}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Employés actifs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6' }}>{availableTables}/{tables.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Tables libres</div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="stats-grid">
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
                width: 44, height: 44, borderRadius: 12, background: `${stat.color}18`,
                border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
                color: stat.up ? '#10b981' : '#ef4444'
              }}>
                {stat.up ? <ArrowUp size={12} /> : null} {stat.change}
              </span>
            </div>
            <div style={{
              fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Inter',
              marginBottom: 4
            }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        {/* Graphique des revenus */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, color: 'var(--text-primary)' }}>Revenus mensuels</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Évolution sur 6 mois</p>
            </div>
            <span style={{
              background: 'rgba(16,185,129,0.1)', color: '#10b981',
              border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: 20, fontSize: 12,
              fontWeight: 600
            }}>+15%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#purpleGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Graphique par catégorie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, color: 'var(--text-primary)' }}>Commandes par catégorie</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Répartition cette semaine</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{
                background: 'var(--surface-3)',
                border: '1px solid var(--border-default)', borderRadius: 10
              }} />
              <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Dernières commandes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{
          background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
          borderRadius: 16, overflow: 'hidden'
        }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: 16, color: 'var(--text-primary)' }}>Dernières commandes</h3>
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
                <td>{order.clientName}</td>
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
    </div>
  );
}
