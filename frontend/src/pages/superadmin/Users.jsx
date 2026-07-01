import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, Edit2, Shield, Receipt, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ROLES } from '../../data/mockData';

const ROLE_CONFIG = {
  superadmin: { label: 'Super Admin', color: '#f97316', icon: Shield },
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Utilisateurs</h1>
          <p>{users.length} utilisateurs enregistrés</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ gap: 8 }}><Plus size={16} /> Nouvel utilisateur</button>
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

      {/* Tableau des utilisateurs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
          borderRadius: 16, overflow: 'hidden'
        }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const roleConf = ROLE_CONFIG[u.role];
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: `${roleConf?.color}20`, color: roleConf?.color, border: `1px solid ${roleConf?.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700
                      }}>
                        {u.avatar}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{u.email}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: roleConf?.color }}>
                      {roleConf && <roleConf.icon size={14} />} {roleConf?.label}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 12, padding: '3px 10px', borderRadius: 20,
                      background: u.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: u.status === 'active' ? '#10b981' : '#ef4444', fontWeight: 600
                    }}>
                      {u.status === 'active' ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{u.createdAt?.slice(0, 10)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}><Edit2 size={13} /></button>
                      <button className="btn btn-sm" onClick={() => toggleStatus(u)}
                        style={{
                          background: u.status === 'active' ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
                          color: u.status === 'active' ? '#ef4444' : '#10b981', border: 'none', fontSize: 12
                        }}>
                        {u.status === 'active' ? 'Suspendre' : 'Activer'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id, u.name)}>
                        <Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state"><h3>Aucun utilisateur trouvé</h3></div>
        )}
      </motion.div>

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
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}
                onClick={handleSave}>{editTarget ? 'Mettre à jour' : 'Créer'}</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
