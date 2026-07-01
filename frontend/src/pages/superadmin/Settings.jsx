import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Percent, Bell, Shield, Clock, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useData } from '../../context/DataContext';

export default function SuperAdminSettings() {
  const toast = useToast();
  const { restaurant, updateRestaurantInfo } = useData();
  const [settings, setSettings] = useState({
    restaurantName: restaurant?.name || 'FastFood_Tchad',
    restaurantEmail: restaurant?.email || 'contact@fastfood-tchad.td',
    restaurantPhone: restaurant?.phone || '+235 66 00 00 00',
    restaurantAddress: restaurant?.address || '',
    openTime: restaurant?.openTime || '08:00',
    closeTime: restaurant?.closeTime || '22:00',
    minOrderAmount: restaurant?.minOrder || 1000,
    deliveryRadius: 10,
    isOpen: restaurant?.isOpen ?? true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    currency: 'XAF',
    language: 'fr',
  });

  const save = () => {
    updateRestaurantInfo({
      name: settings.restaurantName,
      email: settings.restaurantEmail,
      phone: settings.restaurantPhone,
      address: settings.restaurantAddress,
      openTime: settings.openTime,
      closeTime: settings.closeTime,
      minOrder: Number(settings.minOrderAmount),
      isOpen: settings.isOpen,
    });
    toast.success('Paramètres enregistrés avec succès !');
  };

  const Section = ({ icon: Icon, title, children }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
        borderRadius: 16, overflow: 'hidden', marginBottom: 20
      }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '18px 24px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: 'rgba(249,115,22,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color="#f97316" />
        </div>
        <h3 style={{ fontSize: 15, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </motion.div>
  );

  const Toggle = ({ label, desc, valueKey }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 0', borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      <button
        onClick={() => setSettings(s => ({ ...s, [valueKey]: !s[valueKey] }))}
        style={{
          width: 46, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: settings[valueKey] ? '#f97316' : 'var(--surface-3)',
          position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 10, background: 'white',
          left: settings[valueKey] ? 23 : 3, transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>Paramètres</h1>
          <p>Configuration de FastFood - Tchad</p>
        </div>
        <button className="btn btn-primary" onClick={save} style={{ gap: 8 }}><Save size={16} /> Enregistrer</button>
      </div>

      <div>
        <Section icon={Globe} title="Informations du restaurant">
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { key: 'restaurantName', label: 'Nom du restaurant' },
              { key: 'restaurantEmail', label: 'Email de contact' },
              { key: 'restaurantPhone', label: 'Téléphone' },
            ].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input className="form-input" value={settings[f.key]}
                  onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input className="form-input" value={settings.restaurantAddress}
                onChange={e => setSettings(s => ({ ...s, restaurantAddress: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Devise</label>
                <select className="form-select" value={settings.currency}
                  onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}>
                  <option value="XAF">XAF (FCFA)</option>
                  <option value="XOF">XOF (FCFA Ouest)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Langue</label>
                <select className="form-select" value={settings.language}
                  onChange={e => setSettings(s => ({ ...s, language: e.target.value }))}>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </Section>

        <Section icon={Clock} title="Horaires & Service">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Ouverture</label>
              <input type="time" className="form-input" value={settings.openTime}
                onChange={e => setSettings(s => ({ ...s, openTime: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Fermeture</label>
              <input type="time" className="form-input" value={settings.closeTime}
                onChange={e => setSettings(s => ({ ...s, closeTime: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Commande min. (FCFA)</label>
              <input type="number" className="form-input" value={settings.minOrderAmount}
                min={0} onChange={e => setSettings(s => ({ ...s, minOrderAmount: Number(e.target.value) }))} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <Toggle label="Restaurant ouvert" desc="Active ou désactive la prise de commandes clients"
              valueKey="isOpen" />
          </div>
        </Section>

        <Section icon={Bell} title="Notifications">
          <Toggle label="Notifications par email" desc="Alertes pour les nouvelles commandes et inscriptions"
            valueKey="emailNotifications" />
          <Toggle label="Notifications SMS" desc="Alertes SMS pour les événements critiques"
            valueKey="smsNotifications" />
        </Section>

        <Section icon={Shield} title="Sécurité">
          <Toggle label="Mode maintenance" desc="Désactive temporairement l'accès client"
            valueKey="maintenanceMode" />
        </Section>
      </div>
    </div>
  );
}
