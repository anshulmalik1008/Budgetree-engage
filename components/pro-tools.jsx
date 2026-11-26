'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, CalendarDays, ClipboardCheck, Search, Sparkles, Users, Wallet } from 'lucide-react';
import { guides, href } from '../lib/workspace';
import { employeeRecords } from '../lib/employee-records';
import { hrPages } from '../lib/hr-pages';

const operations = [
  ['people', 'employees', 'Employees', 'Active', Users],
  ['attendance', 'attendance', 'Attendance', 'Present', CalendarDays],
  ['attendance', 'leave', 'Leave approvals', 'Pending', ClipboardCheck],
  ['payroll', 'payroll', 'Payroll review', 'In review', Wallet],
];

export function Operations({ data }) {
  const metrics = [
    ...operations.map(([section, page, label, status, Icon]) => {
      const records = data.hrRecords?.[page] ?? hrPages[page].rows;
      return [section, page, label, status, Icon, page === 'employees' ? employeeRecords(data).filter(record => !record.archived && record.status === 'Active').length : records.filter(row => row[2] === status).length];
    }),
    ['people', 'onboarding', 'Onboarding', 'Pending tasks', ClipboardCheck, (data.hrRecords?.onboarding ?? hrPages.onboarding.rows).filter(row => row[2] === 'Pending').length],
    ['recognition', 'wall-of-fame', 'Recognition', 'Posts', Sparkles, data.posts.filter(post => post.kind === 'Recognition').length],
    ['recognition', 'events', 'Event RSVPs', 'Saved', CalendarDays, data.eventRsvps?.length ?? 0],
    ['rewards', 'marketplace', 'Rewards', 'Available points', Wallet, data.balance.toLocaleString('en-IN')],
  ];
  return <section aria-label="HR operations" className="dashboard-metrics">
    {metrics.map(([section, page, label, status, Icon, value]) => {
      return <Link href={href(section, page)} key={page} className="card metric-tile pro-metric">
        <span className="flex items-center justify-between"><span className="panel-icon"><Icon size={17} aria-hidden="true" /></span><ArrowUpRight size={15} aria-hidden="true" /></span>
        <strong className="mt-2 block text-2xl">{value}</strong>
        <span className="mt-1 block font-semibold">{label}</span><span className="text-sm text-muted">{status}</span>
      </Link>;
    })}
  </section>;
}

export function SopLibrary({ progress, onToggle }) {
  const [query, setQuery] = useState('');
  const matched = guides.sop.filter(guide => guide.flat(2).join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="grid gap-4">
    <div className="card flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="text-2xl font-bold">Procedure library</h2><p className="text-sm text-muted">{matched.length} of {guides.sop.length} procedures</p></div>
      <label className="field w-full sm:max-w-xs">Search procedures<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="e.g. onboarding or equipment" /></label>
    </div>
    {matched.map(([name, owner, description]) => {
      const steps = Array.isArray(description) ? description : description.match(/[^.!?]+[.!?]?/g).map(step => step.trim());
      const completed = progress[name] ?? [];
      return <details key={name} className="card pro-sop">
        <summary className="flex cursor-pointer items-center gap-3"><span className="panel-icon"><BookOpen size={20} aria-hidden="true" /></span><span className="grow"><strong className="block text-lg">{name}</strong><span className="text-sm text-muted">{owner}</span></span><span className="text-sm font-semibold">{completed.length}/{steps.length} done</span></summary>
        <progress className="mt-4 w-full" value={completed.length} max={steps.length} aria-label={name + ' completion'} />
        <ol className="mt-3 space-y-2">{steps.map((step, index) => <li key={index}><label className="flex cursor-pointer items-start gap-3 rounded-xl bg-canvas p-3"><input type="checkbox" className="mt-1 size-4 accent-accent" checked={completed.includes(index)} onChange={() => onToggle(name, index)} /><span>{step}</span></label></li>)}</ol>
      </details>;
    })}
    {!matched.length && <p role="status">No procedures match your search.</p>}
  </section>;
}

export function WorkspaceCopilot() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const topics = [
    ...operations.map(([section, page, label]) => [label, hrPages[page].description, href(section, page)]),
    ['Onboarding', hrPages.onboarding.description, href('people', 'onboarding')],
    ['Team events', 'See what is coming up and RSVP from the Team Events page.', href('recognition', 'events')],
    ['Quick polls', 'Vote for an activity and review your selected option.', href('recognition', 'polls')],
    ['Idea board', 'Save workplace improvement suggestions.', href('recognition', 'ideas')],
    ['Rewards shop', 'Browse rewards by name or category, then redeem with demo points.', href('rewards', 'marketplace')],
    ['Payslips', hrPages.payslips.description, href('payroll', 'payslips')],
    ...guides.sop.map(([label, , description]) => [label, Array.isArray(description) ? description.join(' ') : description, href('resources', 'sop')]),
  ];
  const tokens = submitted.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  const matches = topics.map(topic => ({ topic, score: tokens.filter(token => topic.slice(0, 2).join(' ').toLowerCase().includes(token)).length })).filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  return <section className="card grid gap-5">
    <div className="flex items-center gap-3"><span className="panel-icon"><Sparkles size={22} aria-hidden="true" /></span><div><h2 className="text-2xl font-bold">Ask your workspace</h2><p className="text-sm text-muted">Search built-in HR guidance and SOPs.</p></div></div>
    <form className="flex flex-wrap items-end gap-2" onSubmit={event => { event.preventDefault(); setSubmitted(query.trim()); }}>
      <label className="field min-w-0 grow">Your question<input value={query} onChange={event => setQuery(event.target.value)} required placeholder="Where do I approve leave?" /></label>
      <button className="button"><Search size={17} aria-hidden="true" /> Search</button>
    </form>
    <div className="flex flex-wrap gap-2">{['Onboarding', 'Leave approvals', 'Payslips', 'Rewards shop', 'Team events'].map(label => <button className="button button-light" key={label} type="button" onClick={() => { setQuery(label); setSubmitted(label); }}>{label}</button>)}</div>
    <div aria-live="polite">{submitted && <div className="grid gap-3">{matches.length ? matches.map(({ topic: [label, answer, url] }) => <article key={label} className="rounded-xl bg-canvas p-4"><h3 className="font-bold">{label}</h3><p className="my-2">{answer}</p><Link href={url} className="font-semibold underline">Open related page</Link></article>) : <p>No matches. Try a topic such as leave, attendance or onboarding.</p>}</div>}</div>
  </section>;
}
