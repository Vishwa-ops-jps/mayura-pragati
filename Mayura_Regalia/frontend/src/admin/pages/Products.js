import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { productsApi, categoriesApi } from '../services/adminApi';
import { formatCurrency, onImageError, IMAGE_PLACEHOLDER } from '../utils';

const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const COLOR_OPTIONS = [
  'Gold', 'Rose Gold', 'Silver', 'Antique Gold', 'Oxidised Silver',
  'Platinum', 'Copper', 'Multicolour',
];

const emptyProduct = {
  name: '', category: '', price: '', originalPrice: '', discount: 0,
  rating: 4.5, material: 'Premium Alloy', colors: ['Gold'], inStock: true,
  description: '', image: '/products/regalia-1.jpg', sku: '', stockQuantity: 0, lowStockThreshold: 5,
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read that image file'));
    reader.readAsDataURL(file);
  });
}

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productsApi.list();
      setProducts(data);
      setError('');
    } catch (err) {
      setError(`Could not load MySQL products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.list();
      setCategories((data || []).filter((c) => c.status !== 'inactive'));
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => { loadProducts(); loadCategories(); }, [loadProducts, loadCategories]);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return products;
    return products.filter((p) => `${p.name} ${p.category} ${p.sku || ''}`.toLowerCase().includes(term));
  }, [products, search]);

  const defaultCategory = categories[0]?.name || '';

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyProduct, category: defaultCategory });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      ...emptyProduct,
      ...product,
      colors: Array.isArray(product.colors) && product.colors.length
        ? product.colors
        : (product.color ? [product.color] : []),
    });
    setError('');
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleColor = (colorName) => {
    setForm((current) => {
      const has = current.colors.includes(colorName);
      const colors = has ? current.colors.filter((c) => c !== colorName) : [...current.colors, colorName];
      return { ...current, colors };
    });
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, image: dataUrl }));
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (!form.colors.length) {
        throw new Error('Pick at least one available colour');
      }
      if (editing) {
        await productsApi.update(editing.id, form);
        setMessage('Product updated in MySQL.');
      } else {
        await productsApi.create(form);
        setMessage('Product added to MySQL.');
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This will remove it from MySQL.`)) return;
    try {
      await productsApi.remove(product.id);
      setMessage('Product deleted from MySQL.');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <div className="product-toolbar">
        <div className="admin-search"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products or SKU..." /></div>
        <button className="add-product-btn" onClick={openAdd}>＋ Add Product</button>
      </div>

      {message && <div className="admin-success">✓ {message}</div>}
      {error && !modalOpen && <div className="admin-error">{error}</div>}

      <div className="admin-panel-card table-card">
        <div className="panel-heading"><div><span>CATALOGUE</span><h2>{filteredProducts.length} products</h2></div><small>Changes are saved directly to MySQL</small></div>
        {loading ? <div className="admin-loading">Loading products from MySQL...</div> : <ProductTable products={filteredProducts} onEdit={openEdit} onDelete={deleteProduct} />}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onMouseDown={() => setModalOpen(false)}>
          <div className="product-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading"><div><span>{editing ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</span><h2>{editing ? 'Update jewellery' : 'Add a product'}</h2></div><button onClick={() => setModalOpen(false)}>×</button></div>
            <form onSubmit={saveProduct} className="product-form">
              <div className="form-grid">
                <label>Product name<input name="name" value={form.name} onChange={handleChange} required /></label>

                <label>Category
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    {!categories.length && form.category && (
                      <option value={form.category}>{form.category}</option>
                    )}
                  </select>
                </label>

                <label>SKU<input name="sku" value={form.sku || ''} onChange={handleChange} placeholder="MR-NK-001" /></label>
                <label>Price (₹)<input name="price" type="number" min="0" value={form.price} onChange={handleChange} required /></label>
                <label>Original price (₹)<input name="originalPrice" type="number" min="0" value={form.originalPrice ?? ''} onChange={handleChange} /></label>

                <label>Discount
                  <select name="discount" value={form.discount} onChange={handleChange}>
                    {DISCOUNT_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d === 0 ? 'No discount' : `${d}% off`}</option>
                    ))}
                  </select>
                </label>

                <label>Stock quantity<input name="stockQuantity" type="number" min="0" value={form.stockQuantity ?? 0} onChange={handleChange} /></label>
                <label>Low stock alert below<input name="lowStockThreshold" type="number" min="0" value={form.lowStockThreshold ?? 5} onChange={handleChange} /></label>
                <label>Rating<input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} /></label>
                <label>Material<input name="material" value={form.material || ''} onChange={handleChange} /></label>

                <label className="full-width">Available colours
                  <div className="color-options">
                    {COLOR_OPTIONS.map((c) => (
                      <label key={c} className={`color-chip ${form.colors.includes(c) ? 'selected' : ''}`}>
                        <input
                          type="checkbox"
                          checked={form.colors.includes(c)}
                          onChange={() => toggleColor(c)}
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </label>

                <label className="full-width">Product image
                  <input type="file" accept="image/*" onChange={handleImageFile} />
                </label>
                {form.image && (
                  <div className="full-width image-preview">
                    <img src={form.image} alt="Product preview" onError={onImageError} />
                  </div>
                )}
                <label className="full-width">Or paste an image path / URL
                  <input name="image" value={form.image || ''} onChange={handleChange} placeholder="/products/regalia-1.jpg" />
                </label>

                <label className="full-width">Description<textarea name="description" rows="4" value={form.description || ''} onChange={handleChange} /></label>
              </div>
              <label className="stock-toggle"><input name="inStock" type="checkbox" checked={Boolean(form.inStock)} onChange={handleChange} /> Product is in stock</label>
              {error && <div className="admin-error">{error}</div>}
              <div className="modal-actions"><button type="button" onClick={() => setModalOpen(false)}>Cancel</button><button className="save-btn" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create product'}</button></div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const ProductTable = ({ products, onEdit, onDelete }) => (
  <div className="table-wrap">
    <table className="admin-table">
      <thead><tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th>RATING</th><th>ACTIONS</th></tr></thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td><div className="table-product"><img src={p.image || IMAGE_PLACEHOLDER} alt="" onError={onImageError} /><div><strong>{p.name}</strong><small>{p.sku || `#${String(p.id).padStart(4, '0')}`}</small></div></div></td>
            <td>{p.category}</td><td>{formatCurrency(p.price)}</td>
            <td>{p.stockQuantity ?? 0}</td>
            <td><span className={`stock-pill ${p.inStock ? 'in' : 'out'}`}>{p.inStock ? 'Active' : 'Out of stock'}</span></td>
            <td>★ {Number(p.rating).toFixed(1)}</td>
            <td><button className="table-action edit" onClick={() => onEdit(p)}>Edit</button><button className="table-action delete" onClick={() => onDelete(p)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </table>
    {!products.length && <div className="empty-table">No products found.</div>}
  </div>
);

export default Products;
