import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Phone, Wallet, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export default function SuperAdminStaff() {
  const { staff, addStaff, updateStaffMember, deleteStaffMember } = useData();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ name: '', role: 'Serveur', phone: '', salary: '', status: 'active' });

  const openAdd = () => {
    setEditTarget(null); setForm({
      name: '', role: 'Serveur', phone: '',
      salary: '', status: 'active'
    }); setShowModal(true);
  };
  const openEdit = (s) => { setEditTarget(s); setForm({ ...s }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.role) { toast.error('Nom et rôle requis'); return; }
    const data = { ...form, salary: Number(form.salary) || 0 };
    if (editTarget) {
      updateStaffMember(editTarget.id, data);
      toast.success('Employé mis à jour');
    } else {
      addStaff({ ...data, status: 'active' });
      toast.success('Employé ajouté');
    }
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer ${name} ?`)) {
      deleteStaffMember(id);
      toast.success('Employé retiré');
    }
  };

  const toggleStatus = (s) => {
    const newStatus = s.status === 'active' ? 'on-leave' : 'active';
    updateStaffMember(s.id, { status: newStatus });
    toast.info(`${s.name} est maintenant ${newStatus === 'active' ? 'actif' : 'en congé'}`);
  };

  const activeStaff = staff.filter(s => s.status === 'active');
  const totalSalary = staff.reduce((sum, s) => sum + (s.salary || 0), 0);

  const roleColors = {
    'Caissier': '#f97316', 'Chef Cuisinière': '#ef4444', 'Aide-Cuisinier': '#f59e0b',
    'Serveur': '#3b82f6', 'Serveuse': '#3b82f6', 'Livreur': '#10b981', 'Manager': '#8b5cf6',
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Personnel</h1>
          <p>{staff.length} employés - {activeStaff.length} actifs - Masse salariale : {totalSalary.toLocaleString('fr-FR')} FCFA</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ gap: 8 }}><Plus size={16} /> Ajouter un employé</button>
      </div>

      {/* Tableau du personnel */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Rôle</th>
              <th>Téléphone</th>
              <th>Salaire</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700
                    }}>
                      {s.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                </td>
                <td>
                  <span style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: `${roleColors[s.role] || '#6b7280'}15`, color: roleColors[s.role] || '#6b7280',
                    fontWeight: 600
                  }}>
                    {s.role}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.phone || '—'}</td>
                <td style={{ fontWeight: 700, color: '#10b981' }}>{s.salary?.toLocaleString('fr-FR')} FCFA</td>
                <td>
                  <span style={{
                    fontSize: 12, padding: '3px 10px', borderRadius: 20,
                    background: s.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: s.status === 'active' ? '#10b981' : '#f59e0b', fontWeight: 600
                  }}>
                    {s.status === 'active' ? 'Actif' : 'En congé'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}><Edit2 size={13} /></button>
                    <button className="btn btn-sm" onClick={() => toggleStatus(s)}
                      style={{
                        background: s.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                        color: s.status === 'active' ? '#f59e0b' : '#10b981', border: 'none', fontSize: 12
                      }}>
                      {s.status === 'active' ? 'Congé' : 'Activer'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id, s.name)}>
                      <Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {staff.length === 0 && (
          <div className="empty-state"><div className="empty-state-icon">👥</div><h3>Aucun employé</h3></div>
        )}
      </motion.div>

      {/* Fenêtre modale */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="modal-header">
              <h2>{editTarget ? 'Modifier employé' : 'Nouvel employé'}</h2>
              <button onClick={() => setShowModal(false)} style={{
                color: 'var(--text-muted)', cursor: 'pointer',
                background: 'none', border: 'none', fontSize: 20
              }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input className="form-input" placeholder="Ex: Fatima Oumar" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="Caissier">Caissier</option>
                  <option value="Chef Cuisinière">Chef Cuisinier(e)</option>
                  <option value="Aide-Cuisinier">Aide-Cuisinier</option>
                  <option value="Serveur">Serveur / Serveuse</option>
                  <option value="Livreur">Livreur</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="form-input" placeholder="+235 66 ..." value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Salaire (FCFA/mois)</label>
                  <input type="number" className="form-input" placeholder="150000"
                    value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}
                onClick={handleSave}>
                {editTarget ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
