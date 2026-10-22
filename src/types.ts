export type DemoRole = 'artisan' | 'buyer' | 'worker' | 'coordinator';
export type VerificationStatus = 'pending' | 'approved' | 'needs-evidence' | 'rejected';
export type ProductStageId = 'raw' | 'work' | 'finishing' | 'packed';
export type TaskStatus = 'assigned' | 'in-progress' | 'ready-for-review' | 'revision-requested' | 'completed';
export type EvidenceType = 'Gallery Upload' | 'Simulated Camera Capture' | 'Coordinator Reviewed' | 'Worker progress update';

export interface Person {
  id: string;
  name: string;
  role: string;
  location: string;
  craft: string;
  image: string;
  yearsExperience?: number;
  verified?: boolean;
  bio?: string;
}

export interface Worker extends Person {
  rating: number;
  completedTasks: number;
  skills: string[];
  portfolio: string[];
  availability: string;
}

export interface PricingBreakdown {
  materialCost: number;
  artisanHours: number;
  hourlyRate: number;
  helperPayments: number;
  packaging: number;
  shipping: number;
  overhead: number;
  marginPercent: number;
}

export interface ProvenanceStage {
  id: ProductStageId;
  label: string;
  image?: string;
  status: 'supported' | 'missing';
  evidenceType?: EvidenceType;
  timestamp?: string;
  contributor?: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  craft: string;
  material: string;
  image: string;
  price: number;
  description: string;
  story: string;
  artisanId: string;
  pricing: PricingBreakdown;
  stages: ProvenanceStage[];
  verificationStatus: VerificationStatus;
  createdAt: string;
  listed: boolean;
}

export interface LocalTask {
  id: string;
  title: string;
  requiredSkill: string;
  quantity: number;
  deadline: string;
  offeredPayment: number;
  description: string;
  artisanId: string;
  workerId: string;
  productId?: string;
  status: TaskStatus;
  progressNote?: string;
  progressImage?: string;
  requestNote?: string;
  paymentReleased: boolean;
  createdAt: string;
}

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface DemoState {
  role: DemoRole;
  products: Product[];
  tasks: LocalTask[];
  cart: CartLine[];
  artisanVerificationStatus: VerificationStatus;
  coordinatorNote: string;
}
