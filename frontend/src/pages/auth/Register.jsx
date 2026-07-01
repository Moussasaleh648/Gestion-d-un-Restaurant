import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Phone, ChefHat, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (!result.success) { setError(result.error); return; }
    // PublicRoute will automatically redirect based on the new auth state
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--surface-0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>


      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChefHat size={28} color="#0d1117" />
          </div>
          <h1 style={{ fontSize: 28, color: 'var(--text-primary)', marginBottom: 6 }}>Créer un compte</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Rejoignez la communauté FastFood - Tchad</p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 32,
        }}>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: 'var(--rose-400)', fontSize: 13,
            }}>
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          {[
            { key: 'name', label: 'Nom complet', placeholder: 'Jean Dupont', icon: User, type: 'text' },
            { key: 'email', label: 'Email', placeholder: 'jean@email.com', icon: Mail, type: 'email' },
            { key: 'phone', label: 'Téléphone', placeholder: '+235 66 00 00 00', icon: Phone, type: 'tel' },
          ].map(field => (
            <div key={field.key} className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">{field.label}</label>
              <div style={{ position: 'relative' }}>
                <field.icon size={16} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type={field.type}
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  required={field.key !== 'phone'}
                />
              </div>
            </div>
          ))}

          <div className="form-group" style={{ marginBottom: 16 }}>
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
                placeholder="Minimum 6 caractères"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute',
                right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer'
              }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Confirmer le mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: 42 }}
                placeholder="Répéter le mot de passe"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}
            style={{ justifyContent: 'center' }}>
            {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : (<><span>Créer mon compte</span> <ArrowRight size={16} /></>)}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Déjà un compte ? <Link to="/login" style={{ color: 'var(--gold-400)', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
