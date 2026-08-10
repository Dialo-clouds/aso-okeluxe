'use client';

import { useState } from 'react';

const WEAVE_OPTIONS = ['navy', 'purple', 'brown', 'gold', 'multicolor'];

export default function ProductForm({ initial, onSubmit, submitLabel }) {
  const [name, setName] = useState(initial?.name || '');
  const [nameYo, setNameYo] = useState(initial?.nameYo || '');
  const [tag, setTag] = useState(initial?.tag || '');
  const [weave, setWeave] = useState(initial?.weave || 'navy');
  const [priceNaira, setPriceNaira] = useState(initial ? initial.priceKobo / 100 : '');
  const [image, setImage] = useState(initial?.image || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const ok = await onSubmit({
      name,
      nameYo: nameYo || undefined,
      tag: tag || undefined,
      weave,
      priceKobo: Math.round(parseFloat(priceNaira) * 100),
      image: image || undefined,
    });
    setSaving(false);
    if (!ok) setError('Something went wrong saving this product.');
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      {error && <p className="auth-error">{error}</p>}
      <div className="field">
        <label>Product Name (English)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Product Name (Yoruba, optional)</label>
        <input value={nameYo} onChange={(e) => setNameYo(e.target.value)} />
      </div>
      <div className="field">
        <label>Tag (e.g. "NAVY CHECKER · SET")</label>
        <input value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>
      <div className="field">
        <label>Weave Category</label>
        <select value={weave} onChange={(e) => setWeave(e.target.value)}>
          {WEAVE_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Price (₦)</label>
        <input type="number" min="0" step="1" value={priceNaira} onChange={(e) => setPriceNaira(e.target.value)} required />
      </div>
      <div className="field">
        <label>Image path (e.g. /products/photo.jpg)</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} />
      </div>
      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
