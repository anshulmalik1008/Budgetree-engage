'use client';

import { useState } from 'react';
import { CalendarDays, Lightbulb, ListChecks } from 'lucide-react';

const events = [
  { id: 'town-hall', name: 'People & Culture Town Hall', schedule: '3 Dec 2026 · 3:00 PM IST', details: 'Meet the People team, hear programme updates and bring your questions.' },
  { id: 'wellbeing', name: 'Team Wellbeing Workshop', schedule: '10 Dec 2026 · 11:00 AM IST', details: 'A guided session on building healthier work routines.' },
  { id: 'showcase', name: 'Quarterly Team Showcase', schedule: '17 Dec 2026 · 4:00 PM IST', details: 'See what teams shipped and celebrate standout contributions.' },
];

const choices = ['Skills workshop', 'Volunteer day', 'Team sports', 'Creative activity'];

export function EngagementTools({ page, data, save, ready }) {
  const [eventDraft, setEventDraft] = useState(null);
  const teamEvents = data.teamEvents ?? events;
  if (page === 'events') {
    return <>
      <div><button className="button button-accent" disabled={!ready} onClick={() => setEventDraft({})}>Add event</button></div>
      {eventDraft && <form key={eventDraft.id ?? 'new'} className="card grid gap-3 sm:grid-cols-2" onSubmit={event => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const name = String(form.get('name')).trim();
        const schedule = String(form.get('schedule')).trim();
        const details = String(form.get('details')).trim();
        if (!name || !schedule || !details) return;
        const row = { id: eventDraft.id ?? crypto.randomUUID(), name, schedule, details };
        save(previous => {
          const current = previous.teamEvents ?? events;
          return { ...previous, teamEvents: eventDraft.id ? current.map(entry => entry.id === row.id ? row : entry) : [...current, row] };
        }, 'Event saved.');
        setEventDraft(null);
      }}>
        <label className="field">Event name<input name="name" required maxLength={100} defaultValue={eventDraft.name} /></label>
        <label className="field">Date, time and time zone<input name="schedule" required maxLength={100} defaultValue={eventDraft.schedule} placeholder="3 Dec 2026 · 3:00 PM IST" /></label>
        <label className="field sm:col-span-2">Details<textarea name="details" required maxLength={500} defaultValue={eventDraft.details} /></label>
        <div className="flex gap-2"><button className="button">Save event</button><button type="button" className="button button-light" onClick={() => setEventDraft(null)}>Cancel</button></div>
      </form>}
      <div className="grid gap-4 md:grid-cols-2">{teamEvents.map(event => {
      const attending = data.eventRsvps?.includes(event.id);
      return <article key={event.id} className="card">
        <span className="panel-icon"><CalendarDays size={20} aria-hidden="true" /></span>
        <p className="mt-4 text-sm font-semibold text-accent">{event.schedule}</p>
        <h2 className="mt-1 text-xl font-bold">{event.name}</h2>
        <p className="mb-5 mt-2 text-sm text-muted">{event.details}</p>
        <div className="flex flex-wrap gap-2"><button type="button" disabled={!ready} className={'button ' + (attending ? 'button-light' : 'button-accent')} aria-pressed={!!attending} onClick={() => save(previous => {
          const rsvps = previous.eventRsvps ?? [];
          return { ...previous, eventRsvps: rsvps.includes(event.id) ? rsvps.filter(id => id !== event.id) : [...rsvps, event.id] };
        }, attending ? 'RSVP cancelled.' : 'RSVP saved.')}>{attending ? 'Cancel RSVP' : 'RSVP'}</button>
        <button className="button button-light" disabled={!ready} onClick={() => setEventDraft(event)}>Edit</button>
        <button className="button button-light" disabled={!ready} onClick={() => {
          if (!window.confirm('Remove this event?')) return;
          save(previous => ({ ...previous, teamEvents: (previous.teamEvents ?? events).filter(row => row.id !== event.id), eventRsvps: (previous.eventRsvps ?? []).filter(id => id !== event.id) }), 'Event removed.');
          if (eventDraft?.id === event.id) setEventDraft(null);
        }}>Remove</button></div>
      </article>;
    })}</div>{!teamEvents.length && <p className="card text-muted">No events added.</p>}</>;
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
