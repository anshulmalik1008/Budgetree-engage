'use client';

import { useState } from 'react';
import { hrPages } from '../lib/hr-pages';

const editable = {
  onboarding: ['Pending', 'Complete'], offboarding: ['Pending', 'Complete'],
  departments: [], 'org-chart': [], roles: [], documents: ['Draft', 'Published'],
  assets: ['Assigned', 'Return pending', 'Returned', 'Available'],
  attendance: ['Present', 'Absent', 'On leave', 'Remote'],
  leave: ['Pending', 'Approved', 'Rejected'], shifts: [], holidays: [],
  remote: ['Pending', 'Approved', 'Rejected'], payroll: ['Draft', 'In review', 'Closed'],
  payslips: ['Draft', 'Issued'], reviews: ['In progress', 'Complete'],
  goals: ['In progress', 'Complete'],
};

export function HrPage({ page, data, save, ready }) {
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState('');
  const choices = editable[page];
  const definition = hrPages[page];
  if (!definition) return null;
  const rows = data.hrRecords?.[page] ?? definition.rows;
  const result = rows.map((cells, index) => ({ cells, index })).filter(({ cells }) =>
    cells.join(' ').toLowerCase().includes(query.trim().toLowerCase()),
  );
  const transition = definition.next;
  const pending = transition && rows.filter(cells => cells[2] === transition[0]).length;

  function changeStatus(index) {
    save(previous => {
      const current = previous.hrRecords?.[page] ?? definition.rows;
      const updated = current.map((cells, rowIndex) => rowIndex === index && cells[2] === transition[0] ? [cells[0], cells[1], transition[1]] : cells);
      return { ...previous, hrRecords: { ...previous.hrRecords, [page]: updated } };
    }, 'Demo record updated.');
  }

  function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const cells = definition.headers.map((_, index) => String(values.get('field-' + index) ?? '').trim());
    if (cells.some(value => !value)) { setError('Complete all fields.'); return; }
    save(previous => {
      const current = previous.hrRecords?.[page] ?? definition.rows;
      const next = editor.index === null ? [...current, cells] : current.map((row, index) => index === editor.index ? cells : row);
      return { ...previous, hrRecords: { ...previous.hrRecords, [page]: next } };
    }, 'Record saved.');
    setEditor(null);
  }

  function remove(index) {
    if (!window.confirm('Remove this record?')) return;
    save(previous => ({
      ...previous,
      hrRecords: {
        ...previous.hrRecords,
        [page]: (previous.hrRecords?.[page] ?? definition.rows).filter((_, rowIndex) => rowIndex !== index),
      },
    }), 'Record removed.');
    setEditor(null);
  }

  return <>
    <div className="grid gap-3 sm:grid-cols-2">
      <section className="card"><p className="text-sm font-semibold text-muted">Records</p><p className="mt-2 text-2xl font-extrabold">{rows.length}</p></section>
      {transition && <section className="card"><p className="text-sm font-semibold text-muted">{transition[0]}</p><p className="mt-2 text-2xl font-extrabold">{pending}</p></section>}
    </div>
    <section className="card grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="field max-w-md">Search records<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={definition.headers.join(', ')} /></label>
        {choices && <button className="button button-accent" disabled={!ready} onClick={() => { setError(''); setEditor({ index: null, cells: [] }); }}>{['onboarding','offboarding'].includes(page) ? 'Add task' : 'Add record'}</button>}
      </div>
      {editor && <form key={editor.index ?? 'new'} className="grid gap-3 rounded-xl border border-line bg-canvas p-4 sm:grid-cols-2" onSubmit={submit}>
        <h3 className="font-bold sm:col-span-2">{editor.index === null ? 'New record' : 'Edit record'}</h3>
        {definition.headers.map((label, index) => {
          const field = 'field-' + index;
          const value = editor.cells[index] ?? '';
          return <label key={field} className="field">{label}
            {index === 2 && choices.length ? <select name={field} required defaultValue={value || choices[0]}>{Array.from(new Set([...choices, ...(value ? [value] : [])])).map(choice => <option key={choice}>{choice}</option>)}</select> :
              <input name={field} required maxLength={120} defaultValue={value} type={label === 'Employees' ? 'number' : 'text'} min={label === 'Employees' ? 0 : undefined} />}
          </label>;
        })}
        <div className="flex flex-wrap gap-2 sm:col-span-2"><button className="button button-accent">Save record</button><button type="button" className="button button-light" onClick={() => setEditor(null)}>Cancel</button></div>
        {error && <p role="alert" className="text-sm text-accent">{error}</p>}
      </form>}
      <div className="overflow-x-auto" role="region" aria-label="Search results" tabIndex={0}>
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="border-b border-line text-muted"><tr>{definition.headers.map(header => <th key={header} scope="col" className="px-2 py-3">{header}</th>)}{(transition || choices) && <th scope="col" className="px-2 py-3">Action</th>}</tr></thead>
          <tbody className="divide-y divide-line">
            {result.map(({ cells, index }) => <tr key={index}>
              <th scope="row" className="px-2 py-4 font-semibold">{cells[0]}</th>
              <td className="px-2 py-4">{cells[1]}</td>
              <td className="px-2 py-4"><span className="inline-block rounded-lg bg-mint px-2 py-1 font-semibold">{cells[2]}</span></td>
              {(transition || choices) && <td className="px-2 py-4"><div className="flex flex-wrap gap-1">
                {transition && cells[2] === transition[0] && <button type="button" className="button button-light" disabled={!ready} aria-label={transition[2] + ' · ' + cells[0]} onClick={() => changeStatus(index)}>{transition[2]}</button>}
                {choices && <><button type="button" className="button button-light" disabled={!ready} aria-label={'Edit ' + cells[0]} onClick={() => { setError(''); setEditor({ index, cells }); }}>Edit</button><button type="button" className="button button-light" disabled={!ready} aria-label={'Remove ' + cells[0]} onClick={() => remove(index)}>Remove</button></>}
              </div></td>}
            </tr>)}
          </tbody>
        </table>
      </div>
      {!result.length && <p role="status" className="text-muted">No matching records.</p>}
    </section>
  </>;
}
