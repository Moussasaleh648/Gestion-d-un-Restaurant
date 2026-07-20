import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { TABLE_STATUS } from '../../data/mockData';

export default function CaissierTables() {
  const { tables, reservations, addTable, updateTable, deleteTable, updateReservation } = useData();
  const toast = useToast();

  const sortedTables = [...tables].sort((a, b) => a.number - b.number);
  const pendingReservations = reservations.filter(r => r.status === 'pending');

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ number: '', capacity: 2 });

  const STATUS_CONFIG = {
    [TABLE_STATUS.AVAILABLE]: {
      label: 'Libre', color: '#10b981',
      bg: 'rgba(16,185,129,0.1)', next: TABLE_STATUS.OCCUPIED
    },
    [TABLE_STATUS.OCCUPIED]: {
      label: 'Occupée', color: '#f97316',
      bg: 'rgba(249,115,22,0.1)', next: TABLE_STATUS.RESERVED
    },
    [TABLE_STATUS.RESERVED]: {
      label: 'Réservée', color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.1)', next: TABLE_STATUS.AVAILABLE
    },
  };

  const cycleStatus = (table) => {
    const cfg = STATUS_CONFIG[table.status];
    updateTable(table.id, { status: cfg.next });
    toast.success(`Table ${table.number} → ${STATUS_CONFIG[cfg.next]?.label}`);
  };

  const handleAddTable = () => {
    if (!form.number) { toast.error('Numéro de table requis.'); return; }
    addTable({ number: Number(form.number), capacity: Number(form.capacity), status: TABLE_STATUS.AVAILABLE });
    toast.success(`Table ${form.number} ajoutée.`);
    setShowModal(false);
    setForm({ number: '', capacity: 2 });
  };

  const handleDeleteTable = (id, number) => {
    if (window.confirm(`Supprimer la Table ${number} ?`)) {
      deleteTable(id);
      toast.success(`Table ${number} supprimée.`);
    }
  };

  const stats = {
    available: tables.filter(t => t.status === TABLE_STATUS.AVAILABLE).length,
    occupied: tables.filter(t => t.status === TABLE_STATUS.OCCUPIED).length,
    reserved: tables.filter(t => t.status === TABLE_STATUS.RESERVED).length,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Gestion des <span translate="no" className="notranslate">Tables</span></h1>
          <p>{tables.length} tables - {stats.available} disponibles</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', gap: 8 }}>
          <Plus size={16} /> Ajouter une <span translate="no" className="notranslate">table</span>
        </button>
      </div>

      {/* Barre de statistiques */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Libres', count: stats.available, color: '#10b981' },
          { label: 'Occupées', count: stats.occupied, color: '#f97316' },
          { label: 'Réservées', count: stats.reserved, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, background: `${s.color}0f`,
            border: `1px solid ${s.color}30`, borderRadius: 14, padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</span>
            <span style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.count}</span>
          </div>
        ))}
      </div>

      {/* Grille des tables */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 16, marginBottom: 40
      }}>
        {sortedTables.map((table, i) => {
          const cfg = STATUS_CONFIG[table.status];
          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              style={{
                background: cfg.bg, border: `2px solid ${cfg.color}40`, borderRadius: 16,
                padding: 20, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s'
              }}
              whileHover={{ scale: 1.04, boxShadow: `0 8px 24px ${cfg.color}25` }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>🍽️</div>
              <div style={{
                fontSize: 22, fontWeight: 800, color: 'var(--text-primary)',
                marginBottom: 4
              }}><span translate="no" className="notranslate">Table</span> {table.number}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12, marginBottom: 12
              }}>
                <Users size={12} /> {table.capacity} personnes
              </div>
              <span style={{
                display: 'inline-block', fontSize: 12,
                fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                background: `${cfg.color}20`, color: cfg.color, marginBottom: 12
              }}>
                {cfg.label}
              </span>
              {/* Boutons d'actions asymétriques (mobile-friendly) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, width: '100%' }}>
                {/* Bouton Changer Statut (flex-1) */}
                <button
                  onClick={() => cycleStatus(table)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '10px 12px', borderRadius: 8, background: cfg.color,
                    border: 'none', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}
                  title="Changer statut"
                >
                  Changer statut
                </button>
                
                {/* Bouton Supprimer (shrink-0) */}
                <button
                  onClick={() => handleDeleteTable(table.id, table.number)}
                  style={{
                    flexShrink: 0, padding: '10px', borderRadius: 8, background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                  }}
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Réservations en attente */}
      {pendingReservations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
            borderRadius: 16, overflow: 'hidden'
          }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <Calendar size={18} color="#8b5cf6" />
            <h3 style={{ fontSize: 16, color: 'var(--text-primary)' }}>Réservations en attente ({pendingReservations.length})</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Couverts</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingReservations.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 600 }}>{res.clientName}</td>
                  <td>{res.date}</td>
                  <td>{res.time}</td>
                  <td><Users size={14} style={{ marginRight: 4 }} />{res.guests}</td>
                  <td style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>{res.notes || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => {
                        updateReservation(res.id, { status: 'confirmed' });
                        toast.success('Réservation confirmée !');
                      }} style={{
                        padding: '4px 12px',
                        borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                        color: '#34d399', fontSize: 12, cursor: 'pointer', fontWeight: 600
                      }}>Confirmer</button>
                      <button onClick={() => {
                        updateReservation(res.id, { status: 'cancelled' });
                        toast.error('Réservation annulée.');
                      }} style={{
                        padding: '4px 12px',
                        borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#f87171', fontSize: 12, cursor: 'pointer', fontWeight: 600
                      }}>Refuser</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Fenêtre modale - Ajouter une table */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h2>Ajouter une table</h2>
              <button onClick={() => setShowModal(false)} style={{
                color: 'var(--text-muted)',
                background: 'none', border: 'none', fontSize: 20, cursor: 'pointer'
              }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Numéro de table</label>
                <input type="number" min="1" className="form-input" placeholder="Ex: 9"
                  value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Capacité (personnes)</label>
                <input type="number" min="1" max="20" className="form-input" value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" style={{
                flex: 2, justifyContent: 'center',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
              }} onClick={handleAddTable}>
                Ajouter
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
