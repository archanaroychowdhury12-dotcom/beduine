import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const productionSourceFiles = [
  'src/App.tsx',
  'src/AdminLoginPage.tsx',
  'src/features/dashboard/DashboardPage.tsx',
  'src/features/dashboard/modern/ModernDashboardApp.tsx',
  'src/features/dashboard/modern/components/DashboardLayout.tsx',
  'src/features/dashboard/modern/components/Header.tsx',
  'src/features/dashboard/modern/pages/SupportTickets.tsx',
  'src/features/admin/AdminPage.tsx',
  'src/features/admin/components/AdminPanel.tsx',
  'src/features/admin/hooks/useAdminUsers.ts',
  'src/features/admin/hooks/useAdminAuditLogs.ts',
  'src/pages/main-website-tour-page/custom-tour/CustomTourDetailPanel.tsx',
  'src/services/customTourService.ts',
];

describe('production dashboard import isolation', () => {
  it('keeps the production dashboard entry chain free of dummy data imports', () => {
    const forbidden = [
      'dummyData',
      'demoWalletService',
      'mockPaymentGateway',
      'generateMockParticipants',
      'getInitialMockRequests',
      'DemoAdminControls',
      'admin@beduine.com',
      'admin123',
    ];

    for (const file of productionSourceFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      for (const token of forbidden) {
        expect(source, `${file} contains ${token}`).not.toContain(token);
      }
    }
  });

  it('keeps production admin draw operations free of local RNG state', () => {
    const adminFiles = [
      'src/features/admin/AdminPage.tsx',
      'src/features/admin/components/AdminPanel.tsx',
    ];

    for (const file of adminFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      expect(source, file).not.toContain('useWeeklySelection');
      expect(source, file).not.toContain('AdminDrawPanel');
    }
  });

  it('does not permit a production build to fall back to the demo backend', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/services/backend/index.ts'), 'utf8');
    expect(source).toContain('assertBackendModeAllowed');
    expect(source).not.toContain("import.meta.env.VITE_BACKEND_MODE === 'production'\n    ?");
  });

  it('keeps production admin summaries separate from demo-only fallbacks', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/features/admin/components/AdminPanel.tsx'),
      'utf8',
    );

    expect(source).toMatch(/adminSubTab === 'overview'[\s\S]+if \(isProduction\)/);
    expect(source).toContain("{!isProduction && (");
  });
});
