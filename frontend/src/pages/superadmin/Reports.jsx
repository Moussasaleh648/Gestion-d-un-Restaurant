import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { ORDER_STATUS } from '../../data/mockData';

const monthlyRevenue = [
  { month: 'Jan', revenue: 850000 }, { month: 'Fév', revenue: 720000 },
  { month: 'Mar', revenue: 1100000 }, { month: 'Avr', revenue: 950000 },
  { month: 'Mai', revenue: 1350000 }, { month: 'Juin', revenue: 1580000 },
];

const categoryData = [
  { name: 'Burgers', value: 450000, color: '#f97316' },
  { name: 'Plats', value: 380000, color: '#8b5cf6' },
  { name: 'Boissons', value: 180000, color: '#3b82f6' },
  { name: 'Entrées', value: 150000, color: '#10b981' },
  { name: 'Desserts', value: 90000, color: '#f59e0b' },
  { name: 'Accompagnements', value: 120000, color: '#ec4899' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--surface-3)', border: '1px solid var(--border-default)',
        borderRadius: 10, padding: '10px 14px'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>{label || payload[0].name}</p>
        <p style={{ color: '#f97316', fontWeight: 700 }}>{payload[0].value?.toLocaleString('fr-FR')} FCFA</p>
      </div>
    );
  }
  return null;
};

export default function SuperAdminReports() {
  const { orders, restaurant, staff } = useData();

  const deliveredOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);
  const totalRevenue = deliveredOrders.reduce((acc, o) => acc + o.total, 0);
  const avgTicket = deliveredOrders.length > 0 ? totalRevenue / deliveredOrders.length : 0;
  const totalSalary = staff.reduce((sum, s) => sum + (s.salary || 0), 0);

  const topMetrics = [
    { label: 'Taux de satisfaction', value: `${restaurant?.rating || 0} ★`, color: '#f59e0b' },
    { label: 'Commandes totales', value: orders.length.toString(), color: '#3b82f6' },
    {
      label: 'Panier moyen', value: `${avgTicket.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA`,
      color: '#10b981'
    },
    { label: 'Masse salariale', value: `${(totalSalary / 1000).toFixed(0)}k FCFA`, color: '#f97316' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rapports & Analytics</h1>
          <p>Performances de {restaurant?.name}</p>
        </div>
        <span style={{
          background: 'rgba(16,185,129,0.1)', color: '#10b981',
          border: '1px solid rgba(16,185,129,0.2)', padding: '4px 12px', borderRadius: 20,
          fontSize: 12, fontWeight: 600
        }}>Données en temps réel</span>
      </div>

      {/* Indicateurs clés de performance */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {topMetrics.map((m, i) => (
          <motion.div key={m.label} className="stat-card" initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{
              fontSize: 28, fontWeight: 800, color: m.color, fontFamily: 'Inter',
              marginBottom: 8
            }}>{m.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        {/* Évolution des revenus */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 4, color: 'var(--text-primary)' }}>Revenus mensuels</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Évolution sur 6 mois</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} fill="url(#adminRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Graphique circulaire */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 4, color: 'var(--text-primary)' }}>Revenus par catégorie</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Répartition du chiffre d'affaires</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Histogramme des revenus */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, marginBottom: 4, color: 'var(--text-primary)' }}>Revenus par catégorie (barres)</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Comparaison des ventes</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={categoryData}>
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Revenu" fill="#f97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
