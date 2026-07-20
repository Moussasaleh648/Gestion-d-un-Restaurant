import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BarChart2, Settings,
  LogOut, Menu, X, Shield, Bell, UserCog, UtensilsCrossed
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/superadmin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { path: '/superadmin/menu', icon: UtensilsCrossed, label: 'Menu' },
  { path: '/superadmin/users', icon: Users, label: 'Utilisateurs' },
  { path: '/superadmin/staff', icon: UserCog, label: 'Personnel' },
  { path: '/superadmin/reports', icon: BarChart2, label: 'Rapports' },
  { path: '/superadmin/settings', icon: Settings, label: 'Paramètres' },
];

export default function SuperAdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <aside className={`sidebar sidebar-superadmin ${sidebarOpen ? 'open' : ''}`} style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        width: 'var(--sidebar-width)', zIndex: 100,
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>SuperAdmin</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>FastFood - Tchad</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{
            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px',
            color: 'var(--text-muted)', padding: '8px 10px', marginBottom: 4
          }}>
            Administration
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
                background: isActive ? 'rgba(192, 132, 252, 0.12)' : 'transparent',
                color: isActive ? '#c084fc' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid #c084fc' : '3px solid transparent',
                transition: 'all 0.2s',
              })}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--surface-2)', marginBottom: 8,
          }}>
            <div className="avatar" style={{
              background: 'linear-gradient(135deg, #c084fc, #7c3aed)',
              color: 'white', width: 34, height: 34, fontSize: 12
            }}>
              {currentUser?.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>{currentUser?.name}</div>
              <div style={{ fontSize: 11, color: '#c084fc' }}>Super Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost w-full" style={{ justifyContent: 'center', gap: 8 }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="layout-header" style={{
        position: 'fixed', top: 0, left: 'var(--sidebar-width)', right: 0,
        height: 'var(--header-height)', zIndex: 50,
        background: 'rgba(13, 17, 23, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', justifyContent: 'space-between',
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
            Administration <span style={{ color: '#c084fc' }}>FastFood - Tchad</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

      {/* Main */}
      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {/* Footer mobile superadmin */}
      <nav className="superadmin-mobile-footer" aria-label="Navigation mobile superadmin">
        <NavLink to="/superadmin/dashboard" className="superadmin-mobile-footer-item">
          <LayoutDashboard size={18} />
          <span>Accueil</span>
        </NavLink>
        <NavLink to="/superadmin/users" className="superadmin-mobile-footer-item">
          <Users size={18} />
          <span>Utilisateurs</span>
        </NavLink>
        <NavLink to="/superadmin/reports" className="superadmin-mobile-footer-item">
          <BarChart2 size={18} />
          <span>Rapports</span>
        </NavLink>
        <NavLink to="/superadmin/settings" className="superadmin-mobile-footer-item">
          <Settings size={18} />
          <span>Paramètres</span>
        </NavLink>
      </nav>
    </div>
  );
}
