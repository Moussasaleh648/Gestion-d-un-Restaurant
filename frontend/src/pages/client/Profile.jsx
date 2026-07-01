import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ClientProfile() {
  const { currentUser, updateProfile } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    toast.success('Profil mis à jour avec succès');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
          fontWeight: 800, boxShadow: '0 10px 30px rgba(249,115,22,0.3)'
        }}>
          {currentUser?.avatar}
        </div>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 4, color: 'var(--text-primary)' }}>{currentUser?.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Membre depuis {new Date(currentUser?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 32 }}>
          <h2 style={{
            fontSize: 18, marginBottom: 24, display: 'flex',
            alignItems: 'center', gap: 10, color: 'var(--text-primary)'
          }}>
            <User size={20} color="#f97316" /> Informations personnelles
          </h2>

          <form onSubmit={handleSave} style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                  }} />
                  <input className="form-input" style={{ paddingLeft: 42 }} value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Adresse email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{
                    position: 'absolute', left: 14, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                  }} />
                  <input type="email" className="form-input" style={{ paddingLeft: 42 }}
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{
                  position: 'absolute', left: 14, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)'
                }} />
                <input className="form-input" style={{ paddingLeft: 42 }} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adresse de livraison par défaut</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-muted)' }} />
                <textarea className="form-input" rows={3}
                  style={{ paddingLeft: 42, resize: 'vertical' }}
                  value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg"
              style={{
                marginTop: 8, alignSelf: 'flex-start', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: 'none'
              }}>
              <Save size={18} /> Enregistrer les modifications
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 32 }}>
          <h2 style={{
            fontSize: 18, marginBottom: 24, display: 'flex',
            alignItems: 'center', gap: 10, color: 'var(--text-primary)'
          }}>
            <Lock size={20} color="#f97316" /> Sécurité
          </h2>
          <button className="btn btn-secondary">
            Modifier mon mot de passe
          </button>
        </motion.div>
      </div>
    </div>
  );
}
