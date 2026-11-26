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

export function employeeNameLookup(data) {
  const records = employeeRecords(data);
  const byId = new Map(records.map(employee => [employee.id, employee]));
  const byName = new Map();

  for (const employee of records) {
    const sampleIndex = /^sample-(\d+)$/.exec(employee.id)?.[1];
    const originalName = sampleIndex === undefined ? undefined : hrPages.employees.rows[sampleIndex]?.[0];
    for (const alias of new Set([employee.name, originalName, ...(employee.previousNames ?? [])])) {
      if (!alias) continue;
      const key = alias.trim().toLowerCase();
      if (!byName.has(key)) byName.set(key, employee);
      else if (byName.get(key)?.id !== employee.id) byName.set(key, null);
    }
  }

  return (name, id) => byId.get(id)?.name ?? byName.get(name?.trim().toLowerCase())?.name ?? name;
}
