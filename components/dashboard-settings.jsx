import { BarChart3, Gift, Grid2X2, Newspaper, Palette, Zap } from 'lucide-react';

export const dashboardThemes = [
  { id: 'vivid', name: 'Vivid', colors: ['#302b79', '#0f766e', '#be185d'] },
  { id: 'ocean', name: 'Ocean', colors: ['#12365a', '#147eae', '#087783'] },
  { id: 'classic', name: 'Classic', colors: ['#132b4a', '#ffffff', '#b91f38'] },
];

const widgets = [
  ['metrics', 'HR metrics', Grid2X2],
  ['actions', 'Action center', Zap],
  ['charts', 'Attendance charts', BarChart3],
  ['activity', 'Rewards, Sales and SOP', Gift],
  ['shortcuts', 'Workspace shortcuts', Zap],
  ['feed', 'Team feed and celebrations', Newspaper],
];

export function DashboardSettings({ theme, visibility, ready, compact, narrow, onTheme, onWidget, onLayout, onReset }) {
  return <section className="card grid gap-6">
    <div className="flex items-center gap-3"><span className="panel-icon"><Palette size={21} aria-hidden="true" /></span><div><h2 className="text-xl font-bold">Dashboard appearance</h2><p className="text-sm text-muted">Your theme and section choices are saved on this browser.</p></div></div>
    <fieldset disabled={!ready} className="min-w-0">
      <legend className="mb-2 font-semibold">Color theme</legend>
      <div className="grid gap-2 sm:grid-cols-3">{dashboardThemes.map(option => (
        <label key={option.id} className="theme-option">
          <input type="radio" name="dashboard-theme" className="accent-accent" checked={theme === option.id} onChange={() => onTheme(option.id)} />
          <span className="grow font-semibold">{option.name}</span>
          <span aria-hidden="true" className="flex gap-1">{option.colors.map(color => <span key={color} className="size-4 rounded-full border border-line" style={{ backgroundColor: color }} />)}</span>
        </label>
      ))}</div>
    </fieldset>
    <fieldset disabled={!ready} className="min-w-0">
      <legend className="mb-2 font-semibold">Show on dashboard</legend>
      <div className="grid gap-2 sm:grid-cols-2">{widgets.map(([id, name, Icon]) => (
        <label key={id} className="theme-option">
          <Icon size={18} className="shrink-0 text-accent" aria-hidden="true" />
          <span className="grow text-sm font-semibold">{name}</span>
          <input type="checkbox" className="size-4 shrink-0 accent-accent" checked={visibility[id] !== false} onChange={event => onWidget(id, event.target.checked)} />
        </label>
      ))}</div>
    </fieldset>
    <fieldset disabled={!ready} className="grid gap-2 sm:grid-cols-2">
      <legend className="mb-2 font-semibold">Layout preferences</legend>
      <label className="theme-option"><span className="grow text-sm font-semibold">Compact dashboard</span><input className="size-4 accent-accent" type="checkbox" checked={compact} onChange={event => onLayout('dashboardDensity', event.target.checked ? 'compact' : 'comfortable')} /></label>
      <label className="theme-option"><span className="grow text-sm font-semibold">Narrow desktop sidebar</span><input className="size-4 accent-accent" type="checkbox" checked={narrow} onChange={event => onLayout('sidebarSize', event.target.checked ? 'narrow' : 'standard')} /></label>
    </fieldset>
    <div><button type="button" className="button button-light" disabled={!ready} onClick={onReset}>Reset dashboard preferences</button></div>
  </section>;
}
