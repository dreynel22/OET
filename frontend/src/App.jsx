
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000/api/equipment';

function App() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
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

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Equipment Inventory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and manage your office equipment records.
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              Total records: {equipment.length}
            </span>
          </div>

          {loading && (
            <p className="py-8 text-center text-slate-500">
              Loading equipment...
            </p>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

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
                      <td className="px-4 py-3 font-medium">{item.name}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 capitalize">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
