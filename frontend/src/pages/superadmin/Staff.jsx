import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Phone, Wallet } from 'lucide-react';
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
      name: '', role: 'Serveur', phone: '', salary: '',
      status: 'active'
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
    if (window.confirm(`Supprimer ${name} de l'équipe ?`)) {
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Personnel</h1>
          <p>{staff.length} employés - {activeStaff.length} actifs</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', gap: 8 }}>
          <Plus size={16} /> Ajouter un employé
        </button>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        <div style={{
          flex: 1, background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total employés</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#f97316' }}>{staff.length}</div>
        </div>
        <div style={{
          flex: 1, background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Actifs</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981' }}>{activeStaff.length}</div>
        </div>
        <div style={{
          flex: 1, background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Masse salariale</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#8b5cf6' }}>{totalSalary.toLocaleString('fr-FR')} FCFA</div>
        </div>
      </div>

      <div className="grid-3">
        {staff.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
              borderRadius: 16, padding: 20, opacity: s.status === 'active' ? 1 : 0.7
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700
              }}>
                {s.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>{s.name}</h3>
                <span style={{
                  fontSize: 11, background: 'rgba(249,115,22,0.15)', color: '#f97316',
                  padding: '2px 10px', borderRadius: 10, fontWeight: 600
                }}>{s.role}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                background: s.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                color: s.status === 'active' ? '#10b981' : '#f59e0b'
              }}>
                {s.status === 'active' ? 'Actif' : 'En congé'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Phone size={14} /> {s.phone || 'Non renseigné'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <Wallet size={14} /> {s.salary ? `${s.salary.toLocaleString('fr-FR')} FCFA / mois` : 'Non renseigné'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(s)}>
                <Edit2 size={12} /> Modifier
              </button>
              <button onClick={() => toggleStatus(s)} style={{
                padding: '6px 10px', borderRadius: 8,
                background: s.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${s.status === 'active' ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
                color: s.status === 'active' ? '#f59e0b' : '#10b981', cursor: 'pointer', fontSize: 11, fontWeight: 600
              }}>
                {s.status === 'active' ? 'Congé' : 'Activer'}
              </button>
              <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}
                onClick={() => handleDelete(s.id, s.name)}>
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>Aucun employé</h3>
          <p>Ajoutez des employés à votre équipe.</p>
        </div>
      )}

      {/* Fenêtre modale */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="modal-header">
              <h2>{editTarget ? 'Modifier employé' : 'Nouvel employé'}</h2>
              <button onClick={() => setShowModal(false)} style={{
                color: 'var(--text-muted)',
                cursor: 'pointer', background: 'none', border: 'none', fontSize: 20
              }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nom complet</label>
                <input className="form-input" placeholder="Ex: Fatima Oumar"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
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
                  <input className="form-input" placeholder="+235 66 ..."
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
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
              <button className="btn btn-primary" style={{
                flex: 2, justifyContent: 'center',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
              }} onClick={handleSave}>
                {editTarget ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
