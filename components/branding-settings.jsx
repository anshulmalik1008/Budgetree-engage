'use client';

import { useState } from 'react';
import { Building2, Upload } from 'lucide-react';

export const defaultLogo = '/workspace/budgetree-logo.png';
export const defaultCompany = 'Budgetree';

export async function prepareWorkspaceImage(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a PNG, JPEG or WebP image.');
  }
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose an image under 5 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 600 / image.naturalWidth, 240 / image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const logo = canvas.toDataURL('image/webp', 0.9);
    if (!logo.startsWith('data:image/') || logo.length > 400000) throw new Error('Choose a smaller image.');
    return logo;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function BrandingSettings({ company, logo, ready, onSave, onReset }) {
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('company')).trim();
    const file = values.get('logo');
    if (!name) { setError('Enter a company name.'); return; }
    setError('');
    setSaving(true);
    try {
      const nextLogo = file?.size ? await prepareWorkspaceImage(file) : logo;
      onSave(name, nextLogo);
      form.elements.logo.value = '';
    } catch (failure) {
      setError(failure instanceof Error && failure.name === 'Error' ? failure.message : 'This image could not be opened.');
    } finally {
      setSaving(false);
    }
  }

  return <section className="card grid gap-5">
    <div className="flex items-center gap-3"><span className="panel-icon"><Building2 size={21} aria-hidden="true" /></span><div><h2 className="text-xl font-bold">Company branding</h2><p className="text-sm text-muted">Set the name and logo shown in the workspace. Changes apply on this browser.</p></div></div>
    <div className="branding-preview"><img src={logo || defaultLogo} alt={logo ? company + ' logo' : 'Budgetree logo'} /><strong>{company}</strong></div>
    <form key={company} onSubmit={submit}>
      <fieldset className="grid gap-4" disabled={!ready || saving}>
        <label className="field">Company name<input name="company" maxLength={60} defaultValue={company} required /></label>
        <label className="field"><span className="flex items-center gap-2"><Upload size={16} aria-hidden="true" /> Company logo</span><input name="logo" type="file" accept="image/png,image/jpeg,image/webp" /><span className="text-xs font-normal text-muted">PNG, JPEG or WebP, up to 5 MB.</span></label>
        <div className="flex flex-wrap gap-2"><button className="button button-accent">{saving ? 'Saving…' : 'Save branding'}</button><button type="button" className="button button-light" onClick={() => { setError(''); onReset(); }}>Restore Budgetree branding</button></div>
      </fieldset>
      {error && <p role="alert" className="mt-2 text-sm text-accent">{error}</p>}
    </form>
  </section>;
}
