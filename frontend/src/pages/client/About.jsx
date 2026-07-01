import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function About() {
  const { restaurant } = useData();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Votre message a bien été envoyé ! Nous vous répondrons très vite.");
    setForm({ name: '', email: '', message: '' });
  };

  const gallery = [
    "/images/about-1.jpg",
    "/images/about-2.jpg",
    "/images/about-3.jpg",
    "/images/about-4.jpg"
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Section héro */}
      <div style={{
        position: 'relative', height: 400,
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), 
        url('/images/about-bg.jpg') center/cover`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'white', textAlign: 'center', padding: 24
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, fontFamily: 'Playfair Display, serif' }}
        >
          Notre Histoire
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: 18, maxWidth: 600, color: 'rgba(255,255,255,0.8)' }}
        >
          Découvrez la passion et l'héritage derrière {restaurant?.name}.
        </motion.p>
      </div>

      <div style={{ maxWidth: 1200, margin: '-60px auto 0', position: 'relative', padding: '0 24px' }}>

        {/* Cartes d'information */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24, marginBottom: 60
        }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              background: 'var(--surface-1)', padding: 32, borderRadius: 20, border: '1px solid var(--border-subtle)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 12, background: 'rgba(249,115,22,0.1)',
              color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Heures d'ouverture</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Lundi - Dimanche</p>
            <p style={{
              fontSize: 18, fontWeight: 700,
              color: '#f97316'
            }}>{restaurant?.openTime} - {restaurant?.closeTime}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{
              background: 'var(--surface-1)', padding: 32, borderRadius: 20, border: '1px solid var(--border-subtle)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 12, background: 'rgba(16,185,129,0.1)',
              color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
            }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Emplacement</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>{restaurant?.address}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{
              background: 'var(--surface-1)', padding: 32, borderRadius: 20,
              border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 12, background: 'rgba(59,130,246,0.1)',
              color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
            }}>
              <Phone size={24} />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 12 }}>Contact</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>{restaurant?.phone}</p>
            <p style={{ color: 'var(--text-secondary)' }}>{restaurant?.email}</p>
          </motion.div>
        </div>

        {/* Histoire du restaurant */}
        <div style={{
          marginBottom: 60, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 40, alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: 32, marginBottom: 24, fontFamily: 'Playfair Display, serif' }}>
              L'Art de la Cuisine Tchadienne</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Fondé avec une vision claire, <strong>{restaurant?.name}</strong>
              s'engage à offrir une expérience culinaire unique au cœur de N'Djaména.
              Nous combinons les saveurs traditionnelles du Tchad avec des techniques modernes de la restauration rapide.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Notre équipe de chefs passionnés sélectionne chaque jour les meilleurs ingrédients locaux pour préparer
              des plats savoureux et authentiques. De notre célèbre Burger Tchad Classic à nos grillades parfumées,
              chaque repas est une célébration de notre culture.
            </p>
          </div>
          <div>
            <img
              src="/images/about-chef.jpg"
              alt="Cuisine"
              style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>

        {/* Formulaire de contact */}
        <div style={{
          background: 'var(--surface-1)', borderRadius: 24, padding: '40px 32px',
          border: '1px solid var(--border-subtle)', marginBottom: 60, display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: 32, marginBottom: 16, fontFamily: 'Playfair Display, serif' }}>Écrivez-nous</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              Vous avez une question, une suggestion ou une demande de réservation de groupe ? N'hésitez pas à nous
              contacter via ce formulaire. Notre équipe vous répondra dans les plus brefs délais.
            </p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input type="text" className="form-input" placeholder="Votre nom" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Adresse E-mail</label>
              <input type="email" className="form-input" placeholder="votre@email.com" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Votre message</label>
              <textarea className="form-input" placeholder="Dites-nous tout..." rows={4}
                style={{ resize: 'vertical' }} required value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ justifyContent: 'center', padding: '12px', marginTop: 8 }}>
              {loading ? <div className="spinner"
                style={{ width: 20, height: 20, borderWidth: 2 }} /> : "Envoyer le message"}
            </button>
          </form>
        </div>

        {/* Galerie photo */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{
            fontSize: 32, marginBottom: 32, textAlign: 'center',
            fontFamily: 'Playfair Display, serif'
          }}>Notre Galerie</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {gallery.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{ borderRadius: 20, overflow: 'hidden', height: 300, cursor: 'pointer' }}
              >
                <img src={img} alt="Gallery item" style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', transition: 'transform 0.5s'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
