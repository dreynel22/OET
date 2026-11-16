
import { useEffect, useState } from 'react';

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
  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch equipment.');
      }

      const data = await response.json();
      setEquipment(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openForm() {
    setForm(initialForm);
    setValidationErrors({});
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setForm(initialForm);
    setValidationErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setValidationErrors({});
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });

      const data = await response.json();

      if (response.status === 422) {
        setValidationErrors(data.errors || {});
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save equipment.');
      }

      cancelForm();
      await fetchEquipment();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
                onClick={openForm}
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
          {!loading && !error && equipment.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
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

                      <td className="px-4 py-3 capitalize">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>
      </main>

      {/* Add Equipment Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelForm();
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
                  Add New Equipment
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the equipment details below.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg px-3 py-1 text-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-800"
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
                  value={form.quantity}
                  onChange={handleChange}
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
                onClick={cancelForm}
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
                {submitting ? 'Saving...' : 'Save Equipment'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

export default App;
