'use client';

import { useState } from 'react';
import { employeeRecords, sampleCelebrations } from '../lib/employee-records';
import { prepareWorkspaceImage } from './branding-settings';

const amount = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

export function EmployeePhoto({ employee }) {
  return employee.photo
    ? <img className="size-12 shrink-0 rounded-xl object-cover" src={employee.photo} alt="" />
    : <span aria-hidden="true" className="panel-icon shrink-0 font-bold">{employee.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('')}</span>;
}

export function EmployeeRecords({ page, data, save, ready }) {
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const records = employeeRecords(data);
  const exitPage = page === 'offboarding';
  const filtered = records.filter(employee => {
    const matchesPage = page === 'onboarding' ? employee.status === 'Joining' : exitPage || !employee.archived;
    return matchesPage && [employee.name, employee.department, employee.email, employee.role].join(' ').toLowerCase().includes(query.trim().toLowerCase());
  });

  function update(id, patch, message) {
    save(previous => ({ ...previous, employees: employeeRecords(previous).map(record => record.id === id ? { ...record, ...patch } : record) }), message);
  }

  async function submit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const get = key => String(values.get(key) ?? '').trim();
    if (exitPage) {
      update(editing.id, {
        status: 'Exited', exitDate: get('exitDate'), exitReason: get('reason'),
        settlement: { earnings: Number(get('earnings')), deductions: Number(get('deductions')), status: get('settlementStatus') },
      }, 'Exit and settlement saved.');
      setEditing(null);
      return;
    }
    if (!get('name') || !get('department') || !get('role')) {
      setError('Enter a name, department and job title.');
      return;
    }
    const email = get('email').toLowerCase();
    if (records.some(record => record.id !== editing.id && record.email?.toLowerCase() === email)) {
      setError('An employee with this email already exists.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const file = values.get('photo');
      const photo = file?.size ? await prepareWorkspaceImage(file) : values.has('removePhoto') ? '' : editing.photo;
      const record = {
        name: get('name'), email, department: get('department'), role: get('role'),
        joinDate: get('joinDate'), photo, status: editing.status ?? (page === 'onboarding' ? 'Joining' : 'Active'),
      };
      if (editing.id) update(editing.id, record, 'Employee updated.');
      else {
        const id = crypto.randomUUID();
        save(previous => ({ ...previous, employees: [...employeeRecords(previous), { ...record, id }] }), 'Employee added.');
      }
      setEditing(null);
    } catch (failure) {
      setError(failure.message || 'Unable to open this photo.');
    } finally {
      setBusy(false);
    }
  }

  return <>
    <section className="card flex flex-wrap items-end justify-between gap-3">
      <label className="field w-full sm:max-w-sm">Find employee<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, email or department" /></label>
      {!exitPage && <button className="button button-accent" disabled={!ready || busy} onClick={() => { setError(''); setEditing({}); }}>Add employee</button>}
    </section>
    {editing && <section className="card">
      <h2 className="mb-3 text-lg font-bold">{exitPage ? 'Exit and full & final settlement' : editing.id ? 'Edit employee' : 'Add employee'}</h2>
      <form key={editing.id ?? 'new'} onSubmit={submit}>
        <fieldset disabled={!ready || busy} className="grid gap-3 sm:grid-cols-2">
          {exitPage ? <>
            <label className="field">Last working day<input name="exitDate" type="date" required defaultValue={editing.exitDate} /></label>
            <label className="field">Exit reason<input name="reason" maxLength={120} defaultValue={editing.exitReason} /></label>
            <label className="field">Amount payable before deductions (₹)<input name="earnings" type="number" min="0" max="100000000" step="0.01" required defaultValue={editing.settlement?.earnings ?? 0} /></label>
            <label className="field">Deductions (₹)<input name="deductions" type="number" min="0" max="100000000" step="0.01" required defaultValue={editing.settlement?.deductions ?? 0} /></label>
            <label className="field">Settlement status<select name="settlementStatus" defaultValue={editing.settlement?.status ?? 'Pending'}><option>Pending</option><option>Settled</option></select></label>
          </> : <>
            <label className="field">Full name<input name="name" required maxLength={80} defaultValue={editing.name} /></label>
            <label className="field">Work email<input name="email" type="email" required maxLength={120} defaultValue={editing.email} /></label>
            <label className="field">Department<input name="department" required maxLength={80} defaultValue={editing.department} /></label>
            <label className="field">Job title<input name="role" required maxLength={80} defaultValue={editing.role} /></label>
            <label className="field">Joining date<input name="joinDate" type="date" required defaultValue={editing.joinDate} /></label>
            <label className="field">Employee photo<input name="photo" type="file" accept="image/png,image/jpeg,image/webp" /><span className="text-xs text-muted">PNG, JPEG or WebP, up to 5 MB.</span></label>
            {editing.photo && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="removePhoto" /> Remove existing photo</label>}
          </>}
          <div className="flex flex-wrap gap-2 sm:col-span-2"><button className="button button-accent">{busy ? 'Saving…' : 'Save record'}</button><button type="button" className="button button-light" onClick={() => setEditing(null)}>Cancel</button></div>
        </fieldset>
        {error && <p className="mt-3 text-sm text-accent" role="alert">{error}</p>}
      </form>
    </section>}
    <div className="grid gap-3 md:grid-cols-2">{filtered.map(employee => <article className="card min-w-0" key={employee.id}>
      <div className="flex items-center gap-3"><EmployeePhoto employee={employee} /><div className="min-w-0"><h2 className="break-words font-bold">{employee.name}</h2><p className="break-words text-sm text-muted">{employee.department}{employee.role && ' · ' + employee.role}</p></div></div>
      <p className="mt-2 break-words text-sm text-muted">{employee.email}</p>
      {employee.joinDate && <p className="text-sm text-muted">Joined {employee.joinDate}</p>}
      {employee.exitDate && <p className="text-sm text-muted">Last day {employee.exitDate}{employee.exitReason && ' · ' + employee.exitReason}</p>}
      {employee.settlement && <p className="text-sm font-semibold">FnF {amount.format(employee.settlement.earnings - employee.settlement.deductions)} · {employee.settlement.status}</p>}
      <p className="mt-2 text-sm font-bold">{employee.archived ? 'Archived' : employee.status}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {!employee.archived && <button className="button button-light" disabled={!ready || busy} onClick={() => { setError(''); setEditing(employee); }}>{exitPage ? employee.exitDate ? 'Edit exit / FnF' : 'Start offboarding' : 'Edit / photo'}</button>}
        {!exitPage && employee.status === 'Joining' && <button className="button" disabled={!ready} onClick={() => update(employee.id, { status: 'Active' }, 'Onboarding completed.')}>Complete onboarding</button>}
        {exitPage && (employee.archived || (employee.status === 'Exited' && employee.settlement?.status === 'Settled')) && <button className="button button-light" disabled={!ready || busy} onClick={() => update(employee.id, { archived: !employee.archived }, employee.archived ? 'Employee restored to the directory.' : 'Employee archived.')}>{employee.archived ? 'Restore employee' : 'Archive employee'}</button>}
      </div>
    </article>)}</div>
    {!filtered.length && <p role="status" className="card text-muted">No matching employees.</p>}
  </>;
}

export function CelebrationRecords({ data, save, ready, onRecognise }) {
  const [editing, setEditing] = useState(null);
  const celebrations = data.celebrations ?? sampleCelebrations;
  return <>
    <div><button className="button button-accent" disabled={!ready} onClick={() => setEditing({})}>Add celebration</button></div>
    {editing && <form key={editing.id ?? 'new'} className="card grid gap-3 sm:grid-cols-2" onSubmit={event => {
      event.preventDefault();
      const values = new FormData(event.currentTarget);
      const name = String(values.get('name')).trim();
      if (!name) return;
      const entry = { id: editing.id ?? crypto.randomUUID(), name, occasion: values.get('occasion'), date: values.get('date') };
      save(previous => {
        const rows = previous.celebrations ?? sampleCelebrations;
        return { ...previous, celebrations: editing.id ? rows.map(row => row.id === entry.id ? entry : row) : [...rows, entry] };
      }, 'Celebration saved.');
      setEditing(null);
    }}>
      <label className="field">Employee name<input name="name" required maxLength={80} defaultValue={editing.name} list="celebration-employees" /><datalist id="celebration-employees">{employeeRecords(data).filter(record => !record.archived).map(record => <option key={record.id} value={record.name} />)}</datalist></label>
      <label className="field">Occasion<select name="occasion" defaultValue={editing.occasion ?? 'Birthday'}><option>Birthday</option><option>Work anniversary</option><option>Team milestone</option></select></label>
      <label className="field">Date<input name="date" type="date" required defaultValue={editing.date} /></label>
      <div className="flex flex-wrap items-end gap-2"><button className="button">Save celebration</button><button type="button" className="button button-light" onClick={() => setEditing(null)}>Cancel</button></div>
    </form>}
    <div className="grid gap-3 md:grid-cols-2">{celebrations.map(entry => <article className="card" key={entry.id}>
      <h2 className="font-bold">{entry.name}</h2><p className="mb-3 text-sm text-muted">{entry.occasion} · {entry.date}</p>
      <div className="flex flex-wrap gap-2"><button className="button" onClick={() => onRecognise(entry.name)}>Send wishes</button><button className="button button-light" disabled={!ready} onClick={() => setEditing(entry)}>Edit</button><button className="button button-light" disabled={!ready} onClick={() => {
        if (!window.confirm('Remove this celebration?')) return;
        save(previous => ({ ...previous, celebrations: (previous.celebrations ?? sampleCelebrations).filter(row => row.id !== entry.id) }), 'Celebration removed.');
        if (editing?.id === entry.id) setEditing(null);
      }}>Remove</button></div>
    </article>)}</div>
    {!celebrations.length && <p className="card text-muted">No celebrations added.</p>}
  </>;
}
