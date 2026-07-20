import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Flame } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const ALL_CATEGORIES = ['Entrées', 'Burgers', 'Plats', 'Accompagnements', 'Desserts', 'Boissons'];

export default function SuperAdminMenu() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    category: 'Plats', emoji: '🍽️', available: true, popular: false
  });

  const categories = ['all', ...new Set(menuItems.map(m => m.category))];

  const filtered = menuItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditTarget(null);
    setForm({
      name: '', description: '', price: '',
      category: activeCategory !== 'all' ? activeCategory : 'Plats', emoji: '🍽️',
      available: true, popular: false
    });
    setShowModal(true);
  };
  const openEdit = (m) => { setEditTarget(m); setForm({ ...m }); setShowModal(true); };

  const handleSave = () => {
    if (!form.name || !form.price || !form.category) { toast.error('Nom, prix et catégorie requis.'); return; }
    const itemData = { ...form, price: Number(form.price) };
    if (editTarget) {
      updateMenuItem(editTarget.id, itemData);
      toast.success('Plat mis à jour !');
    } else {
      addMenuItem(itemData);
      toast.success('Plat ajouté au menu !');
    }
    setShowModal(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Supprimer "${name}" du menu ?`)) {
      deleteMenuItem(id);
      toast.success('Plat supprimé.');
    }
  };

  const toggleStatus = (m) => {
    updateMenuItem(m.id, { available: !m.available });
    toast.info(`${m.name} est maintenant ${!m.available ? 'disponible' : 'indisponible'}.`);
  };

  const togglePopular = (m) => {
    updateMenuItem(m.id, { popular: !m.popular });
    toast.info(`${m.name} ${!m.popular ? 'ajouté aux populaires' : 'retiré des populaires'}.`);
  };

  const availableCount = menuItems.filter(m => m.available).length;
  const popularCount = menuItems.filter(m => m.popular).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Gestion du Menu</h1>
          <p>{menuItems.length} plats enregistrés dans la carte</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', gap: 8 }}>
          <Plus size={16} /> Ajouter un plat
        </button>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: 120, background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Total plats</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#f97316' }}>{menuItems.length}</div>
        </div>
        <div style={{
          flex: 1, minWidth: 120, background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Disponibles</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981' }}>{availableCount}</div>
        </div>
        <div style={{
          flex: 1, minWidth: 120, background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, padding: '16px 20px'
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Populaires 🔥</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#8b5cf6' }}>{popularCount}</div>
        </div>
      </div>

      {/* Barre de recherche + filtres catégories */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 260 }}>
          <Search size={16} color="var(--text-muted)" />
          <input placeholder="Rechercher dans le menu..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                whiteSpace: 'nowrap', border: '1px solid',
                background: activeCategory === cat ? 'rgba(249,115,22,0.15)' : 'var(--surface-2)',
                color: activeCategory === cat ? '#f97316' : 'var(--text-secondary)',
                borderColor: activeCategory === cat ? 'rgba(249,115,22,0.4)' : 'var(--border-default)',
                transition: 'all 0.2s',
              }}>
              {cat === 'all' ? 'Tout le menu' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid-3">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
              borderRadius: 16, padding: 20, opacity: item.available ? 1 : 0.65,
            }}
          >
            {/* En-tête : emoji + nom + prix */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>
                {item.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{
                  fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{item.name}</h3>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11, color: 'var(--text-muted)', background: 'var(--surface-3)',
                    padding: '2px 8px', borderRadius: 10
                  }}>{item.category}</span>
                  {item.popular && (
                    <span style={{
                      fontSize: 11, background: 'rgba(249,115,22,0.15)', color: '#f97316',
                      padding: '2px 8px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600
                    }}><Flame size={9} /> Pop.</span>
                  )}
                </div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, flexShrink: 0,
                background: item.available ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: item.available ? '#10b981' : '#ef4444'
              }}>
                {item.available ? 'Dispo' : 'Épuisé'}
              </span>
            </div>

            {/* Description + prix */}
            <p style={{
              fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8,
              overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: 40
            }}>{item.description}</p>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#10b981', marginBottom: 16 }}>
              {item.price.toLocaleString('fr-FR')} FCFA
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 6, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openEdit(item)}>
                <Edit2 size={12} /> Éditer
              </button>
              <button onClick={() => toggleStatus(item)} style={{
                padding: '6px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
                background: item.available ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)',
                border: `1px solid ${item.available ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'}`,
                color: item.available ? '#f87171' : '#34d399',
              }}>
                {item.available ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                {item.available ? 'Épuisé' : 'En stock'}
              </button>
              <button onClick={() => togglePopular(item)} style={{
                width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                background: item.popular ? 'rgba(249,115,22,0.1)' : 'var(--surface-3)',
                border: `1px solid ${item.popular ? 'rgba(249,115,22,0.3)' : 'var(--border-subtle)'}`,
                color: item.popular ? '#f97316' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Flame size={13} />
              </button>
              <button className="btn btn-danger btn-sm" style={{ padding: '6px 10px' }}
                onClick={() => handleDelete(item.id, item.name)}>
                <Trash2 size={13} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <h3>Aucun plat trouvé</h3>
          <p>Ajoutez des plats ou modifiez votre recherche.</p>
        </div>
      )}

      {/* Fenêtre modale */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div className="modal-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="modal-header">
              <h2>{editTarget ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
              <button onClick={() => setShowModal(false)} style={{
                color: 'var(--text-muted)', cursor: 'pointer',
                background: 'none', border: 'none', fontSize: 20
              }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Emoji</label>
                  <input className="form-input" style={{ textAlign: 'center', fontSize: 20, padding: 8 }}
                    value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom du plat</label>
                  <input className="form-input" placeholder="Ex: Burger Tchad Classic" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Ingrédients, préparation..."
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Prix (FCFA)</label>
                  <input type="number" min="0" className="form-input" placeholder="3500"
                    value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#f97316' }} />
                  Disponible à la vente
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: '#f97316' }} />
                  Populaire
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" style={{
                flex: 2, justifyContent: 'center',
                background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none'
              }} onClick={handleSave}>
                {editTarget ? 'Enregistrer' : 'Ajouter au menu'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
