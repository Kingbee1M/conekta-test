'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
      
      {/* MAINTENANCE LOGS LIST */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-6"
      >
        <div>
          <h3 className="text-base font-bold text-gray-900">Registered Maintenance Logs</h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Monitor the live progress status of active building repair operations
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {tickets.map((t) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                whileHover={{ y: -2 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 gap-4 transition-shadow hover:shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
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
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : t.status === 'In Progress' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* REQUEST NEW TICKET FORM */}
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col gap-5"
      >
        <div>
          <h3 className="text-sm font-bold text-gray-900">Request New Service</h3>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Connect to verified structural artisans instantly
          </p>
        </div>

        <form onSubmit={onAddTicket} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Service Category
            </label>
            <CustomSelect
              options={["Plumbing", "Electrical", "Structural & Masonry"]}
              selected={newTicketService}
              onChange={(value) => setNewTicketService(value)}
              defaultValue="Select Service Type"
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Describe Issue
            </label>
            <textarea
              value={newTicketDesc}
              onChange={(e) => setNewTicketDesc(e.target.value)}
              placeholder="Specify leaks, AC checkouts or paint repair requests..."
              rows={3}
              className="border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-gray-800 font-semibold outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition resize-none"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit" 
            className="w-full py-4 bg-primary-green hover:bg-[#1d5d39] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Log Service Ticket
          </motion.button>
        </form>
      </motion.div>

    </div>
  );
}