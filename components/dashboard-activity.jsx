import Link from 'next/link';
import { ArrowUpRight, BookOpen, Gift, MapPin } from 'lucide-react';
import { guides, href } from '../lib/workspace';

const number = new Intl.NumberFormat('en-IN');
const demoRewards = [
  { id: 'demo-coffee', actor: 'Sara Scott', name: 'Coffee gift card', cost: 500, status: 'Redeemed', channel: 'Coffee partner · In store' },
  { id: 'demo-ride', actor: 'Liam Patel', name: 'Uber e-gift card', cost: 1000, status: 'Redeemed', channel: 'Uber app · Online' },
  { id: 'demo-team', actor: 'Ava Mitchell', name: 'Team gift box', cost: 1800, recipient: 'David Chen', status: 'Gift sent' },
];
const demoSales = [
  { id: 'visit', rep: 'Ava Mitchell', account: 'Northstar Retail', type: 'Field visit', status: 'Completed' },
  { id: 'order', rep: 'David Chen', account: 'Metro Trade', type: 'Order', status: 'Logged' },
  { id: 'follow-up', rep: 'Liam Patel', account: 'Citywide Stores', type: 'Follow-up', status: 'Pending' },
  { id: 'second-visit', rep: 'Sara Scott', account: 'Cornerstone Distribution', type: 'Field visit', status: 'Scheduled' },
];

export function RewardsActivity({ history, compact = false }) {
  const entries = compact ? [...history, ...demoRewards].slice(0, 4) : [...history, ...demoRewards];
  return <section className="card min-w-0">
    <div className="flex items-start gap-3">
      <span className="panel-icon"><Gift size={19} aria-hidden="true" /></span>
      <div className="grow"><h2 className="text-lg font-bold">Rewards activity</h2><p className="text-sm text-muted">Gift cards, products and redemption channels</p></div>
      {compact && <Link aria-label="View rewards history" className="shrink-0 p-2" href={href('rewards', 'history')}><ArrowUpRight size={19} aria-hidden="true" /></Link>}
    </div>
    <ul className="mt-3 divide-y divide-line">
      {entries.map(entry => <li key={entry.id} className="flex flex-wrap items-start justify-between gap-2 py-3">
        <div className="min-w-0"><h3 className="break-words text-sm font-bold">{entry.name}</h3>
          <p className="text-sm text-muted">{entry.actor ?? 'Workspace user'}{entry.recipient ? ' → ' + entry.recipient : ''}</p>
          <p className="mt-1 text-xs text-muted">{entry.channel ?? (entry.recipient ? 'Redemption pending' : 'Channel unavailable')}{entry.id.startsWith('demo-') ? ' · Sample' : ''}</p>
        </div>
        <div className="shrink-0 text-right"><span className="block text-sm font-bold">{number.format(entry.cost)} pts</span><span className="text-xs text-muted">{entry.status ?? (entry.recipient ? 'Gift sent' : 'Redeemed')}</span></div>
      </li>)}
    </ul>
  </section>;
}

export function SalesActivity({ updates, compact = false, onComplete }) {
  const rows = demoSales.map(row => ({ ...row, status: updates?.[row.id] ?? row.status }));
  const counters = [
    ['Visits done', rows.filter(row => row.type === 'Field visit' && row.status === 'Completed').length],
    ['Orders logged', rows.filter(row => row.type === 'Order').length],
    ['Follow-ups due', rows.filter(row => row.type === 'Follow-up' && row.status === 'Pending').length],
  ];
  return <section className="card min-w-0">
    <div className="flex items-start gap-3">
      <span className="panel-icon"><MapPin size={19} aria-hidden="true" /></span>
      <div className="grow"><h2 className="text-lg font-bold">Sales Force Automation</h2><p className="text-sm text-muted">Sample field activity</p></div>
      {compact && <Link aria-label="View sales field activity" className="shrink-0 p-2" href={href('overview', 'sfa')}><ArrowUpRight size={19} aria-hidden="true" /></Link>}
    </div>
    <div className="my-4 grid grid-cols-3 gap-2">{counters.map(([label, quantity]) => <div key={label} className="min-w-0 rounded-xl bg-canvas p-2"><strong className="block text-xl">{quantity}</strong><span className="block text-xs text-muted">{label}</span></div>)}</div>
    <ul className="divide-y divide-line">{rows.slice(0, compact ? 3 : rows.length).map(row => <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
      <div><h3 className="text-sm font-bold">{row.account}</h3><p className="text-xs text-muted">{row.rep} · {row.type}</p></div>
      {onComplete && ['Pending', 'Scheduled'].includes(row.status) ? <button type="button" className="button button-light" onClick={() => onComplete(row.id)}>Mark complete</button> : <span className="rounded-full bg-mint px-2 py-1 text-xs">{row.status}</span>}
    </li>)}</ul>
  </section>;
}

export function DashboardActivity({ data }) {
  const started = guides.sop.filter(([name]) => data.sopProgress?.[name]?.length).length;
  return <section aria-label="Rewards and field activity" className="grid gap-4 xl:grid-cols-2">
    <RewardsActivity history={data.history} compact />
    <SalesActivity updates={data.salesUpdates} compact />
    <Link href={href('resources', 'sop')} className="card flex items-center gap-3 xl:col-span-2">
      <span className="panel-icon"><BookOpen size={19} aria-hidden="true" /></span>
      <span className="grow"><strong className="block">SOP Library</strong><span className="block text-sm text-muted">{started} of {guides.sop.length} checklists started</span></span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  </section>;
}
