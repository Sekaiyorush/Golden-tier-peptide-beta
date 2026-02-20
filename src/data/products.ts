export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: string;
  purity: string;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  benefits?: string[];
  dosage?: string;
  createdAt: string;
  updatedAt: string;
}

export const products: Product[] = [
  {
    id: "bpc-157",
    name: "BPC-157",
    description: "Pentadecapeptide - Body Protection Compound",
    fullDescription: "BPC-157 is a synthetic peptide that is a partial sequence of body protection compound (BPC) found in human gastric juice. It has been studied for its potential regenerative effects on various tissues including tendons, ligaments, and muscles.",
    price: 49.99,
    category: "Healing",
    purity: "99.2%",
    inStock: true,
    stockQuantity: 150,
    sku: "BPC-157-5MG",
    benefits: [
      "Accelerates tissue regeneration",
      "Promotes tendon and ligament healing",
      "Supports muscle recovery",
      "May improve digestive health"
    ],
    dosage: "200-500mcg per day, subcutaneous injection",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-19",
  },
  {
    id: "tb-500",
    name: "TB-500",
    description: "Thymosin Beta-4 - Recovery peptide",
    fullDescription: "TB-500 is a synthetic version of Thymosin Beta-4, a naturally occurring peptide present in almost all human and animal cells. It plays a vital role in cell structure, motility, and tissue regeneration.",
    price: 54.99,
    category: "Recovery",
    purity: "99.1%",
    inStock: true,
    stockQuantity: 120,
    sku: "TB-500-5MG",
    benefits: [
      "Enhances wound healing",
      "Reduces inflammation",
      "Improves flexibility",
      "Supports cardiovascular health"
    ],
    dosage: "2-2.5mg twice weekly, subcutaneous injection",
    createdAt: "2024-01-20",
    updatedAt: "2024-02-19",
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    description: "GHRH Analogue - Growth hormone releasing hormone",
    fullDescription: "CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH) that increases plasma growth hormone levels by increasing the number of secreting cells and their secretion rate per cell.",
    price: 44.99,
    category: "Growth",
    purity: "98.9%",
    inStock: true,
    stockQuantity: 200,
    sku: "CJC-1295-2MG",
    benefits: [
      "Increases growth hormone secretion",
      "Promotes lean muscle mass",
      "Improves sleep quality",
      "Enhances fat metabolism"
    ],
    dosage: "100-300mcg per day, subcutaneous injection",
    createdAt: "2024-01-25",
    updatedAt: "2024-02-19",
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    description: "Growth hormone secretagogue",
    fullDescription: "Ipamorelin is a growth hormone releasing peptide (GHRP) that stimulates the pituitary gland to release growth hormone. It is considered one of the safest and most effective GHRPs.",
    price: 39.99,
    category: "Growth",
    purity: "99.0%",
    inStock: true,
    stockQuantity: 180,
    sku: "IPA-2MG",
    benefits: [
      "Stimulates natural GH release",
      "No cortisol or prolactin increase",
      "Supports anti-aging",
      "Improves body composition"
    ],
    dosage: "200-300mcg per day, subcutaneous injection",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-19",
  },
  {
    id: "ghrp-6",
    name: "GHRP-6",
    description: "Growth hormone releasing peptide",
    fullDescription: "GHRP-6 is a hexapeptide that stimulates the release of growth hormone by acting on the hypothalamus and pituitary gland. It is known for its strong appetite-stimulating effects.",
    price: 42.99,
    category: "Growth",
    purity: "98.8%",
    inStock: true,
    stockQuantity: 90,
    sku: "GHRP6-5MG",
    benefits: [
      "Potent GH release stimulation",
      "Increases appetite",
      "Supports muscle growth",
      "Improves recovery time"
    ],
    dosage: "100-200mcg per day, subcutaneous injection",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-19",
  },
  {
    id: "melanotan-2",
    name: "Melanotan II",
    description: "Melanocortin peptide",
    fullDescription: "Melanotan II is a synthetic analog of the naturally occurring melanocortin peptide hormone alpha-melanocyte stimulating hormone (α-MSH). It is studied for its effects on melanogenesis and sexual arousal.",
    price: 59.99,
    category: "Research",
    purity: "99.3%",
    inStock: true,
    stockQuantity: 75,
    sku: "MT2-10MG",
    benefits: [
      "Stimulates melanin production",
      "May enhance libido",
      "Potential appetite suppression",
      "UV protection effects"
    ],
    dosage: "250-500mcg per day, subcutaneous injection",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-19",
  },
];

export const featuredProducts = products.slice(0, 3);

// Categories
export const categories = [
  "Healing",
  "Recovery",
  "Growth",
  "Research",
  "Performance",
  "Anti-Aging",
];

// Partner with discount-based system (partners buy at discount to resell)
export interface Partner {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  discountRate: number; // Percentage discount (e.g., 20 = 20% off retail)
  totalPurchases: number; // Total amount partner has purchased
  totalResold: number; // Estimated amount partner has resold
  joinedAt: string;
  referredBy?: string; // ID of partner who referred this partner
  referrals: string[]; // IDs of partners referred by this partner
  notes?: string;
}

export const partners: Partner[] = [
  {
    id: "p1",
    name: "John Smith",
    email: "john@researchlab.com",
    company: "Advanced Research Lab",
    phone: "+1 (555) 123-4567",
    status: "active",
    discountRate: 25,
    totalPurchases: 12500,
    totalResold: 18750,
    joinedAt: "2024-01-15",
    referrals: ["p3"],
    notes: "High volume partner, reliable payments",
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    email: "sarah@biotech.com",
    company: "BioTech Solutions",
    phone: "+1 (555) 987-6543",
    status: "active",
    discountRate: 20,
    totalPurchases: 8750,
    totalResold: 12000,
    joinedAt: "2024-02-01",
    referrals: [],
    notes: "Growing partner, good communication",
  },
  {
    id: "p3",
    name: "Michael Chen",
    email: "michael@peptideworld.com",
    company: "Peptide World",
    phone: "+1 (555) 456-7890",
    status: "active",
    discountRate: 30,
    totalPurchases: 25000,
    totalResold: 38000,
    joinedAt: "2024-02-18",
    referredBy: "p1",
    referrals: ["p4"],
    notes: "Top tier partner, excellent performance",
  },
  {
    id: "p4",
    name: "Emily Davis",
    email: "emily@wellnesscenter.com",
    company: "Wellness Center Inc",
    phone: "+1 (555) 789-0123",
    status: "pending",
    discountRate: 15,
    totalPurchases: 0,
    totalResold: 0,
    joinedAt: "2024-02-25",
    referredBy: "p3",
    referrals: [],
    notes: "New application, pending verification",
  },
  {
    id: "p5",
    name: "Robert Wilson",
    email: "robert@fitnesssupply.com",
    company: "Fitness Supply Co",
    phone: "+1 (555) 321-6547",
    status: "inactive",
    discountRate: 20,
    totalPurchases: 3200,
    totalResold: 4500,
    joinedAt: "2023-11-10",
    referrals: [],
    notes: "On hold due to payment delays",
  },
];

// Customer data
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt?: string;
  status: 'active' | 'inactive';
  notes?: string;
  // Invitation tracking
  invitedBy?: string;
  invitedByName?: string;
  invitationCode?: string;
  partnerId?: string;
}

export const customers: Customer[] = [
  {
    id: "c1",
    name: "David Miller",
    email: "david.miller@email.com",
    phone: "+1 (555) 111-2222",
    totalOrders: 8,
    totalSpent: 2450.50,
    joinedAt: "2023-10-15",
    lastOrderAt: "2024-02-18",
    status: "active",
    notes: "Regular customer, prefers BPC-157",
  },
  {
    id: "c2",
    name: "Lisa Anderson",
    email: "lisa.anderson@email.com",
    phone: "+1 (555) 222-3333",
    totalOrders: 3,
    totalSpent: 890.25,
    joinedAt: "2024-01-05",
    lastOrderAt: "2024-02-10",
    status: "active",
  },
  {
    id: "c3",
    name: "James Taylor",
    email: "james.taylor@email.com",
    phone: "+1 (555) 333-4444",
    totalOrders: 12,
    totalSpent: 4200.00,
    joinedAt: "2023-08-20",
    lastOrderAt: "2024-02-19",
    status: "active",
    notes: "VIP customer, bulk orders",
  },
  {
    id: "c4",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 444-5555",
    totalOrders: 1,
    totalSpent: 149.99,
    joinedAt: "2024-02-15",
    status: "active",
  },
  {
    id: "c5",
    name: "Thomas Brown",
    email: "thomas.brown@email.com",
    phone: "+1 (555) 555-6666",
    totalOrders: 5,
    totalSpent: 1200.75,
    joinedAt: "2023-12-01",
    lastOrderAt: "2024-01-28",
    status: "inactive",
    notes: "Hasn't ordered in 3 weeks",
  },
  {
    id: "c6",
    name: "Jennifer Lee",
    email: "jennifer.lee@email.com",
    phone: "+1 (555) 666-7777",
    totalOrders: 6,
    totalSpent: 1850.00,
    joinedAt: "2023-09-10",
    lastOrderAt: "2024-02-14",
    status: "active",
  },
];

// Orders
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  userType: 'customer' | 'partner';
  partnerId?: string;
}

export const orders: Order[] = [
  {
    id: "ORD-2024-001",
    customerId: "c1",
    customerName: "David Miller",
    items: [
      { productId: "bpc-157", name: "BPC-157", quantity: 2, price: 49.99 },
      { productId: "tb-500", name: "TB-500", quantity: 1, price: 54.99 },
    ],
    total: 154.97,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: "2024-02-15",
    userType: "customer",
  },
  {
    id: "ORD-2024-002",
    customerId: "p1",
    customerName: "John Smith (Partner)",
    items: [
      { productId: "bpc-157", name: "BPC-157", quantity: 20, price: 37.49 }, // 25% discount
      { productId: "tb-500", name: "TB-500", quantity: 15, price: 41.24 },
    ],
    total: 1368.55,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2024-02-16",
    userType: "partner",
    partnerId: "p1",
  },
  {
    id: "ORD-2024-003",
    customerId: "c3",
    customerName: "James Taylor",
    items: [
      { productId: "melanotan-2", name: "Melanotan II", quantity: 5, price: 59.99 },
    ],
    total: 299.95,
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2024-02-17",
    userType: "customer",
  },
  {
    id: "ORD-2024-004",
    customerId: "p3",
    customerName: "Michael Chen (Partner)",
    items: [
      { productId: "cjc-1295", name: "CJC-1295", quantity: 50, price: 31.49 }, // 30% discount
      { productId: "ipamorelin", name: "Ipamorelin", quantity: 50, price: 27.99 },
    ],
    total: 2974.00,
    status: "processing",
    paymentStatus: "paid",
    createdAt: "2024-02-18",
    userType: "partner",
    partnerId: "p3",
  },
];
