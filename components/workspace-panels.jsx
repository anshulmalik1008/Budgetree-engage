import Link from 'next/link';
import { ArrowUpRight, BookOpen, CalendarDays, ClipboardList, Gift, Sparkles, Users, Plane, ShoppingBag, Headphones } from 'lucide-react';
import { href, navigation } from '../lib/workspace';

import { hrPages } from '../lib/hr-pages';

const number = new Intl.NumberFormat('en-IN');

const descriptions = {
  dashboard: 'See team activity and get to the tools you use most.',
  feed: 'Post updates, recognise colleagues and follow team activity.',
  recognise: 'Send appreciation and see recent recognition posts.',
  directory: 'Find colleagues across teams and send recognition directly from their profile card.',
  groups: 'Join team spaces to keep up with announcements and shared activities.',
  celebrations: 'See upcoming birthdays and work anniversaries, and send your wishes.',
  'wall-of-fame': 'Celebrate contributions and read the stories behind them.',
  leaderboard: 'See who received recognition across the workspace.',
  spotlight: 'Give a team achievement or individual contribution its own featured post.',
  marketplace: 'Browse gift cards, experiences and vouchers you can redeem with points.',
  'send-gift': 'Choose a reward and send it to a colleague using your points balance.',
  budgets: 'Review and update the workspace’s monthly demo allocation.',
  history: 'Review the points spent on gifts and personal redemptions.',
  engagement: 'Record feedback about how supported you feel at work.',
  lifecycle: 'Share feedback about your experience joining the team.',
  sop: 'Find step-by-step procedures for recurring people operations tasks.',
  policies: 'Browse sample workplace and time-off guidance.',
  help: 'Find answers about points, activity and workspace data.',
  settings: 'Manage the display name used for activity in this workspace.',
};

const shortcuts = [
  ['people', 'Directory', 'Find a colleague or send appreciation.', Users],
  ['rewards', 'Marketplace', 'Explore gift cards and experiences.', Gift],
  ['recognition', 'Team pulse', 'Share feedback about your experience.', ClipboardList],
  ['resources', 'SOP library', 'Open guides for everyday workflows.', BookOpen],
];

export function DashboardHero({ data, onRecognise }) {
  return (
    <section className="hero dashboard-hero relative isolate grid items-center gap-7 overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(180px,245px)] rounded-[28px] px-6 py-9 text-white sm:px-10 lg:py-14">
      <div className="hero-orbit" aria-hidden="true"><Sparkles size={68} strokeWidth={1} /></div>
      <div className="relative z-10 max-w-xl">
        <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[.18em] text-gold"><Sparkles size={15} aria-hidden="true" /> EMPLOYEE ENGAGEMENT</p>
        <h1 className="text-4xl font-black tracking-[-.055em] sm:text-6xl">Welcome, {data.name.split(' ')[0]}.</h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-white/85">Celebrate great work, connect with your team and put your rewards to good use.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="button button-gold" onClick={onRecognise}>Send recognition</button>
          <Link className="hero-link" href={href('rewards')}>Explore rewards <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="hero-feature relative z-10 rounded-2xl border border-white/20 p-4 sm:max-w-xs">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold"><Gift size={17} aria-hidden="true" /> Rewards marketplace</div>
        <p className="text-3xl font-black">{number.format(data.balance)} pts</p>
        <p className="mt-1 text-sm text-white/80">Available to redeem or gift</p>
        <div className="mt-4 flex gap-3 text-white/85" aria-hidden="true"><Plane size={17} /><ShoppingBag size={17} /><Headphones size={17} /></div>
      </div>
    </section>
  );
}

export function WorkspaceShortcuts() {
  return (
    <section className="grid gap-3">
      <h2 className="text-xl font-extrabold tracking-tight">Quick access</h2>
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {shortcuts.map(([section, label, copy, Icon]) => (
          <Link key={section} href={section === 'recognition' ? href(section, 'engagement') : href(section)} className="card group flex items-start gap-3 transition hover:-translate-y-0.5 hover:border-emerald-400">
            <span className="panel-icon"><Icon size={20} aria-hidden="true" /></span>
            <span className="grow"><strong className="block">{label}</strong><span className="mt-1 block text-sm leading-relaxed text-muted">{copy}</span></span>
            <ArrowUpRight size={16} className="shrink-0 text-muted group-hover:text-forest" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ActivitySnapshot({ posts }) {
  const kinds = ['Recognition', 'Update', 'Spotlight'];
  return (
    <section className="card space-y-4">
      <h2 className="text-lg font-extrabold tracking-tight">Activity breakdown</h2>
      {kinds.map(kind => {
        const count = posts.filter(post => post.kind === kind).length;
        const percentage = posts.length ? count / posts.length * 100 : 0;
        return <div key={kind}><div className="mb-1.5 flex justify-between gap-2 text-sm"><span>{kind}</span><strong>{number.format(count)}</strong></div><div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-mint"><div className="h-full rounded-full bg-violet-700" style={{ width: percentage + '%' }} /></div></div>;
      })}
      <Link className="text-sm font-semibold underline underline-offset-4" href={href('recognition')}>View recognition</Link>
    </section>
  );
}

export function ModuleHero({ section, title, page, data }) {
  const stats = {
    people: [data.groups.length, 'Groups joined'],
    recognition: [data.posts.filter(post => post.kind === 'Recognition').length, 'Recognition posts'],
    rewards: [data.balance, 'Available points'],
    surveys: [Object.keys(data.answers).length, 'Surveys answered'],
    resources: [navigation.resources.pages.length, 'Resource categories'],
  };
  const stat = stats[section];
  return (
    <section data-section={section} className="hero module-hero flex flex-wrap items-end justify-between gap-6 rounded-[28px] p-6 text-white md:p-9">
      <div>
        <p className="mb-2 text-xs font-bold tracking-[.17em] text-gold">{navigation[section].title.toUpperCase()}</p>
        <h1 className="text-3xl font-black tracking-[-.045em] md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-lg leading-relaxed text-white/85">{descriptions[page] || hrPages[page]?.description}</p>
      </div>
      {stat && <div className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3"><strong className="block text-2xl">{number.format(stat[0])}</strong><span className="text-sm text-white/85">{stat[1]}</span></div>}
    </section>
  );
}

export function RelatedPages({ section, page }) {
  const siblings = navigation[section].pages.filter(([id]) => id !== page);
  if (!siblings.length) return null;
  return (
    <section className="mt-3 grid gap-3 border-t border-line pt-5">
      <h2 className="text-xl font-extrabold tracking-tight">More in {navigation[section].title}</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {siblings.map(([id, label]) => <Link key={id} className="card flex items-start gap-3 transition hover:border-emerald-400" href={href(section, id)}><span className="grow"><strong>{label}</strong><span className="mt-1 block text-sm leading-relaxed text-muted">{descriptions[id] || hrPages[id]?.description}</span></span><ArrowUpRight className="mt-1 shrink-0" size={15} aria-hidden="true" /></Link>)}
      </div>
    </section>
  );
}

export function UpcomingCelebrations() {
  return (
    <section className="card">
      <CalendarDays className="panel-icon mb-3 box-content" size={19} aria-hidden="true" />
      <h2 className="text-lg font-extrabold">Coming up</h2>
      <dl className="mt-2 divide-y divide-line text-sm">
        <div className="py-2"><dt className="font-semibold">27 Nov · Sara Scott</dt><dd className="text-muted">Work anniversary</dd></div>
        <div className="py-2"><dt className="font-semibold">2 Dec · Liam Patel</dt><dd className="text-muted">Birthday</dd></div>
      </dl>
      <Link className="mt-2 inline-flex items-center gap-1 text-sm font-semibold" href={href('recognition', 'celebrations')}>View celebrations <ArrowUpRight size={15} /></Link>
    </section>
  );
}
