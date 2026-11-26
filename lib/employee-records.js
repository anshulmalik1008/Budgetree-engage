import { hrPages } from './hr-pages';

export function employeeRecords(data) {
  return data.employees ?? (data.hrRecords?.employees ?? hrPages.employees.rows).map(([name, department, status], index) => ({
    id: 'sample-' + index, name, department, status,
  }));
}

export const sampleCelebrations = [
  { id: 'sara-anniversary', name: 'Sara Scott', occasion: 'Work anniversary', date: '2026-11-27' },
  { id: 'liam-birthday', name: 'Liam Patel', occasion: 'Birthday', date: '2026-12-02' },
];
