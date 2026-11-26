'use client';

import { CalendarDays, Lightbulb, ListChecks } from 'lucide-react';

const events = [
  { id: 'town-hall', name: 'People & Culture Town Hall', schedule: '3 Dec 2026 · 3:00 PM IST', details: 'Meet the People team, hear programme updates and bring your questions.' },
  { id: 'wellbeing', name: 'Team Wellbeing Workshop', schedule: '10 Dec 2026 · 11:00 AM IST', details: 'A guided session on building healthier work routines.' },
  { id: 'showcase', name: 'Quarterly Team Showcase', schedule: '17 Dec 2026 · 4:00 PM IST', details: 'See what teams shipped and celebrate standout contributions.' },
];

const choices = ['Skills workshop', 'Volunteer day', 'Team sports', 'Creative activity'];

export function EngagementTools({ page, data, save }) {
  if (page === 'events') {
    return <div className="grid gap-4 md:grid-cols-2">{events.map(event => {
      const attending = data.eventRsvps?.includes(event.id);
      return <article key={event.id} className="card">
        <span className="panel-icon"><CalendarDays size={20} aria-hidden="true" /></span>
        <p className="mt-4 text-sm font-semibold text-accent">{event.schedule}</p>
        <h2 className="mt-1 text-xl font-bold">{event.name}</h2>
        <p className="mb-5 mt-2 text-sm text-muted">{event.details}</p>
        <button type="button" className={'button ' + (attending ? 'button-light' : 'button-accent')} aria-pressed={!!attending} onClick={() => save(previous => {
          const rsvps = previous.eventRsvps ?? [];
          return { ...previous, eventRsvps: rsvps.includes(event.id) ? rsvps.filter(id => id !== event.id) : [...rsvps, event.id] };
        }, attending ? 'RSVP cancelled.' : 'RSVP saved.')}>{attending ? 'Cancel RSVP' : 'RSVP'}</button>
      </article>;
    })}</div>;
  }
  if (page === 'polls') {
    return <section className="card">
      <span className="panel-icon"><ListChecks size={20} aria-hidden="true" /></span>
      <h2 className="mt-4 text-xl font-bold">Choose the next engagement activity</h2>
      <p className="mt-2 text-sm text-muted">Your selection can be changed on this device.</p>
      <fieldset className="mt-5 grid gap-2">
        <legend className="sr-only">Activity choices</legend>
        {choices.map(choice => <label key={choice} className="flex cursor-pointer items-center gap-3 rounded-xl bg-canvas p-3">
          <input type="radio" name="activity" className="accent-accent" checked={data.activityVote === choice} onChange={() => save(previous => ({ ...previous, activityVote: choice }), 'Vote saved.')} />{choice}
        </label>)}
      </fieldset>
    </section>;
  }
  return <section className="card">
    <span className="panel-icon"><Lightbulb size={20} aria-hidden="true" /></span>
    <h2 className="mt-4 text-xl font-bold">Suggest an improvement</h2>
    <form className="mt-4 grid gap-3" onSubmit={event => {
      event.preventDefault();
      const form = event.currentTarget;
      const values = new FormData(form);
      const title = String(values.get('title')).trim();
      const details = String(values.get('details')).trim();
      if (!title || !details) return;
      const idea = { id: crypto.randomUUID(), title, details };
      save(previous => ({ ...previous, ideas: [idea, ...(previous.ideas ?? [])] }), 'Idea saved.');
      form.reset();
    }}>
      <label className="field">Idea title<input name="title" required maxLength={80} /></label>
      <label className="field">Details<textarea name="details" required maxLength={500} rows={3} /></label>
      <div><button className="button button-accent">Save idea</button></div>
    </form>
    <h3 className="mt-6 font-bold">Your saved ideas</h3>
    {(data.ideas ?? []).length ? <ul className="mt-2 divide-y divide-line">{data.ideas.map(idea => <li key={idea.id} className="break-words py-3"><strong>{idea.title}</strong><p className="text-sm text-muted">{idea.details}</p></li>)}</ul> : <p className="mt-2 text-sm text-muted">Ideas you save on this device will appear here.</p>}
  </section>;
}
