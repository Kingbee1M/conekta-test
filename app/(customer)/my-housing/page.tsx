'use client';

import { useState } from 'react';
import { LuDroplet, LuZap } from "react-icons/lu";

import { Message, MaintenanceTicket, TenantData, } from '@/shared/service/customer services/customerTypes';
import { PaymentFrequencyEnum } from '@/shared/enums/paymentFreqency.enums';
import HeaderTabs from '@/app/components/HeaderTabs';
import OverviewTab from '@/app/components/OverviewTab';
import ChatTab from '@/app/components/ChatsTab';
import MaintenanceTab from '@/app/components/MaintainanceTab';

export default function MyHousingPage() {
  const [tenantData, setTenantData] = useState<TenantData>({
    address: "Luxury 3 Bedroom Apartment, Admiralty Way, Lekki Phase 1",
    roomNumber: "Apartment 3B",
    landlord: {
      name: "Alhaji Kunle Tinubu",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      status: "online",
      lastActive: "Active now"
    },
    billing: {
      rentAmount: 4500000,
      currency: "NGN",
      frequency: PaymentFrequencyEnum.YEARLY,
      dueDate: "August 31, 2026",
      daysRemaining: 44,
      totalTenancyDays: 365,
      elapsedTenancyDays: 321
    },
    neighbors: [
      { id: 'n1', name: "Chinedu Okafor", room: "Room 1 (Roommate)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80", isRoommate: true },
      { id: 'n2', name: "Amina Yusuf", room: "Room 2 (Roommate)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80", isRoommate: true },
      { id: 'n3', name: "Segun Arinze", room: "Apartment 3A (Neighbor)", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80", isRoommate: false }
    ]
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'maintenance'>('dashboard');
  const [chatChannel, setChatChannel] = useState<'landlord' | 'roommates'>('landlord');
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'landlord', senderName: 'Alhaji Kunle', text: 'Good morning! Just confirming the plumbing repairs in Apartment 3B were completed successfully?', timestamp: '09:12 AM' },
    { id: '2', sender: 'tenant', senderName: 'Me', text: 'Yes, Alhaji. The artisan from Conekta arrived on time and fixed the kitchen leak. Thank you!', timestamp: '09:25 AM' },
    { id: '3', sender: 'landlord', senderName: 'Alhaji Kunle', text: 'Excellent. Let me know if anything else needs attention.', timestamp: '09:30 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([
    { id: 't1', service: 'Plumbing Repair', description: 'Kitchen sink pipe crack', status: 'Completed', date: 'Jul 12, 2026', icon: <LuDroplet className="text-blue-500" /> },
    { id: 't2', service: 'Electrical Inspection', description: 'AC unit spark test in Master Bedroom', status: 'In Progress', date: 'Jul 17, 2026', icon: <LuZap className="text-amber-500" /> }
  ]);
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [newTicketService, setNewTicketService] = useState('Plumbing');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: crypto.randomUUID(),
      sender: 'tenant',
      senderName: 'Me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, msg]);
    setNewMessage('');

    if (chatChannel === 'landlord') {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), sender: 'landlord', senderName: tenantData.landlord.name, text: 'Understood. I will review this shortly and get back to you.', timestamp: 'Just now' }
        ]);
      }, 1500);
    }
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketDesc.trim()) return;

    const ticket: MaintenanceTicket = {
      id: crypto.randomUUID(),
      service: `${newTicketService} Repair`,
      description: newTicketDesc,
      status: 'Pending Assignment',
      date: 'Today',
      icon: newTicketService === 'Electrical' ? <LuZap className="text-amber-500" /> : <LuDroplet className="text-blue-500" />
    };

    setMaintenanceTickets([ticket, ...maintenanceTickets]);
    setNewTicketDesc('');
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-18">
      <div className="max-w-full mx-auto flex flex-col gap-6">
        
        {/* Pass down required fields dynamically */}
        <HeaderTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          address={tenantData.address} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {activeTab === 'dashboard' && (
            <OverviewTab 
              tenantData={tenantData}
              onNavigateToChat={(channel) => { setActiveTab('chat'); setChatChannel(channel); }}
              onNavigateToMaintenance={() => setActiveTab('maintenance')}
            />
          )}

          {activeTab === 'chat' && (
            <ChatTab 
              tenantData={tenantData}
              chatChannel={chatChannel}
              setChatChannel={setChatChannel}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceTab 
              tickets={maintenanceTickets}
              newTicketService={newTicketService}
              setNewTicketService={setNewTicketService}
              newTicketDesc={newTicketDesc}
              setNewTicketDesc={setNewTicketDesc}
              onAddTicket={handleAddTicket}
            />
          )}
        </div>
      </div>
    </main>
  );
}