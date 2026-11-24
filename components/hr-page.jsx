'use client';

import { useState } from 'react';
import Link from 'next/link';
import { hrPages } from '../lib/hr-pages';
import { href } from '../lib/workspace';

const guideTopics = [
  ['Onboarding', 'Find the joining checklist and task owners.', href('people', 'onboarding')],
  ['Leave', 'Review the status of leave requests.', href('attendance', 'leave')],
  ['Payslips', 'Find sample payslip records by period.', href('payroll', 'payslips')],
  ['SOP', 'Search the library for step-by-step procedures.', href('resources', 'sop')],
  ['Recognition', 'Send a colleague a message of appreciation.', href('recognition', 'recognise')],
];

function WorkspaceGuide() {
  const [topic, setTopic] = useState(null);
  return <section className="card grid gap-4">
    <h2 className="text-xl font-extrabold">Workspace guide</h2>
    <p className="text-muted">Choose a topic for quick guidance. This demo uses preset answers.</p>
    <div className="flex flex-wrap gap-2">{guideTopics.map(item => <button key={item[0]} type="button" className="button button-light" aria-pressed={topic === item} onClick={() => setTopic(item)}>{item[0]}</button>)}</div>
    {topic && <div className="rounded-xl bg-canvas p-4"><p>{topic[1]}</p><Link className="mt-2 inline-block font-semibold underline" href={topic[2]}>Open {topic[0]}</Link></div>}
  </section>;
}

export function HrPage({ page, data, save }) {
  const [query, setQuery] = useState('');
  if (page === 'copilot') return <WorkspaceGuide />;
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

  return <>
    <div className="grid gap-3 sm:grid-cols-2">
      <section className="card"><p className="text-sm font-semibold text-muted">Demo records</p><p className="mt-2 text-2xl font-extrabold">{rows.length}</p></section>
      {transition && <section className="card"><p className="text-sm font-semibold text-muted">{transition[0]}</p><p className="mt-2 text-2xl font-extrabold">{pending}</p></section>}
    </div>
    <section className="card grid gap-5">
      <label className="field max-w-md">Search records<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={definition.headers.join(', ')} /></label>
      <div className="overflow-x-auto" role="region" aria-label="Search results" tabIndex={0}>
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead className="border-b border-line text-muted"><tr>{definition.headers.map(header => <th key={header} scope="col" className="px-2 py-3">{header}</th>)}{transition && <th scope="col" className="px-2 py-3">Action</th>}</tr></thead>
          <tbody className="divide-y divide-line">
            {result.map(({ cells, index }) => <tr key={index}>
              <th scope="row" className="px-2 py-4 font-semibold">{cells[0]}</th>
              <td className="px-2 py-4">{cells[1]}</td>
              <td className="px-2 py-4"><span className="inline-block rounded-lg bg-mint px-2 py-1 font-semibold">{cells[2]}</span></td>
              {transition && <td className="px-2 py-4">{cells[2] === transition[0] && <button type="button" className="button button-light" aria-label={transition[2] + ' · ' + cells[0]} onClick={() => changeStatus(index)}>{transition[2]}</button>}</td>}
            </tr>)}
          </tbody>
        </table>
      </div>
      {!result.length && <p role="status" className="text-muted">No matching records.</p>}
    </section>
  </>;
}
