import Link from 'next/link';
import { ArrowUpRight, Bell, CalendarDays, ClipboardCheck, Laptop, UserRoundPlus } from 'lucide-react';
import { employeeRecords } from '../lib/employee-records';
import { hrPages } from '../lib/hr-pages';
import { href } from '../lib/workspace';

export function ActionCenter({ data }) {
  const rows = page => data.hrRecords?.[page] ?? hrPages[page].rows;
  const employees = employeeRecords(data);
  const tasks = [
    ['Leave requests', 'attendance', 'leave', CalendarDays, rows('leave').filter(row => row[2] === 'Pending').length],
    ['New joiners', 'people', 'onboarding', UserRoundPlus, employees.filter(employee => !employee.archived && employee.status === 'Joining').length],
    ['Offboarding tasks', 'people', 'offboarding', ClipboardCheck, rows('offboarding').filter(row => row[2] === 'Pending').length],
    ['Asset returns', 'people', 'assets', Laptop, rows('assets').filter(row => row[2] === 'Return pending').length],
    ['Unread notifications', 'overview', 'notifications', Bell, rows('notifications').filter(row => row[2] === 'Unread').length],
  ];
  const pending = tasks.reduce((sum, task) => sum + task[4], 0);

  return <section className="card dashboard-panel dashboard-panel-trend" aria-labelledby="action-center-heading">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <div><h2 id="action-center-heading" className="text-xl font-bold">Action center</h2><p className="text-sm text-muted">Open the right page to clear pending HR work.</p></div>
      <span className="rounded-full bg-mint px-3 py-1 text-sm font-semibold">{pending} pending</span>
    </div>
    <ul className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">{tasks.map(([label, section, page, Icon, count]) => (
      <li key={page}><Link href={href(section, page)} className="card flex h-full items-center gap-2 p-3">
        <span className="panel-icon"><Icon size={18} aria-hidden="true" /></span>
        <span className="grow text-sm font-semibold">{label}<span className="block text-xs font-normal text-muted">{count ? count + ' pending' : 'Up to date'}</span></span>
        <ArrowUpRight size={15} className="shrink-0 text-muted" aria-hidden="true" />
      </Link></li>
    ))}</ul>
  </section>;
}
