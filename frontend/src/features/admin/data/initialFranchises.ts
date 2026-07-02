import { Franchise } from '../../../types';

export const INITIAL_FRANCHISES: Franchise[] = [
  { id: 'FR-WB-01', name: 'West Bengal Master', type: 'Master', state: 'West Bengal', city: 'Kolkata', investment: 850000, commissionRate: 15, totalRevenue: 1250000, agentCount: 8 },
  { id: 'FR-OD-02', name: 'Odisha Standard', type: 'Standard', state: 'Odisha', city: 'Bhubaneswar', investment: 250000, commissionRate: 10, totalRevenue: 450000, agentCount: 3 },
  { id: 'FR-WB-03', name: 'Siliguri City Hub', type: 'CityHub', state: 'West Bengal', city: 'Siliguri', investment: 60000, commissionRate: 7, totalRevenue: 120000, agentCount: 2 },
];
