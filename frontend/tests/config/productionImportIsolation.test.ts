import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const productionDashboardFiles = [
  'src/features/dashboard/DashboardPage.tsx',
  'src/features/dashboard/modern/ModernDashboardApp.tsx',
  'src/features/dashboard/modern/components/DashboardLayout.tsx',
  'src/features/dashboard/modern/components/Header.tsx',
];

describe('production dashboard import isolation', () => {
  it('keeps the production dashboard entry chain free of dummy data imports', () => {
    for (const file of productionDashboardFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      expect(source, file).not.toContain('dummyData');
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
});
