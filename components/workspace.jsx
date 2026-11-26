'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BookOpen, CalendarDays, ChevronDown, ChevronRight, ClipboardList, Gift, LayoutGrid, Plus, Search, Settings, Sparkles, Users, Wallet, X, Menu } from 'lucide-react';
import { catalog, guides, href, initialData, navigation } from '../lib/workspace';

import { Operations, SopLibrary, WorkspaceCopilot } from './pro-tools';
import { DashboardActivity, RewardsActivity, SalesActivity } from './dashboard-activity';
import { BrandingSettings, defaultCompany, defaultLogo } from './branding-settings';
import { DashboardSettings, dashboardThemes } from './dashboard-settings';
import { DashboardCharts } from './dashboard-charts';
import { hrPages } from '../lib/hr-pages';
import { EngagementTools } from './engagement-tools';
import { employeeNameLookup, employeeRecords } from '../lib/employee-records';
import { CelebrationRecords, EmployeePhoto, EmployeeRecords } from './employee-records';
import { HrPage } from './hr-page';
import { ActivitySnapshot, DashboardHero, ModuleHero, RelatedPages, UpcomingCelebrations, WorkspaceShortcuts } from './workspace-panels';

const icons = { BookOpen, CalendarDays, Wallet, ClipboardList, Gift, LayoutGrid, Settings, Sparkles, Users };
const storageKey = 'budgetree-engage-next-v1';
const points = value => new Intl.NumberFormat('en-IN').format(value) + ' pts';
const initials = name => name.split(/\s+/).slice(0, 2).map(word => word[0]).join('');

function Card({ children }) {
  return <section className="card">{children}</section>;
}

function Avatar({ name }) {
  return <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-xs font-extrabold text-forest">{initials(name)}</span>;
}

function NavLink({ to, active, current, children, dark }) {
  const styles = dark
    ? active ? 'bg-white/15 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
    : active ? 'bg-mint text-forest' : 'text-muted hover:bg-canvas';
  return <Link href={to} aria-current={current} className={'flex min-h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ' + (dark ? 'primary-item ' : 'section-item ') + styles}>{children}</Link>;
}

export default function Workspace({ section, page }) {
  const [data, setData] = useState(initialData);
  const theme = dashboardThemes.some(option => option.id === data.dashboardTheme) ? data.dashboardTheme : 'vivid';
  const visibility = data.dashboardWidgets ?? {};
  const company = data.companyName || defaultCompany;
  const logo = data.companyLogo || '';
  const customBranding = Boolean(logo || company !== defaultCompany);
  const compact = data.dashboardDensity === 'compact';
  const narrow = data.sidebarSize === 'narrow';
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [rewardCategory, setRewardCategory] = useState('All');
  const [action, setAction] = useState(null);
  const dialog = useRef(null);
  const current = navigation[section];
  const title = current.pages.find(([id]) => page === id)[1];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const previous = JSON.parse(saved);
        const posts = previous.posts ?? initialData.posts;
        const referencePosts = initialData.posts.filter(post =>
          ['townhall-overachiever', 'frontend-platform'].includes(post.id) && !posts.some(existing => existing.id === post.id),
        );
        setData({ ...initialData, ...previous, name: /^Natasha(?: Sharma)?$/i.test(previous.name ?? '') ? initialData.name : previous.name ?? initialData.name, posts: [...posts, ...referencePosts] });
      }
    } catch {
      setNotice('Browser storage could not be loaded.');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(data)); }
    catch { setNotice('Changes could not be saved after closing this page.'); }
  }, [data, ready]);

  useEffect(() => {
    if (action && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [action]);

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(timeout);
  }, [notice]);

  function save(change, message) {
    if (!ready) return;
    setData(change);
    setNotice(message);
  }

  function editPost(id, change, message) {
    save(previous => ({ ...previous, name: /^Natasha(?: Sharma)?$/i.test(previous.name ?? '') ? initialData.name : previous.name ?? initialData.name, posts: previous.posts.map(post => post.id === id ? change(post) : post) }), message);
  }

  function publish(body, kind, recipient) {
    const post = { id: crypto.randomUUID(), author: data.name, recipient, kind, body, likes: 0, comments: [] };
    save(previous => ({ ...previous, name: /^Natasha(?: Sharma)?$/i.test(previous.name ?? '') ? initialData.name : previous.name ?? initialData.name, posts: [post, ...previous.posts] }), kind + ' posted.');
  }

  function submitDialog(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const body = String(values.get('body') || '').trim();
    const recipient = values.get('recipient');
    if (values.has('body') && !body) {
      event.currentTarget.elements.body.focus();
      setNotice('Enter a message to continue.');
      return;
    }
    if (action.kind === 'Comment') {
      editPost(action.id, post => ({ ...post, comments: [...post.comments, { author: data.name, body }] }), 'Comment added.');
    } else if (action.kind === 'Redeem' || action.kind === 'Gift') {
      const [name, cost] = action.item;
      if (data.balance < cost) { setNotice('You need ' + points(cost - data.balance) + ' more.'); return; }
      const entry = {
        id: crypto.randomUUID(), name, cost, recipient, actor: data.name,
        actorId: employeeIdForName(data.name),
        recipientId: employeeIdForName(recipient),
        status: recipient ? 'Gift sent' : 'Redeemed',
        channel: recipient ? null : 'Rewards Shop · Demo',
      };
      save(previous => previous.balance < cost ? previous : { ...previous, balance: previous.balance - cost, history: [entry, ...previous.history] }, 'Demo transaction recorded.');
    } else {
      publish(body, action.kind, recipient);
    }
    dialog.current.close();
  }

  function postList(posts) {
    return posts.length ? posts.map(post => (
      <Card key={post.id}>
        <div className="flex items-start gap-3">
          <Avatar name={displayName(post.author)} />
          <div className="grow"><p className="font-semibold">{displayName(post.author)}</p><p className="text-sm text-muted">{post.recipient ? 'Celebrated ' + displayName(post.recipient) : 'Team activity'}</p></div>
          <span className="rounded-lg bg-mint px-2 py-1 text-xs font-semibold">{post.kind}</span>
        </div>
        {post.title && <h3 className="mt-4 text-xl font-extrabold tracking-tight">{post.title}</h3>}
        <p className="my-3 break-words leading-relaxed">{post.body}</p>
        {post.highlight && <div className="mb-4 rounded-xl bg-mint px-4 py-3 text-sm font-semibold">{post.highlight}</div>}
        {post.comments.map((comment, index) => <p key={index} className="mb-2 break-words rounded-lg bg-canvas px-3 py-2 text-sm"><strong>{displayName(comment.author)}</strong> {comment.body}</p>)}
        <div className="flex flex-wrap gap-2">
          <button className="button button-light" aria-pressed={!!post.liked} onClick={() => editPost(post.id, item => ({ ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) }), post.liked ? 'Applause removed.' : 'Applause added.')}>Applaud · {post.likes}</button>
          <button className="button button-light" onClick={() => setAction({ kind: 'Comment', id: post.id })}>Comment</button>
        </div>
      </Card>
    )) : <Card><p className="text-muted">No activity yet.</p></Card>;
  }

  function survey() {
    const question = page === 'engagement' ? 'How supported do you feel by your team?' : 'How helpful was your onboarding experience?';
    return <Card><h2 className="mb-4 text-xl font-bold">{question}</h2>{data.answers[page] ? <p>Response recorded · {data.answers[page]}</p> : (
      <form className="grid max-w-md gap-4" onSubmit={event => {
        event.preventDefault();
        const answer = new FormData(event.currentTarget).get('answer');
        save(previous => ({ ...previous, answers: { ...previous.answers, [page]: answer } }), 'Response saved.');
      }}>
        <label className="field">Your response<select name="answer" required defaultValue=""><option value="">Choose an answer</option><option>Very</option><option>Somewhat</option><option>Needs improvement</option></select></label>
        <div><button className="button">Submit response</button></div>
      </form>
    )}</Card>;
  }

  const displayName = employeeNameLookup(data);
  const employees = employeeRecords(data).filter(employee => !employee.archived && employee.status !== 'Exited');
  function employeeIdForName(name) {
    const matches = employees.filter(employee => employee.name === name);
    return matches.length === 1 ? matches[0].id : undefined;
  }
  const recipients = [...new Set([...employees.map(employee => employee.name), ...(action?.recipient ? [action.recipient] : [])])];

  function pageContent() {
    switch (page) {
      case 'dashboard':
      case 'feed':
        return <>
          {page === 'dashboard' && <DashboardHero company={company} data={data} onRecognise={() => setAction({ kind: 'Recognition' })} />}
          {page === 'dashboard' && visibility.metrics !== false && <Operations data={data} />}
          {page === 'dashboard' && visibility.charts !== false && <DashboardCharts records={data.hrRecords?.attendance ?? hrPages.attendance.rows} />}
          {page === 'dashboard' && visibility.activity !== false && <DashboardActivity data={data} displayName={displayName} />}
          {page === 'dashboard' && visibility.shortcuts !== false && <WorkspaceShortcuts />}
          {(page === 'feed' || visibility.feed !== false) && <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
            <div className="grid gap-4">
              <Card><form className="grid gap-3" onSubmit={event => {
                event.preventDefault();
                const form = event.currentTarget;
                const body = String(new FormData(form).get('body')).trim();
                if (!body) { setNotice('Enter an update before publishing.'); return; }
                publish(body, 'Update');
                form.reset();
              }}><label className="field">Share an update<textarea name="body" required maxLength={500} rows={3} placeholder="What’s happening with your team?" /></label><div><button className="button">Publish update</button></div></form></Card>
              <div className="flex items-center justify-between gap-2"><h2 className="text-xl font-bold">Team feed</h2><select aria-label="Filter activity" className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm" value={filter} onChange={event => setFilter(event.target.value)}>{['All', 'Recognition', 'Update', 'Spotlight'].map(item => <option key={item}>{item}</option>)}</select></div>
              {postList(data.posts.filter(post => filter === 'All' || post.kind === filter))}
            </div>
            <div className="grid content-start gap-4">
              <ActivitySnapshot posts={data.posts} />
              <UpcomingCelebrations entries={data.celebrations} displayName={displayName} />
            </div>
          </div>}
        </>;
      case 'employees':
      case 'onboarding':
      case 'offboarding':
        return <><EmployeeRecords key={page} page={page} data={data} save={save} ready={ready} />{page !== 'employees' && <HrPage key={page + '-tasks'} page={page} data={data} save={save} ready={ready} />}</>;
      case 'directory': {
        const matches = employees.filter(employee => [employee.name, employee.department, employee.role].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
        return <><label className="field max-w-md">Search by name or team<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label><div className="grid gap-4 sm:grid-cols-2">{matches.map(employee => <Card key={employee.id}><div className="mb-4 flex items-center gap-3"><EmployeePhoto employee={employee} /><div><h2 className="break-words font-bold">{employee.name}</h2><p className="text-sm text-muted">{employee.department}</p></div></div><button className="button button-light" onClick={() => setAction({ kind: 'Recognition', recipient: employee.name })}>Recognise</button></Card>)}</div>{!matches.length && <p className="text-muted">No colleagues match your search.</p>}</>;
      }
      case 'groups':
        return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[['Townhall', 'Company announcements'], ['Engineering', 'Product and platform updates'], ['Culture Club', 'Team activities and events']].map(([group, description]) => {
          const joined = data.groups.includes(group);
          return <Card key={group}><h2 className="font-bold">{group}</h2><p className="my-2 text-sm text-muted">{description}</p><button className="button button-light" onClick={() => save(previous => ({ ...previous, groups: joined ? previous.groups.filter(item => item !== group) : [...previous.groups, group] }), joined ? 'Group left.' : 'Group joined.')}>{joined ? 'Leave group' : 'Join group'}</button></Card>;
        })}</div>;
      case 'celebrations':
        return <CelebrationRecords data={data} save={save} ready={ready} onRecognise={name => setAction({ kind: 'Recognition', recipient: name })} />;
      case 'recognise':
        return <><div><button className="button" onClick={() => setAction({ kind: 'Recognition' })}>Send recognition</button></div>{postList(data.posts.filter(post => post.kind === 'Recognition'))}</>;
      case 'wall-of-fame':
        return postList(data.posts.filter(post => post.kind === 'Recognition'));
      case 'spotlight':
        return <><div><button className="button" onClick={() => setAction({ kind: 'Spotlight' })}>Create spotlight</button></div>{postList(data.posts.filter(post => post.kind === 'Spotlight'))}</>;
      case 'leaderboard':
        return <Card><ol className="divide-y divide-line">{recipients.map(name => [name, data.posts.filter(post => post.kind === 'Recognition' && displayName(post.recipient) === name).length]).sort((a, b) => b[1] - a[1]).map(([name, score], index) => <li key={name} className="flex items-center gap-3 py-3"><span className="w-5 text-sm text-muted">{index + 1}</span><Avatar name={name} /><strong className="grow">{name}</strong><span className="text-sm">{score} received</span></li>)}</ol></Card>;
      case 'events':
      case 'polls':
      case 'ideas':
        return <EngagementTools page={page} data={data} save={save} ready={ready} />;
      case 'marketplace':
      case 'send-gift': {
        const items = catalog.filter(([name, , , category, description]) => (rewardCategory === 'All' || category === rewardCategory) && (name + ' ' + description).toLowerCase().includes(query.trim().toLowerCase()));
        return <>
          <div className="card flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-xl font-extrabold">Rewards catalog</h2><p className="mt-1 text-sm text-muted">{items.length} rewards available to browse</p></div>
            <label className="field">Find a reward<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name" /></label>
            <label className="field">Category<select value={rewardCategory} onChange={event => setRewardCategory(event.target.value)}>{['All', 'Dining', 'Travel', 'Lifestyle'].map(category => <option key={category}>{category}</option>)}</select></label>
          </div>
          {!items.length && <p role="status" className="card text-muted">No rewards match this search.</p>}
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">{items.map(item => (
            <Card key={item[0]}>
              <div className="reward-art mb-4 aspect-[16/10] overflow-hidden rounded-xl"><img className="h-full w-full object-cover" src={'/rewards/' + item[2] + '.webp'} alt="" width={400} height={400} loading="lazy" decoding="async" /></div>
              <p className="text-xs font-semibold tracking-wide text-muted uppercase">{item[3]}</p>
              <h2 className="mt-1 text-lg font-extrabold">{item[0]}</h2>
              <p className="mt-1 min-h-10 text-sm leading-relaxed text-muted">{item[4]}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                <strong>{points(item[1])}</strong>
                <button className="button" onClick={() => data.balance < item[1] ? setNotice('You need ' + points(item[1] - data.balance) + ' more.') : setAction({ kind: page === 'send-gift' ? 'Gift' : 'Redeem', item })}>{page === 'send-gift' ? 'Choose recipient' : 'Redeem'}</button>
              </div>
            </Card>
          ))}</div>
        </>;
      }
      case 'history':
        return <RewardsActivity history={data.history} displayName={displayName} />;
      case 'sfa':
        return <SalesActivity updates={data.salesUpdates} displayName={displayName} onComplete={id => save(previous => ({
          ...previous, salesUpdates: { ...previous.salesUpdates, [id]: 'Completed' },
        }), 'Sales activity updated.')} />;
      case 'engagement':
      case 'lifecycle':
        return survey();
      case 'copilot':
        return <WorkspaceCopilot />;
      case 'sop':
        return <SopLibrary progress={data.sopProgress ?? {}} onToggle={(name, index) => save(previous => {
          const checked = previous.sopProgress?.[name] ?? [];
          const next = checked.includes(index) ? checked.filter(value => value !== index) : [...checked, index];
          return { ...previous, sopProgress: { ...previous.sopProgress, [name]: next } };
        }, 'Checklist updated.')} />;
      case 'policies':
      case 'help': {
        const matches = guides[page].filter(guide => guide.join(' ').toLowerCase().includes(query.trim().toLowerCase()));
        return <><label className="field max-w-md">Search {title.toLowerCase()}<span className="relative"><Search aria-hidden="true" className="absolute top-3.5 left-3" size={16} /><input className="indent-6" type="search" value={query} onChange={event => setQuery(event.target.value)} /></span></label>{matches.map(([name, owner, description]) => <details className="card" key={name}><summary className="font-bold">{name}</summary><p className="mt-2 text-sm font-semibold text-muted">{owner}</p>{Array.isArray(description) ? <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">{description.map(step => <li key={step}>{step}</li>)}</ol> : <p className="mt-3 leading-relaxed">{description}</p>}</details>)}{!matches.length && <p className="text-muted">No matching resources.</p>}</>;
      }
      case 'budgets':
      case 'settings': {
        const budget = page === 'budgets';
        return <>{!budget && <>
          <BrandingSettings company={company} logo={logo} ready={ready}
            onSave={(name, image) => save(previous => ({ ...previous, companyName: name, companyLogo: image }), 'Company branding saved.')}
            onReset={() => save(previous => ({ ...previous, companyName: defaultCompany, companyLogo: '' }), 'Budgetree branding restored.')}
          />
          <DashboardSettings compact={compact} narrow={narrow} onLayout={(key, value) => save(previous => ({ ...previous, [key]: value }), 'Layout preference saved.')} theme={theme} visibility={visibility} ready={ready}
          onTheme={value => save(previous => ({ ...previous, dashboardTheme: value }), 'Dashboard theme saved.')}
          onWidget={(id, show) => save(previous => ({ ...previous, dashboardWidgets: { ...previous.dashboardWidgets, [id]: show } }), 'Dashboard sections updated.')}
          onReset={() => save(previous => ({ ...previous, dashboardTheme: 'vivid', dashboardWidgets: {}, dashboardDensity: 'comfortable', sidebarSize: 'standard' }), 'Dashboard preferences reset.')}
        /></>}<Card><h2 className="text-xl font-bold">{budget ? 'Points allocation' : 'Profile settings'}</h2><p className="mb-4 mt-1 text-sm text-muted">{budget ? 'Set the monthly demo rewards budget.' : 'Update the name displayed in your workspace. Changes are saved on this browser.'}</p><form key={budget ? data.budget : data.name} className="grid max-w-md gap-4" onSubmit={event => {
          event.preventDefault();
          const value = String(new FormData(event.currentTarget).get('value')).trim();
          if (!value) { setNotice('Enter a value before saving.'); return; }
          save(previous => budget ? { ...previous, budget: Number(value) } : { ...previous, name: value }, budget ? 'Budget saved.' : 'Profile saved.');
        }}><label className="field">{budget ? 'Monthly points allocation' : 'Display name'}{budget ? <input name="value" type="number" min="0" max="1000000" step="1" defaultValue={data.budget} required /> : <input name="value" maxLength={60} defaultValue={data.name} required />}</label><div><button className="button">Save changes</button></div></form></Card></>;
      }
      default:
        return <HrPage key={page + '-tasks'} page={page} data={data} save={save} ready={ready} />;
    }
  }

  const mainLinks = Object.entries(navigation).map(([id, item]) => {
    const Icon = icons[item.icon];
    return <NavLink key={id} to={href(id)} active={id === section} current={id === section ? 'true' : undefined} dark><Icon size={18} aria-hidden="true" />{item.title}</NavLink>;
  });
  const needsRecipient = ['Recognition', 'Spotlight', 'Gift'].includes(action?.kind);
  return (
    <div data-dashboard-theme={theme} data-dashboard-density={compact ? 'compact' : 'comfortable'} data-sidebar-size={narrow ? 'narrow' : 'standard'} className="workspace-shell min-h-screen lg:grid">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-30 focus:rounded-lg focus:bg-white focus:p-3">Skip to content</a>
      <aside className="flex flex-col gap-4 primary-rail p-4 text-white lg:sticky lg:top-0 lg:h-dvh lg:gap-9 lg:p-5">
        <Link href="/" className="workspace-wordmark" aria-label={company + ' dashboard'}>
          {logo || !customBranding ? <img src={logo || defaultLogo} alt={company} /> : <strong>{company}</strong>}
        </Link>
        <details key={page} className="mobile-main-menu lg:hidden">
          <summary className="button button-light">
            <Menu size={19} aria-hidden="true" /><span className="mobile-menu-open-label">Open menu</span><span className="mobile-menu-close-label">Close menu</span>
          </summary>
          <nav aria-label="Mobile navigation" className="mt-2 grid gap-1">
            {mainLinks}
          </nav>
        </details>
        <nav aria-label="Main navigation" className="hidden gap-1 p-1 lg:grid">{mainLinks}</nav>
        <div className="mt-auto hidden items-center gap-3 border-t border-white/15 pt-4 lg:flex"><Avatar name={data.name} /><div className="min-w-0"><p className="truncate text-sm font-semibold">{data.name}</p><p className="text-xs text-white/70">{company} workspace</p></div></div>
      </aside>
      <div className="min-w-0">
        <header className="workspace-bar flex min-h-16 flex-wrap items-center justify-between gap-2 border-b border-line bg-white px-4 py-3 md:px-7">
          <details
            key={section + '/' + page}
            className="section-picker"
            onPointerEnter={event => {
              if (event.pointerType === 'mouse') event.currentTarget.open = true;
            }}
            onPointerLeave={event => {
              const picker = event.currentTarget;
              if (event.pointerType === 'mouse' && !picker.contains(document.activeElement)) picker.open = false;
            }}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
            }}
            onKeyDown={event => {
              if (event.key !== 'Escape') return;
              event.currentTarget.open = false;
              event.currentTarget.querySelector('summary').focus();
            }}
          >
            <summary className="section-picker-trigger">
              <span className="hidden sm:inline">{current.title}</span>
              <ChevronRight size={14} className="hidden shrink-0 sm:block" aria-hidden="true" />
              <span className="font-semibold text-ink">{title}</span>
              <ChevronDown size={16} className="section-picker-chevron shrink-0" aria-hidden="true" />
            </summary>
            <nav className="section-picker-panel" aria-label={current.title + ' pages'}>
              {current.pages.map(([id, name]) => (
                <NavLink key={id} to={href(section, id)} active={id === page} current={id === page ? 'page' : undefined}>{name}</NavLink>
              ))}
            </nav>
          </details>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={href('resources', 'settings')} className="button button-light" aria-current={page === 'settings' ? 'page' : undefined}><Settings size={17} aria-hidden="true" />Settings</Link>
            <button className="button button-accent" onClick={() => setAction({ kind: 'Recognition' })}><Plus size={17} aria-hidden="true" />Send recognition</button>
          </div>
        </header>
        <main id="main" data-dashboard={page === 'dashboard' ? 'true' : undefined} className="studio-content mx-auto grid w-full max-w-[1500px] min-w-0 content-start gap-6 p-4 md:p-8 xl:p-10" tabIndex={-1}>
          {page !== 'dashboard' && <ModuleHero section={section} title={title} page={page} data={data} />}
          {pageContent()}
          <RelatedPages section={section} page={page} />
        </main>
      </div>
      <dialog ref={dialog} onClose={() => setAction(null)} aria-labelledby="dialog-title" className="m-auto w-[min(92vw,480px)] rounded-2xl border border-line bg-white p-5 text-ink">
        {action && <><div className="mb-4 flex items-center justify-between gap-2"><h2 id="dialog-title" className="text-xl font-bold">{action.item ? action.kind + ' · ' + action.item[0] : ({ Recognition: 'Send recognition', Comment: 'Add comment', Spotlight: 'Create spotlight' })[action.kind]}</h2><button aria-label="Close dialog" className="rounded-lg p-2 hover:bg-canvas" onClick={() => dialog.current.close()}><X size={20} /></button></div>
          <form className="grid gap-4" onSubmit={submitDialog}>
            {action.item && <p>Cost · {points(action.item[1])}</p>}
            {needsRecipient && <label className="field">Recipient<select name="recipient" required defaultValue={action.recipient || ''}><option value="">Choose a colleague</option>{recipients.map(name => <option key={name}>{name}</option>)}</select></label>}
            {!action.item && <label className="field">Message<textarea name="body" rows={4} maxLength={500} required /></label>}
            <div><button className="button" disabled={!ready}>Confirm</button></div>
            <p role="status" className="text-sm text-muted">{notice}</p>
          </form></>}
      </dialog>
      {!action && <div role="status" className={notice ? 'fixed right-4 bottom-4 z-10 max-w-[calc(100%-2rem)] rounded-xl bg-forest px-4 py-3 text-sm text-white shadow-lg' : 'sr-only'}>{notice}</div>}
    </div>
  );
}
