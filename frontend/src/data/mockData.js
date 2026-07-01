// ============================================================
// DONNÉES FICTIVES — FastFood - Tchad (Restaurant unique)
// Rôles : superadmin | caissier | client
// ============================================================

export const ROLES = {
  SUPERADMIN: 'superadmin',
  CAISSIER: 'caissier',
  CLIENT: 'client',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
};

// ---- Le restaurant (unique) ----
export const RESTAURANT_ID = 'r1';

export const initialRestaurant = {
  id: 'r1',
  name: 'FastFood_Tchad',
  cuisine: 'Tchadienne / Fast-Food',
  description: 'Les saveurs authentiques du Tchad dans une ambiance moderne et chaleureuse. Burgers, grillades et spécialités locales.',
  address: 'Avenue Charles de Gaulle, N\'Djaména, Tchad',
  phone: '+235 66 00 00 00',
  email: 'contact@fastfood-tchad.td',
  rating: 4.6,
  reviewCount: 120,
  priceRange: 'FCFA FCFA',
  coverColor: '#f97316',
  openTime: '08:00',
  closeTime: '22:00',
  status: 'active',
  isOpen: true,
  deliveryTime: '15-25 min',
  minOrder: 1000,
  tags: ['Fast-Food', 'Tchadien', 'Livraison', 'Sur place'],
  createdAt: '2024-01-01',
  revenue: 4850000,
  totalOrders: 1872,
  logo: '🍔',
};

// ---- Utilisateurs ----
export const initialUsers = [
  {
    id: 'u1',
    name: 'Super Admin',
    email: 'admin@fastfood.td',
    password: 'admin123',
    role: ROLES.SUPERADMIN,
    avatar: 'SA',
    phone: '+235 66 00 00 01',
    createdAt: '2024-01-01',
    status: 'active',
  },
  {
    id: 'u2',
    name: 'Hassan Mahamat',
    email: 'caissier@fastfood.td',
    password: 'caissier123',
    role: ROLES.CAISSIER,
    avatar: 'HM',
    phone: '+235 66 00 00 02',
    createdAt: '2024-01-05',
    status: 'active',
  },
  {
    id: 'u3',
    name: 'Caissier 2',
    email: 'caissier2@fastfood.td',
    password: 'caissier123',
    role: ROLES.CAISSIER,
    avatar: 'C2',
    phone: '+235 66 00 00 03',
    createdAt: '2024-02-10',
    status: 'active',
  },
  {
    id: 'u4',
    name: 'Alice Ngabo',
    email: 'alice@mail.td',
    password: 'client123',
    role: ROLES.CLIENT,
    avatar: 'AN',
    phone: '+235 66 11 22 33',
    address: 'Quartier Ambassatna, N\'Djaména',
    createdAt: '2024-03-15',
    status: 'active',
  },
  {
    id: 'u5',
    name: 'Ibrahim Saleh',
    email: 'ibrahim@mail.td',
    password: 'client123',
    role: ROLES.CLIENT,
    avatar: 'IS',
    phone: '+235 66 44 55 66',
    address: 'Quartier Moursal, N\'Djaména',
    createdAt: '2024-04-20',
    status: 'active',
  },
];

// ---- Menu du restaurant ----
export const initialMenuItems = [
  // Entrées
  {
    id: 'm1', category: 'Entrées', name: 'Salade Tchadienne',
    description: 'Salade fraîche, tomates, oignons, citron et épices locales',
    price: 1500, available: true, popular: true, emoji: '🥗'
  },
  {
    id: 'm2', category: 'Entrées', name: 'Soupe de Boulettes',
    description: 'Boulettes de viande dans un bouillon parfumé aux herbes',
    price: 2000, available: true, popular: false, emoji: '🍲'
  },
  {
    id: 'm3', category: 'Entrées', name: 'Accras de Haricots',
    description: 'Beignets de haricots croustillants, sauce pimentée maison',
    price: 1000, available: true, popular: true, emoji: '🫘'
  },
  // Burgers & Fast-Food
  {
    id: 'm4', category: 'Burgers', name: 'Burger Tchad Classic',
    description: 'Steak bœuf local, cheddar, laitue, tomate, sauce maison',
    price: 3500, available: true, popular: true, emoji: '🍔'
  },
  {
    id: 'm5', category: 'Burgers', name: 'Burger Épicé Sahara',
    description: 'Double steak, piment harissa, oignons caramélisés, avocat',
    price: 4500, available: true, popular: true, emoji: '🌶️'
  },
  {
    id: 'm6', category: 'Burgers', name: 'Chicken Burger',
    description: 'Poulet grillé croustillant, mayo ail, concombre',
    price: 3000, available: true, popular: false, emoji: '🍗'
  },
  // Plats traditionnels
  {
    id: 'm7', category: 'Plats', name: 'Poulet Grillé + Riz',
    description: 'Demi-poulet grillé aux épices tchadiennes, riz pilaf',
    price: 5000, available: true, popular: true, emoji: '🍛'
  },
  {
    id: 'm8', category: 'Plats', name: 'Mouton Braisé',
    description: 'Côtelettes de mouton braisées, légumes grillés, pain',
    price: 6000, available: true, popular: false, emoji: '🥩'
  },
  {
    id: 'm9', category: 'Plats', name: 'Thiéboudienne',
    description: 'Riz au poisson, légumes mijotés sauce tomate, citron',
    price: 4000, available: true, popular: true, emoji: '🐟'
  },
  {
    id: 'm10', category: 'Plats', name: 'Millet Sauce Arachide',
    description: 'Boule de millet avec sauce arachide traditionnelle',
    price: 2500, available: false, popular: false, emoji: '🫙'
  },
  // Accompagnements
  {
    id: 'm11', category: 'Accompagnements', name: 'Frites Maison',
    description: 'Frites de pommes de terre fraîches, épicées ou nature',
    price: 1000, available: true, popular: true, emoji: '🍟'
  },
  {
    id: 'm12', category: 'Accompagnements', name: 'Riz Blanc',
    description: 'Riz basmati cuit à la perfection',
    price: 800, available: true, popular: false, emoji: '🍚'
  },
  {
    id: 'm13', category: 'Accompagnements', name: 'Plantain Frit',
    description: 'Banane plantain mûre frite, légèrement sucrée',
    price: 1200, available: true, popular: false, emoji: '🍌'
  },
  // Desserts
  {
    id: 'm14', category: 'Desserts', name: 'Gâteau au Sésame',
    description: 'Gâteau traditionnel au sésame et miel',
    price: 1500, available: true, popular: false, emoji: '🍰'
  },
  {
    id: 'm15', category: 'Desserts', name: 'Fruits Frais',
    description: 'Sélection de fruits de saison : mangue, papaye, ananas',
    price: 1000, available: true, popular: false, emoji: '🍉'
  },
  // Boissons
  {
    id: 'm16', category: 'Boissons', name: 'Jus de Gingembre',
    description: 'Jus frais gingembre-citron, légèrement sucré',
    price: 800, available: true, popular: true, emoji: '🫚'
  },
  {
    id: 'm17', category: 'Boissons', name: 'Bissap (Hibiscus)',
    description: 'Infusion froide de fleur d\'hibiscus rouge',
    price: 700, available: true, popular: true, emoji: '🌺'
  },
  {
    id: 'm18', category: 'Boissons', name: 'Eau Minérale',
    description: 'Bouteille 1,5L eau minérale fraîche',
    price: 500, available: true, popular: false, emoji: '💧'
  },
  {
    id: 'm19', category: 'Boissons', name: 'Coca-Cola',
    description: 'Coca-Cola 33cl bien frais',
    price: 600, available: true, popular: false, emoji: '🥤'
  },
];

// ---- Commandes ----
export const initialOrders = [
  {
    id: 'o1',
    clientId: 'u4',
    clientName: 'Alice Ngabo',
    items: [
      { menuItemId: 'm4', name: 'Burger Tchad Classic', price: 3500, quantity: 2 },
      { menuItemId: 'm11', name: 'Frites Maison', price: 1000, quantity: 2 },
      { menuItemId: 'm17', name: 'Bissap (Hibiscus)', price: 700, quantity: 2 },
    ],
    total: 10400,
    status: ORDER_STATUS.DELIVERED,
    type: 'dine-in',
    table: 'Table 3',
    createdAt: '2024-06-28T12:30:00',
    updatedAt: '2024-06-28T13:15:00',
    notes: 'Peu épicé',
    createdBy: 'client',
  },
  {
    id: 'o2',
    clientId: 'u5',
    clientName: 'Ibrahim Saleh',
    items: [
      { menuItemId: 'm7', name: 'Poulet Grillé + Riz', price: 5000, quantity: 1 },
      { menuItemId: 'm16', name: 'Jus de Gingembre', price: 800, quantity: 1 },
    ],
    total: 5800,
    status: ORDER_STATUS.PREPARING,
    type: 'delivery',
    address: 'Quartier Moursal, N\'Djaména',
    createdAt: '2024-06-29T12:15:00',
    updatedAt: '2024-06-29T12:20:00',
    notes: '',
    createdBy: 'client',
  },
  {
    id: 'o3',
    clientId: null,
    clientName: 'Client sur place',
    items: [
      { menuItemId: 'm5', name: 'Burger Épicé Sahara', price: 4500, quantity: 1 },
      { menuItemId: 'm11', name: 'Frites Maison', price: 1000, quantity: 1 },
    ],
    total: 5500,
    status: ORDER_STATUS.READY,
    type: 'dine-in',
    table: 'Table 1',
    createdAt: '2024-06-29T13:00:00',
    updatedAt: '2024-06-29T13:20:00',
    notes: 'Très épicé',
    createdBy: 'caissier',
    caissierName: 'Hassan Mahamat',
  },
  {
    id: 'o4',
    clientId: 'u4',
    clientName: 'Alice Ngabo',
    items: [
      { menuItemId: 'm9', name: 'Thiéboudienne', price: 4000, quantity: 2 },
      { menuItemId: 'm17', name: 'Bissap (Hibiscus)', price: 700, quantity: 2 },
    ],
    total: 9400,
    status: ORDER_STATUS.PENDING,
    type: 'dine-in',
    table: 'Table 5',
    createdAt: '2024-06-29T13:30:00',
    updatedAt: '2024-06-29T13:30:00',
    notes: '',
    createdBy: 'client',
  },
];

// ---- Tables ----
export const initialTables = [
  { id: 't1', number: 1, capacity: 2, status: TABLE_STATUS.OCCUPIED },
  { id: 't2', number: 2, capacity: 4, status: TABLE_STATUS.AVAILABLE },
  { id: 't3', number: 3, capacity: 4, status: TABLE_STATUS.AVAILABLE },
  { id: 't4', number: 4, capacity: 6, status: TABLE_STATUS.RESERVED },
  { id: 't5', number: 5, capacity: 4, status: TABLE_STATUS.OCCUPIED },
  { id: 't6', number: 6, capacity: 8, status: TABLE_STATUS.AVAILABLE },
  { id: 't7', number: 7, capacity: 2, status: TABLE_STATUS.AVAILABLE },
  { id: 't8', number: 8, capacity: 4, status: TABLE_STATUS.RESERVED },
];

// ---- Réservations ----
export const initialReservations = [
  {
    id: 'res1',
    clientId: 'u4',
    clientName: 'Alice Ngabo',
    tableId: 't4',
    date: '2024-06-30',
    time: '19:00',
    guests: 4,
    status: 'confirmed',
    notes: 'Anniversaire',
    createdAt: '2024-06-28',
  },
  {
    id: 'res2',
    clientId: 'u5',
    clientName: 'Ibrahim Saleh',
    tableId: 't8',
    date: '2024-06-29',
    time: '20:00',
    guests: 3,
    status: 'pending',
    notes: '',
    createdAt: '2024-06-29',
  },
];

// ---- Avis clients ----
export const initialReviews = [
  {
    id: 'rev1',
    clientId: 'u4',
    clientName: 'Alice Ngabo',
    rating: 5,
    comment: 'Excellent ! Le Burger Tchad Classic est délicieux et le service très rapide.',
    createdAt: '2024-06-28',
  },
  {
    id: 'rev2',
    clientId: 'u5',
    clientName: 'Ibrahim Saleh',
    rating: 4,
    comment: 'Très bon poulet grillé, bien épicé. Je reviendrai assurément.',
    createdAt: '2024-06-15',
  },
];

// ---- Personnel ----
export const initialStaff = [
  {
    id: 's1', name: 'Hassan Mahamat', role: 'Caissier', phone: '+235 66 00 00 02',
    status: 'active', salary: 150000, startDate: '2024-01-05'
  },
  {
    id: 's2', name: 'Caissier 2', role: 'Caissier', phone: '+235 66 00 00 03',
    status: 'active', salary: 140000, startDate: '2024-02-10'
  },
  {
    id: 's3', name: 'Fatima Oumar', role: 'Chef Cuisinière', phone: '+235 66 77 88 99',
    status: 'active', salary: 200000, startDate: '2024-01-01'
  },
  {
    id: 's4', name: 'Abdelkrim Ali', role: 'Serveur', phone: '+235 66 33 44 55',
    status: 'active', salary: 120000, startDate: '2024-03-01'
  },
  {
    id: 's5', name: 'Mariam Baba', role: 'Serveuse', phone: '+235 66 22 11 00',
    status: 'on-leave', salary: 120000, startDate: '2024-04-15'
  },
  {
    id: 's6', name: 'Youssouf Idriss', role: 'Aide-Cuisinier', phone: '+235 66 55 44 33',
    status: 'active', salary: 100000, startDate: '2024-05-01'
  },
];

// ---- Promotions ----
export const initialPromotions = [
  {
    id: 'p1', title: 'Happy Hour', description: '-20% sur tous les burgers entre 12h et 14h',
    discount: 20, type: 'percentage', active: true, endDate: '2024-12-31'
  },
  {
    id: 'p2', title: 'Menu Famille', description: '4 plats + 4 boissons à prix spécial',
    discount: 15, type: 'percentage', active: true, endDate: '2024-12-31'
  },
];
