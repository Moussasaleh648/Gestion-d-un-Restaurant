import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag,
  Table2, Users, BarChart2, LogOut, Bell, Receipt, Plus, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ORDER_STATUS } from '../../data/mockData';

const NAV_ITEMS = [
  { path: '/caissier/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/caissier/orders', icon: ShoppingBag, label: 'Commandes', badge: true },
  { path: '/caissier/new-order', icon: Plus, label: 'Nouvelle commande' },
  { path: '/caissier/menu', icon: UtensilsCrossed, label: 'Menu' },
  { path: '/caissier/tables', icon: Table2, label: <span translate="no" className="notranslate">Tables</span> },
  { path: '/caissier/staff', icon: Users, label: 'Personnel' },
  { path: '/caissier/reports', icon: BarChart2, label: 'Rapports' },
];

export default function CaissierLayout() {
  const { currentUser, logout } = useAuth();
  const { orders, restaurant } = useData();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrders = orders.filter(o =>
    o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.CONFIRMED
  ).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-layout">
      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: 'var(--sidebar-width)', zIndex: 100,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              🍔
            </div>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', maxWidth: 150,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {restaurant?.name || 'FastFood_Tchad'}
              </div>
              <div style={{ fontSize: 11, color: '#f97316' }}>Espace Caissier</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
            color: 'var(--text-muted)', padding: '8px 10px', marginBottom: 4
          }}>
            Gestion
          </div>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                fontSize: 14, fontWeight: 500,
                background: isActive ? 'rgba(249, 115, 22, 0.12)' : 'transparent',
                color: isActive ? '#f97316' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
                transition: 'all 0.2s', position: 'relative',
              })}
            >
              <item.icon size={18} />
              {item.label}
              {item.badge && pendingOrders > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444', color: 'white',
                  borderRadius: '50%', width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                }}>
                  {pendingOrders}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--surface-2)', marginBottom: 8,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: 12,
            }}>
              {currentUser?.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{currentUser?.name}</div>
              <div style={{ fontSize: 11, color: '#f97316' }}>Caissier</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost w-full" style={{ justifyContent: 'center' }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="layout-header" style={{
        position: 'fixed', top: 0, left: 'var(--sidebar-width)', right: 0,
        height: 'var(--header-height)', zIndex: 50,
        background: 'rgba(13, 17, 23, 0.9)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', padding: '0 32px', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            style={{ display: 'flex' /* overridden by media query */, background: 'var(--surface-2)' }}
          >
            <Menu size={20} />
          </button>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }} className="desktop-nav">
            Espace <span style={{ color: '#f97316' }}> Caissier</span>  - {restaurant?.name}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {pendingOrders > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-full)', padding: '4px 12px',
              fontSize: 12, color: '#f87171',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
                display: 'inline-block', animation: 'caissierPulse 1.5s infinite'
              }} />
              <span className="hide-on-mobile">{pendingOrders} commande{pendingOrders > 1 ? 's' : ''} en attente</span>
              <span className="mobile-only-count" style={{ display: 'none' }}>{pendingOrders}</span>
            </div>
          )}
          <button style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={16} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes caissierPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
