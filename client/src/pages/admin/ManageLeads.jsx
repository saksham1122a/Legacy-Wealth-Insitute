import { useEffect, useState } from 'react';
import { Trash2, Phone, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  converted: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-700'
};

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/leads' : `/leads?status=${filter}`;
      const { data } = await api.get(url);
      setLeads(data.leads);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (lead, status) => {
    try {
      await api.put(`/leads/${lead._id}`, { status });
      toast.success('Status updated');
      load();
    } catch {
      toast.error('Failed');
    }
  };

  const handleDelete = async (lead) => {
    if (!confirm(`Delete lead ${lead.name}?`)) return;
    try {
      await api.delete(`/leads/${lead._id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const statuses = ['all', 'new', 'contacted', 'qualified', 'converted', 'lost'];

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-navy-900 text-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs uppercase tracking-[0.3em] text-gold mb-1">Admin</div>
          <h1 className="font-display text-3xl">Leads & Inquiries</h1>
          <p className="text-cream/70 text-sm mt-1">From DM "LEGACY", website forms, and ad campaigns.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                filter === s ? 'bg-navy text-cream' : 'bg-white text-navy border border-navy-200 hover:border-navy'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-navy">Loading…</div>
        ) : leads.length === 0 ? (
          <div className="card p-12 text-center text-ink/60">
            No leads in this view yet. Submit the homepage form to test the funnel.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {leads.map(lead => (
              <div key={lead._id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display text-lg text-navy">{lead.name}</h3>
                    <div className="text-xs text-ink/60">
                      {lead.source} · interested in <span className="text-gold-dark font-medium">{lead.interest}</span>
                    </div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                </div>

                <div className="space-y-1.5 text-sm mb-4">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-ink/70 hover:text-gold-dark">
                    <Mail size={14}/> {lead.email}
                  </a>
                  <a href={`tel:+91${lead.phone}`} className="flex items-center gap-2 text-ink/70 hover:text-gold-dark">
                    <Phone size={14}/> +91 {lead.phone}
                  </a>
                  <div className="flex items-center gap-2 text-ink/50 text-xs">
                    <Calendar size={12}/> {new Date(lead.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>

                {lead.message && (
                  <div className="bg-cream rounded p-3 text-sm text-ink/70 mb-4 italic">"{lead.message}"</div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-navy-100">
                  <select
                    value={lead.status}
                    onChange={e => updateStatus(lead, e.target.value)}
                    className="text-sm px-2 py-1.5 rounded border border-navy-200 bg-white text-navy"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                  <button onClick={() => handleDelete(lead)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLeads;
