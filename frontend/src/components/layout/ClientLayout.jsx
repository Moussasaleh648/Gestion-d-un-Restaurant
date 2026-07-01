import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Home as HomeIcon, ClipboardList, LogIn, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function ClientLayout() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)' }}>
      {/* En-tête de la page */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 68, zIndex: 100,
        background: 'rgba(8, 10, 14, 0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>
            🍔
          </div>
          <div>
            <span style={{
              fontSize: 17, fontWeight: 800, color: 'var(--text-primary)',
              fontFamily: 'Playfair Display, serif'
            }}>
              FastFood<span style={{ color: '#f97316' }}> - Tchad</span>
            </span>
          </div>
        </Link>

        {/* Navigation principale */}
        <nav className="desktop-nav" style={{ alignItems: 'center', gap: 4 }}>
          <NavLink to="/" end style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: isActive ? '#f97316' : 'var(--text-secondary)',
            background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
            textDecoration: 'none',
          })}>
            <UtensilsCrossed size={16} /> Menu
          </NavLink>
          <NavLink to="/about" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
            borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: isActive ? '#f97316' : 'var(--text-secondary)',
            background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
            textDecoration: 'none',
          })}>
            <HomeIcon size={16} /> À propos
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: isActive ? '#f97316' : 'var(--text-secondary)',
                background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                textDecoration: 'none',
              })}>
                <ClipboardList size={16} /> Mes commandes
              </NavLink>
              <NavLink to="/profile" style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: isActive ? '#f97316' : 'var(--text-secondary)',
                background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                textDecoration: 'none',
              })}>
                <User size={16} /> Profil
              </NavLink>
            </>
          )}
        </nav>

        {/* Actions à droite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
            <button style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--surface-2)', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              <ShoppingCart size={18} />
            </button>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#f97316', color: 'white',
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800,
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="desktop-nav" style={{ alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 12,
              }}>
                {currentUser?.avatar}
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="desktop-nav" style={{ alignItems: 'center', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
                <LogIn size={15} /> Connexion
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
              }}>
                S'inscrire
              </Link>
            </div>
          )}

          {/* Bouton Menu Mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Menu Mobile (Dropdown) */}
      <div className={`mobile-nav-container ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            borderRadius: 8, fontSize: 16, fontWeight: 500,
            color: isActive ? '#f97316' : 'var(--text-primary)',
            background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
            textDecoration: 'none',
          })}>
            <UtensilsCrossed size={20} /> Menu
          </NavLink>
          <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            borderRadius: 8, fontSize: 16, fontWeight: 500,
            color: isActive ? '#f97316' : 'var(--text-primary)',
            background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
            textDecoration: 'none',
          })}>
            <HomeIcon size={20} /> À propos
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/orders" onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderRadius: 8, fontSize: 16, fontWeight: 500,
                color: isActive ? '#f97316' : 'var(--text-primary)',
                background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                textDecoration: 'none',
              })}>
                <ClipboardList size={20} /> Mes commandes
              </NavLink>
              <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderRadius: 8, fontSize: 16, fontWeight: 500,
                color: isActive ? '#f97316' : 'var(--text-primary)',
                background: isActive ? 'rgba(249,115,22,0.1)' : 'transparent',
                textDecoration: 'none',
              })}>
                <User size={20} /> Profil
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: 14,
                }}>
                  {currentUser?.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{currentUser?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Connecté</div>
                </div>
              </div>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="btn btn-ghost btn-sm">
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: 'center', textDecoration: 'none' }}>
                <LogIn size={18} style={{ marginRight: 6 }} /> Connexion
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ justifyContent: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none' }}>
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <main style={{ paddingTop: 68, minHeight: 'calc(100vh - 68px)' }}>
        <Outlet />
      </main>

      {/* Pied de page */}
      <footer style={{
        background: 'var(--surface-1)', borderTop: '1px solid var(--border-subtle)',
        padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)'
      }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{
            fontSize: 20, fontWeight: 800, color: 'var(--text-primary)',
            fontFamily: 'Playfair Display, serif'
          }}>
            FastFood<span style={{ color: '#f97316' }}> - Tchad</span>
          </span>
        </div>
        <p style={{ fontSize: 14, marginBottom: 16 }}>Les saveurs authentiques du Tchad dans une ambiance moderne.</p>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} FastFood - Tchad. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
