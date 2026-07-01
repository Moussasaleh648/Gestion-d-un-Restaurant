import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, Wallet } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ORDER_STATUS } from '../../data/mockData';

const weekData = [
  { day: 'Lun', revenue: 48000, orders: 12 },
  { day: 'Mar', revenue: 72000, orders: 18 },
  { day: 'Mer', revenue: 60000, orders: 15 },
  { day: 'Jeu', revenue: 88000, orders: 22 },
  { day: 'Ven', revenue: 124000, orders: 31 },
  { day: 'Sam', revenue: 152000, orders: 38 },
  { day: 'Dim', revenue: 112000, orders: 28 },
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
          {payload[0].dataKey === 'revenue' ? 'FCFA' : 'commandes'}</p>
      </div>
    );
  }
  return null;
};

export default function CaissierReports() {
  const { orders, restaurant } = useData();

  const deliveredOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);
  const totalRevenue = deliveredOrders.reduce((acc, o) => acc + o.total, 0);
  const avgTicket = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rapports</h1>
          <p>Analysez les performances de {restaurant?.name}</p>
        </div>
      </div>

      <div className="stats-grid">
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'rgba(249,115,22,0.1)',
            border: '1px solid rgba(249,115,22,0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 16
          }}>
            <TrendingUp size={20} color="#f97316" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>
            {totalRevenue.toLocaleString('fr-FR')} FCFA</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Chiffre d'affaires total</div>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 16
          }}>
            <ShoppingBag size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>{orders.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Commandes totales</div>
        </motion.div>
        <motion.div className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16
          }}>
            <Wallet size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>
            {avgTicket.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Panier moyen</div>
        </motion.div>
      </div>

      <div className="grid-2" style={{ gap: 24, marginTop: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--surface-2)', padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20, color: 'var(--text-primary)' }}>Revenus de la semaine</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="caissierRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#caissierRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--surface-2)', padding: 24, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20, color: 'var(--text-primary)' }}>Volume de commandes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
