
import AdminLayout from '../../components/AdminLayout';
import { useState } from 'react';
import Router from 'next/router';

export default function AddEvent(){
  const [title,setTitle]=useState('');
  const [date,setDate]=useState('');
  const [desc,setDesc]=useState('');
  const [location,setLocation]=useState('');

  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/schedule/create', {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify({ title, event_date: date, description: desc, location })
    });
    const data = await res.json();
    if (data.ok) Router.push('/schedule');
    else alert(data.error || 'Error');
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Add Event</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow max-w-md">
        <label className="block mb-2">Title<input className="w-full p-2 border" value={title} onChange={e=>setTitle(e.target.value)} /></label>
        <label className="block mb-2">Date<input type="date" className="w-full p-2 border" value={date} onChange={e=>setDate(e.target.value)} /></label>
        <label className="block mb-2">Location<input className="w-full p-2 border" value={location} onChange={e=>setLocation(e.target.value)} /></label>
        <label className="block mb-2">Description<textarea className="w-full p-2 border" value={desc} onChange={e=>setDesc(e.target.value)} /></label>
        <button className="px-4 py-2 bg-saffron text-white rounded">Add</button>
      </form>
    </AdminLayout>
  )
}
