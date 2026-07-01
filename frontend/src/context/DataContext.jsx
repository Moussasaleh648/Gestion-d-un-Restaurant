import { createContext, useContext, useState, useCallback } from 'react';
import {
  initialUsers,
  initialRestaurant,
  initialMenuItems,
  initialOrders,
  initialTables,
  initialReservations,
  initialReviews,
  initialStaff,
  initialPromotions,
} from '../data/mockData';

// ---- Utilitaire : Charger depuis localStorage ou utiliser les valeurs par défaut ----
const load = (key, defaults) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaults;
  } catch {
    return defaults;
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
};

// ---- Création du Contexte ----
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const loaded = load('rms_users', initialUsers);
    let modified = false;
    const fixed = loaded.map(u => {
      if (u.name && u.name.trim().toLowerCase().includes('majesté')) {
        modified = true;
        return { ...u, name: 'Hassan Mahamat' };
      }
      return u;
    });
    if (modified) save('rms_users', fixed);
    return fixed;
  });
  const [restaurant, setRestaurant] = useState(() => load('rms_restaurant', initialRestaurant));
  const [menuItems, setMenuItems] = useState(() => load('rms_menuItems', initialMenuItems));
  const [orders, setOrders] = useState(() => load('rms_orders', initialOrders));
  const [tables, setTables] = useState(() => load('rms_tables', initialTables));
  const [reservations, setReservations] = useState(() => load('rms_reservations', initialReservations));
  const [reviews, setReviews] = useState(() => load('rms_reviews', initialReviews));
  const [staff, setStaff] = useState(() => {
    const loaded = load('rms_staff', initialStaff);
    let modified = false;
    const fixed = loaded.map(s => {
      if (s.name && s.name.trim().toLowerCase().includes('majesté')) {
        modified = true;
        return { ...s, name: 'Hassan Mahamat' };
      }
      return s;
    });
    if (modified) save('rms_staff', fixed);
    return fixed;
  });
  const [promotions, setPromotions] = useState(() => load('rms_promotions', initialPromotions));

  // ---- Fonction générique de mise à jour ----
  const update = useCallback((setter, key) => (data) => {
    setter(data);
    save(key, data);
  }, []);

  const updateUsers = update(setUsers, 'rms_users');
  const updateRestaurant = update(setRestaurant, 'rms_restaurant');
  const updateMenuItems = update(setMenuItems, 'rms_menuItems');
  const updateOrders = update(setOrders, 'rms_orders');
  const updateTables = update(setTables, 'rms_tables');
  const updateReservations = update(setReservations, 'rms_reservations');
  const updateReviews = update(setReviews, 'rms_reviews');
  const updateStaff = update(setStaff, 'rms_staff');
  const updatePromotions = update(setPromotions, 'rms_promotions');

  // ---- CRUD Utilisateurs ----
  const addUser = useCallback((user) => {
    const newUser = { ...user, id: `u${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...users, newUser];
    updateUsers(updated);
    return newUser;
  }, [users, updateUsers]);

  const updateUser = useCallback((id, data) => {
    const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
    updateUsers(updated);
  }, [users, updateUsers]);

  const deleteUser = useCallback((id) => {
    const updated = users.filter(u => u.id !== id);
    updateUsers(updated);
  }, [users, updateUsers]);

  // ---- Restaurant (instance unique) ----
  const updateRestaurantInfo = useCallback((data) => {
    const updated = { ...restaurant, ...data };
    updateRestaurant(updated);
  }, [restaurant, updateRestaurant]);

  // ---- CRUD Menu ----
  const addMenuItem = useCallback((item) => {
    const newItem = { ...item, id: `m${Date.now()}` };
    const updated = [...menuItems, newItem];
    updateMenuItems(updated);
    return newItem;
  }, [menuItems, updateMenuItems]);

  const updateMenuItem = useCallback((id, data) => {
    const updated = menuItems.map(m => m.id === id ? { ...m, ...data } : m);
    updateMenuItems(updated);
  }, [menuItems, updateMenuItems]);

  const deleteMenuItem = useCallback((id) => {
    const updated = menuItems.filter(m => m.id !== id);
    updateMenuItems(updated);
  }, [menuItems, updateMenuItems]);

  // ---- CRUD Commandes ----
  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: `o${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...orders, newOrder];
    updateOrders(updated);
    // Mise à jour du chiffre d'affaires et du nombre de commandes
    const updatedResto = {
      ...restaurant,
      totalOrders: restaurant.totalOrders + 1,
      revenue: restaurant.revenue + (order.total || 0),
    };
    updateRestaurant(updatedResto);
    return newOrder;
  }, [orders, updateOrders, restaurant, updateRestaurant]);

  const updateOrderStatus = useCallback((id, status) => {
    const updated = orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    updateOrders(updated);
  }, [orders, updateOrders]);

  const deleteOrder = useCallback((id) => {
    const updated = orders.filter(o => o.id !== id);
    updateOrders(updated);
  }, [orders, updateOrders]);

  // ---- Tables ----
  const updateTable = useCallback((id, data) => {
    const updated = tables.map(t => t.id === id ? { ...t, ...data } : t);
    updateTables(updated);
  }, [tables, updateTables]);

  const addTable = useCallback((table) => {
    const newTable = { ...table, id: `t${Date.now()}` };
    const updated = [...tables, newTable];
    updateTables(updated);
    return newTable;
  }, [tables, updateTables]);

  const deleteTable = useCallback((id) => {
    const updated = tables.filter(t => t.id !== id);
    updateTables(updated);
  }, [tables, updateTables]);

  // ---- Réservations ----
  const addReservation = useCallback((res) => {
    const newRes = { ...res, id: `res${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...reservations, newRes];
    updateReservations(updated);
    return newRes;
  }, [reservations, updateReservations]);

  const updateReservation = useCallback((id, data) => {
    const updated = reservations.map(r => r.id === id ? { ...r, ...data } : r);
    updateReservations(updated);
  }, [reservations, updateReservations]);

  // ---- Avis clients ----
  const addReview = useCallback((review) => {
    const newReview = { ...review, id: `rev${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...reviews, newReview];
    updateReviews(updated);
    // Mise à jour de la note moyenne du restaurant
    const avgRating = updated.reduce((sum, r) => sum + r.rating, 0) / updated.length;
    updateRestaurant({ ...restaurant, rating: Math.round(avgRating * 10) / 10, reviewCount: updated.length });
  }, [reviews, updateReviews, restaurant, updateRestaurant]);

  // ---- CRUD Personnel ----
  const addStaff = useCallback((member) => {
    const newMember = { ...member, id: `s${Date.now()}` };
    const updated = [...staff, newMember];
    updateStaff(updated);
    return newMember;
  }, [staff, updateStaff]);

  const updateStaffMember = useCallback((id, data) => {
    const updated = staff.map(s => s.id === id ? { ...s, ...data } : s);
    updateStaff(updated);
  }, [staff, updateStaff]);

  const deleteStaffMember = useCallback((id) => {
    const updated = staff.filter(s => s.id !== id);
    updateStaff(updated);
  }, [staff, updateStaff]);

  // ---- Promotions ----
  const addPromotion = useCallback((promo) => {
    const newPromo = { ...promo, id: `p${Date.now()}` };
    const updated = [...promotions, newPromo];
    updatePromotions(updated);
  }, [promotions, updatePromotions]);

  const togglePromotion = useCallback((id) => {
    const updated = promotions.map(p => p.id === id ? { ...p, active: !p.active } : p);
    updatePromotions(updated);
  }, [promotions, updatePromotions]);

  const deletePromotion = useCallback((id) => {
    const updated = promotions.filter(p => p.id !== id);
    updatePromotions(updated);
  }, [promotions, updatePromotions]);

  return (
    <DataContext.Provider value={{
      // Données
      users, restaurant, menuItems, orders, tables, reservations, reviews, staff, promotions,
      // Utilisateurs
      addUser, updateUser, deleteUser,
      // Restaurant (instance unique)
      updateRestaurantInfo,
      // Menu
      addMenuItem, updateMenuItem, deleteMenuItem,
      // Commandes
      addOrder, updateOrderStatus, deleteOrder,
      // Tables
      addTable, updateTable, deleteTable,
      // Réservations
      addReservation, updateReservation,
      // Avis
      addReview,
      // Personnel
      addStaff, updateStaffMember, deleteStaffMember,
      // Promotions
      addPromotion, togglePromotion, deletePromotion,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
