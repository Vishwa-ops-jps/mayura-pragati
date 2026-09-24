import React from 'react';
import ResourceManager from '../components/ResourceManager';
import { categoriesApi } from '../services/adminApi';

const emptyForm = { name: '', description: '', image: '', status: 'active', sortOrder: 0 };

const columns = [
  { key: 'name', label: 'NAME' },
  { key: 'status', label: 'STATUS', render: (row) => <span className={`status-pill ${row.status}`}>{row.status}</span> },
  { key: 'sortOrder', label: 'ORDER' },
];

const formFields = [
  { name: 'name', label: 'Category name', required: true },
  { name: 'sortOrder', label: 'Sort order', type: 'number' },
  { name: 'image', label: 'Image path', placeholder: '/categories/necklaces.jpg' },
  { name: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
  { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
];

const Categories = () => (
  <ResourceManager
    api={categoriesApi}
    title="Category"
    subtitle="categories"
    columns={columns}
    formFields={formFields}
    emptyForm={emptyForm}
    searchKeys={['name']}
    searchPlaceholder="Search categories..."
  />
);

export default Categories;
