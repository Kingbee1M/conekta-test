'use client';

import { MaintenanceTicket } from '@/shared/service/customer services/customerTypes';
import CustomSelect from './ui/CustomSelect';
interface MaintenanceTabProps {
  tickets: MaintenanceTicket[];
  newTicketService: string;
  setNewTicketService: (srv: string) => void;
  newTicketDesc: string;
  setNewTicketDesc: (desc: string) => void;
  onAddTicket: (e: React.FormEvent) => void;
}

export default function MaintenanceTab({
  tickets,
  newTicketService,
  setNewTicketService,
  newTicketDesc,
  setNewTicketDesc,
  onAddTicket
}: MaintenanceTabProps) {
  return (
    <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Registered Maintenance Logs</h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">Monitor the live progress status of active building repair operations</p>
        </div>

        <div className="flex flex-col gap-4">
          {tickets.map((t) => (
            <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  {t.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{t.service}</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{t.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <span className="text-[10px] text-gray-400 font-semibold">{t.date}</span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  t.status === 'Completed' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : t.status === 'In Progress' 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-5">
        <div>
          <h3 className="text-sm font-bold text-gray-900">Request New Service</h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">Connect to verified structural artisans instantly</p>
        </div>

        <form onSubmit={onAddTicket} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Service Category</label>
            <CustomSelect
              options={["Plumbing Services", "Electrical Works", "Structural & Masonry"]}
              selected={newTicketService}
              onChange={(value) => setNewTicketService(value)}
              defaultValue="Select Service Type"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Describe Issue</label>
            <textarea
              value={newTicketDesc}
              onChange={(e) => setNewTicketDesc(e.target.value)}
              placeholder="Specify leaks, AC checkouts or paint repair requests..."
              rows={3}
              className="border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-gray-800 font-semibold outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green"
            />
          </div>

          <button type="submit" className="w-full py-4 bg-primary-green hover:bg-[#1d5d39] text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95">
            Log Service Ticket
          </button>
        </form>
      </div>
    </div>
  );
}