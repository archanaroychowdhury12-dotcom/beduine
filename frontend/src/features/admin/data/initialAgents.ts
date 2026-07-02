import { Agent } from '../../../types';

export const INITIAL_AGENTS: Agent[] = [
  { id: 'AG-001', name: 'Arindam Das', email: 'arindam@example.com', phone: '+91 98300 12345', franchiseId: 'FR-WB-01', franchiseName: 'West Bengal Master', earningModel: 'salary', targetRegistrations: 50, achievedRegistrations: 38, accruedCommission: 0, salary: 12000, status: 'active' },
  { id: 'AG-002', name: 'Manoj Mishra', email: 'manoj@example.com', phone: '+91 94330 99887', franchiseId: 'FR-OD-02', franchiseName: 'Odisha Standard', earningModel: 'commission', targetRegistrations: 40, achievedRegistrations: 15, accruedCommission: 1750, salary: 0, status: 'active' },
  { id: 'AG-003', name: 'Subho Pal', email: 'subho@example.com', phone: '+91 90022 55443', franchiseId: 'FR-WB-03', franchiseName: 'Siliguri City Hub', earningModel: 'salary', targetRegistrations: 50, achievedRegistrations: 52, accruedCommission: 800, salary: 10000, status: 'active' },
  { id: 'AG-004', name: 'Riya Sen', email: 'riya@example.com', phone: '+91 97775 88221', franchiseId: 'FR-WB-01', franchiseName: 'West Bengal Master', earningModel: 'commission', targetRegistrations: 30, achievedRegistrations: 28, accruedCommission: 4200, salary: 0, status: 'active' },
];
