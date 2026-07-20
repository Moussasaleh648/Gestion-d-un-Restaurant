import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ChefHat, Shield, Store, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', email: 'admin@fastfood.td', password: 'admin123', icon: Shield, color: '#c084fc' },
  { label: 'Caissier', email: 'caissier2@fastfood.td', password: 'caissier123', icon: Store, color: '#f97316' },
  { label: 'Client', email: 'alice@mail.td', password: 'client123', icon: User, color: '#10b981' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    }
    // PublicRoute will automatically redirect based on the new auth state
  };

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password });
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>


      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <ChefHat size={28} color="#0d1117" />
          </div>
          <h1 style={{ fontSize: 28, color: 'var(--text-primary)', marginBottom: 6 }}>Bon retour !</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Connectez - vous à votre espace</p>
        </div>

        {/* Demo Cards */}
        <div style={{
          background: 'var(--surface-2)', borderRadius: 16, padding: 16,
          border: '1px solid var(--border-subtle)', marginBottom: 24,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1,
            color: 'var(--text-muted)', marginBottom: 10
          }}>
            Comptes de démonstration
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '10px 8px', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--surface-3)', border: '1px solid var(--border-default)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = acc.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
              >
                <acc.icon size={18} color={acc.color} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
          borderRadius: 20, padding: 32,
        }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                color: 'var(--rose-400)', fontSize: 13,
              }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label">Adresse Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="votre@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: 42, paddingRight: 42 }}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full btn-lg"
            disabled={loading}
            style={{ justifyContent: 'center' }}
          >
            {loading ? (
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              <><span>Se connecter</span> <ArrowRight size={16} /></>
            )}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--gold-400)', fontWeight: 600 }}>
              Créer un compte client
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
