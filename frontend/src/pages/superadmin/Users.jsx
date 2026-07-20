import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, Edit2, Shield, Receipt, User, Mail, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../data/mockData';

const ROLE_CONFIG = {
  superadmin: { label: 'Super Admin', color: '#c084fc', icon: Shield },
  caissier: { label: 'Caissier', color: '#f97316', icon: Receipt },
  client: { label: 'Client', color: '#10b981', icon: User },
};

export default function SuperAdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: ROLES.CLIENT });

  const filtered = users.filter(u => {
    if (u.role === ROLES.SUPERADMIN) return false;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', email: '', password: '', role: ROLES.CLIENT }); setShowModal(true);
  };
  const openEdit = (u) => {
    setEditTarget(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role }); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) { toast.error('Nom et email requis.'); return; }
    if (editTarget) {
      updateUser(editTarget.id, {
        name: form.name, email: form.email, role: form.role,
        ...(form.password ? { password: form.password } : {})
      });
      toast.success('Utilisateur mis à jour !');
    } else {
      if (!form.password) { toast.error('Mot de passe requis.'); return; }
      addUser({ ...form, avatar: form.name.slice(0, 2).toUpperCase(), status: 'active' });
      toast.success('Utilisateur créé !');
    }
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer "${name}" ?`)) { deleteUser(id); toast.success('Utilisateur supprimé.'); }
  };

  const toggleStatus = (u) => {
    updateUser(u.id, { status: u.status === 'active' ? 'suspended' : 'active' });
    toast.info(`Compte ${u.status === 'active' ? 'suspendu' : 'activé'}.`);
  };

  const caissierCount = users.filter(u => u.role === ROLES.CAISSIER).length;
  const clientCount = users.filter(u => u.role === ROLES.CLIENT).length;
  const activeCount = users.filter(u => u.role !== ROLES.SUPERADMIN && u.status === 'active').length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Utilisateurs</h1>
          <p>{filtered.length} utilisateurs affichés</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', gap: 8 }}>
          <Plus size={16} /> Nouvel utilisateur
        </button>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: 120, background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Caissiers</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#f97316' }}>{caissierCount}</div>
        </div>
        <div style={{
          flex: 1, minWidth: 120, background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Clients</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981' }}>{clientCount}</div>
        </div>
        <div style={{
          flex: 1, minWidth: 120, background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Actifs</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#8b5cf6' }}>{activeCount}</div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', ROLES.CAISSIER, ROLES.CLIENT].map(role => (
            <button key={role} onClick={() => setFilterRole(role)}
              style={{
                padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                background: filterRole === role ? 'rgba(249,115,22,0.15)' : 'var(--surface-2)',
                color: filterRole === role ? '#f97316' : 'var(--text-secondary)',
                border: filterRole === role ? '1px solid rgba(249,115,22,0.4)' : '1px solid var(--border-default)',
              }}>
              {role === 'all' ? 'Tous' : ROLE_CONFIG[role]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid-3">
        {filtered.map((u, i) => {
          const roleConf = ROLE_CONFIG[u.role];
          return (
            <motion.div key={u.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: 20,
                opacity: u.status === 'active' ? 1 : 0.75
              }}>

              {/* En-tête : avatar + nom + badge rôle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${roleConf?.color}20`, color: roleConf?.color,
                  border: `1px solid ${roleConf?.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700
                }}>
                  {u.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 4, fontWeight: 700 }}>{u.name}</h3>
                  <span style={{
                    fontSize: 11, padding: '2px 10px', borderRadius: 10, fontWeight: 600,
                    background: `${roleConf?.color}18`, color: roleConf?.color,
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}>
                    {roleConf && <roleConf.icon size={11} />} {roleConf?.label}
                  </span>
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                  background: u.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: u.status === 'active' ? '#10b981' : '#ef4444'
                }}>
                  {u.status === 'active' ? 'Actif' : 'Suspendu'}
                </span>
              </div>

              {/* Infos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <Mail size={14} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <Calendar size={14} /> Inscrit le {u.createdAt?.slice(0, 10) || '—'}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(u)}>
                  <Edit2 size={12} /> Modifier
                </button>
                <button onClick={() => toggleStatus(u)} style={{
                  padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  background: u.status === 'active' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                  border: `1px solid ${u.status === 'active' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                  color: u.status === 'active' ? '#ef4444' : '#10b981',
                }}>
                  {u.status === 'active' ? 'Suspendre' : 'Activer'}
                </button>
                <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}
                  onClick={() => handleDelete(u.id, u.name)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3>Aucun utilisateur trouvé</h3>
          <p>Modifiez vos filtres ou ajoutez un utilisateur.</p>
        </div>
      )}

      {/* Fenêtre modale */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="modal-header">
              <h2>{editTarget ? 'Modifier' : 'Nouvel'} utilisateur</h2>
              <button onClick={() => setShowModal(false)} style={{
                color: 'var(--text-muted)',
                cursor: 'pointer', background: 'none', border: 'none', fontSize: 20
              }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              {[
                { key: 'name', label: 'Nom complet', placeholder: 'Hassan Mahamat', type: 'text' },
                { key: 'email', label: 'Email', placeholder: 'hassan@fastfood.td', type: 'email' },
                {
                  key: 'password', label: editTarget ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe',
                  placeholder: '••••••••', type: 'password'
                },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} className="form-input" placeholder={f.placeholder} value={form[f.key] || ''}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value={ROLES.CLIENT}>Client</option>
                  <option value={ROLES.CAISSIER}>Caissier</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" style={{
                flex: 2, justifyContent: 'center',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
              }} onClick={handleSave}>{editTarget ? 'Mettre à jour' : 'Créer'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
