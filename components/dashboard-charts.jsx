'use client';

import { useState } from 'react';

const attendanceHistory = [76, 82, 79, 87, 85, 92, 89, 91, 87, 94, 93, 96, 91, 95];
const attendanceStates = [
  ['Present', '#174a7e'],
  ['On leave', '#d04c60'],
  ['Other', '#c7d7e8'],
];

export function DashboardCharts({ records }) {
  const [range, setRange] = useState(7);
  const values = attendanceHistory.slice(-range);
  const line = values.map((value, index) => [36 + index * 350 / (values.length - 1), 116 - (value - 70) * 3]);
  const points = line.map(point => point.join(',')).join(' ');
  const groups = attendanceStates.map(([label, color]) => ({
    label,
    color,
    count: records.filter(row => label === 'Other' ? !['Present', 'On leave'].includes(row[2]) : row[2] === label).length,
  }));
  let offset = 0;
  const stops = groups.filter(group => group.count).map(({ color, count }) => {
    const start = offset;
    offset += count / records.length * 100;
    return color + ' ' + start + '% ' + offset + '%';
  });
  const fill = stops.length ? 'conic-gradient(' + stops.join(',') + ')' : '#e9eff7';

  return <section aria-label="Workforce analytics" className="dashboard-charts">
    <figure className="card min-w-0">
      <figcaption className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-lg font-bold">Attendance trend</h2><p className="text-sm text-muted">Sample workday history</p></div>
        <div className="flex gap-1 rounded-lg bg-canvas p-1" role="group" aria-label="Attendance trend range">
          {[7, 14].map(days => <button key={days} type="button" className={'rounded-md px-3 py-1.5 text-sm font-semibold ' + (range === days ? 'bg-forest text-white' : 'text-muted')} aria-pressed={range === days} onClick={() => setRange(days)}>{days} days</button>)}
        </div>
      </figcaption>
      <svg className="mt-4 w-full" viewBox="0 0 400 140" role="img" aria-label={'Sample attendance percentages for ' + range + ' workdays: ' + values.join(', ')}>
        <defs><linearGradient id="trend-fill" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#4588bd" stopOpacity=".24" /><stop offset="1" stopColor="#4588bd" stopOpacity=".03" /></linearGradient></defs>
        {[70, 80, 90, 100].map(value => {
          const y = 116 - (value - 70) * 3;
          return <g key={value}><text x="1" y={y + 4} fill="#4d5e73" fontSize="10">{value}%</text><line x1="36" x2="386" y1={y} y2={y} stroke="#dce3ed" /></g>;
        })}
        <polygon points={'36,116 ' + points + ' 386,116'} fill="url(#trend-fill)" />
        <polyline points={points} fill="none" stroke="#174a7e" strokeWidth="3" strokeLinejoin="round" />
        {line.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.5" fill="#fff" stroke="#174a7e" strokeWidth="2"><title>{'Workday ' + (index + 1) + ': ' + values[index] + '%'}</title></circle>)}
      </svg>
    </figure>
    <figure className="card min-w-0">
      <figcaption><h2 className="text-lg font-bold">Attendance breakdown</h2><p className="text-sm text-muted">Current workspace records</p></figcaption>
      <div className="mt-4 flex flex-wrap items-center gap-5">
        <div className="attendance-donut" style={{ background: fill }} aria-hidden="true"><div><strong>{records.length}</strong><span>records</span></div></div>
        <ul className="grid min-w-28 grow gap-2">{groups.map(group => <li key={group.label} className="flex items-center gap-2 text-sm"><span className="size-2.5 rounded-full" style={{ background: group.color }} aria-hidden="true" /><span className="grow">{group.label}</span><strong>{group.count}</strong></li>)}</ul>
      </div>
    </figure>
  </section>;
}
