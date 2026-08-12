import React from 'react'

const sample = [
  { id: 1, title: 'Broken projector', status: 'Open' },
  { id: 2, title: 'Cafeteria food quality', status: 'In Progress' }
]

export default function Complaints() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Complaints</h2>
      <p className="mt-2 text-sm text-gray-600">List of recent complaints.</p>

      <ul className="mt-4 space-y-3">
        {sample.map(c => (
          <li key={c.id} className="p-3 border rounded flex justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-gray-500">#{c.id}</div>
            </div>
            <div className="text-sm text-gray-700">{c.status}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
