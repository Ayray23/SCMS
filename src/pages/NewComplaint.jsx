import React, { useState } from 'react'

export default function NewComplaint() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  function submit(e) {
    e.preventDefault()
    alert(`Created complaint: ${title}`)
    setTitle('')
    setDesc('')
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">New Complaint</h2>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <div>
          <label className="block text-sm">Title</label>
          <input className="mt-1 w-full border rounded p-2" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea className="mt-1 w-full border rounded p-2" rows={4} value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        </div>
      </form>
    </div>
  )
}
