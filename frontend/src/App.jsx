
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8000/api/equipment';

const initialForm = {
  name: '',
  category: '',
  quantity: 0,
  status: 'available',
  notes: '',
};

function App() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  // SweetAlert success notification
  function showSuccess(message) {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: message,
      confirmButtonColor: '#2563eb',
      timer: 2000,
      timerProgressBar: true,
    });
  }

  // SweetAlert error notification
  function showError(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      confirmButtonColor: '#dc2626',
    });
  }

  // Fetch all equipment
  async function fetchEquipment() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch equipment.');
      }

      const data = await response.json();

      setEquipment(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle form input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Open create modal
  function openCreateModal() {
    setEditingId(null);
    setForm(initialForm);
    setValidationErrors({});
    setError('');
    setShowForm(true);
  }

  // Open edit modal
  function openEditModal(item) {
    setEditingId(item.id);

    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status,
      notes: item.notes || '',
    });

    setValidationErrors({});
    setError('');
    setShowForm(true);
  }

  // Close form modal
  function closeFormModal() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setValidationErrors({});
  }

  // Create or update equipment
  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setValidationErrors({});
    setError('');

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...form,
            quantity: Number(form.quantity),
          }),
        }
      );

      const data = await response.json();

      // Laravel validation errors
      if (response.status === 422) {
        setValidationErrors(data.errors || {});

        const messages = Object.values(data.errors || {})
          .flat()
          .join('\n');

        await Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: messages || 'Please check your input.',
          confirmButtonColor: '#2563eb',
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to save equipment.'
        );
      }

      closeFormModal();

      await fetchEquipment();

      showSuccess(
        isEditing
          ? 'Equipment updated successfully!'
          : 'Equipment created successfully!'
      );

    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Delete equipment with SweetAlert confirmation
  async function handleDelete(item) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${item.name}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`${API_URL}/${item.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to delete equipment.'
        );
      }

      await fetchEquipment();

      showSuccess('Equipment deleted successfully!');

    } catch (err) {
      Swal.close();
      showError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">

      {/* Header */}
      <header className="bg-slate-900 px-6 py-8 text-white shadow">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold tracking-tight">
            Office Equipment Tracker
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Manage and monitor your office equipment.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-xl bg-white p-6 shadow-sm">

          {/* Inventory Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Equipment Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your office equipment records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                Total records: {equipment.length}
              </span>

              <button
                onClick={openCreateModal}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                + Add Equipment
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Loading */}
          {loading && (
            <p className="py-8 text-center text-slate-500">
              Loading equipment...
            </p>
          )}

          {/* Empty State */}
          {!loading && !error && equipment.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center">
              <h3 className="font-medium text-slate-800">
                No equipment found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your equipment inventory is currently empty.
              </p>
            </div>
          )}

          {/* Equipment Table */}
          {!loading && equipment.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">

                      <td className="px-4 py-3 font-medium">
                        {item.name}
                      </td>

                      <td className="px-4 py-3">
                        {item.category}
                      </td>

                      <td className="px-4 py-3">
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'in use'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => openEditModal(item)}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>
      </main>

      {/* Create / Edit Equipment Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFormModal();
            }
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
          >

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingId ? 'Edit Equipment' : 'Add New Equipment'}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {editingId
                    ? 'Update the equipment details below.'
                    : 'Enter the equipment details below.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeFormModal}
                className="rounded-lg px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g. Dell Laptop"
                />

                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Category *
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g. Electronics"
                />

                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.category[0]}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Quantity *
                </label>

                <input
                  type="number"
                  name="quantity"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {validationErrors.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.quantity[0]}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Status *
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="available">Available</option>
                  <option value="in use">In Use</option>
                  <option value="broken">Broken</option>
                </select>

                {validationErrors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.status[0]}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Optional notes about this equipment"
                />

                {validationErrors.notes && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.notes[0]}
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">

              <button
                type="button"
                onClick={closeFormModal}
                disabled={submitting}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? 'Saving...'
                  : editingId
                  ? 'Update Equipment'
                  : 'Save Equipment'}
              </button>

            </div>

          </form>
        </div>
      )}

    </div>
  );
}

export default App;
