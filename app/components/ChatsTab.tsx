'use client';

import Image from 'next/image';
import { LuSend } from "react-icons/lu";
import { Message, TenantData } from '@/shared/service/customer services/customerTypes';

interface ChatTabProps {
  tenantData: TenantData;
  chatChannel: 'landlord' | 'roommates';
  setChatChannel: (channel: 'landlord' | 'roommates') => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export default function ChatTab({
  tenantData,
  chatChannel,
  setChatChannel,
  messages,
  newMessage,
  setNewMessage,
  onSendMessage
}: ChatTabProps) {
  // Safe default background avatar logic based on current chat channel context
  const getAvatarForMessage = (msg: Message) => {
    if (msg.sender === 'landlord') return tenantData.landlord.avatar;
    const matchingNeighbor = tenantData.neighbors.find(n => n.name === msg.senderName);
    return matchingNeighbor?.avatar || tenantData.neighbors[0]?.avatar || '';
  };

  return (
    <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] bg-white border border-gray-100 rounded-3xl overflow-hidden min-h-145 shadow-sm">
      {/* Channels Sidebar */}
      <div className="border-r border-gray-100 p-5 flex flex-col gap-4 bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Boards</h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setChatChannel('landlord')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left cursor-pointer border ${
              chatChannel === 'landlord' 
                ? 'bg-white border-gray-200 shadow-sm text-gray-800 font-bold' 
                : 'border-transparent text-gray-500 hover:bg-gray-100'
            }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
              <Image fill src={tenantData.landlord.avatar} alt="Landlord avatar" className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{tenantData.landlord.name}</p>
              <p className="text-[10px] text-primary-green font-semibold mt-0.5">Verified Landlord</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setChatChannel('roommates')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl transition text-left cursor-pointer border ${
              chatChannel === 'roommates' 
                ? 'bg-white border-gray-200 shadow-sm text-gray-800 font-bold' 
                : 'border-transparent text-gray-500 hover:bg-gray-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs shrink-0">Co</div>
            <div>
              <p className="text-xs font-bold leading-tight">Neighbour Group Chat</p>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {tenantData.neighbors.length} Active members
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Chat Windows Container */}
      <div className="flex flex-col h-full justify-between min-h-145">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/20">
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              {chatChannel === 'landlord' ? `Direct chat with ${tenantData.landlord.name}` : "Neighbour Bulletin Board"}
            </h4>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">
              {chatChannel === 'landlord' ? "Active support connection thread" : "Bulletin channel for shared flat operations"}
            </p>
          </div>
        </div>

        {/* Dialog Thread */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto max-h-100">
          {messages.map((msg) => {
            const isSelf = msg.sender === 'tenant';
            const avatarUrl = getAvatarForMessage(msg);
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isSelf ? 'self-end flex-row-reverse' : 'self-start'}`}>
                {!isSelf && avatarUrl && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 border">
                    <Image fill src={avatarUrl} alt="Sender avatar" className="object-cover" />
                  </div>
                )}
                <div>
                  <p className={`text-[10px] font-bold text-gray-400 mb-1 ${isSelf ? 'text-right' : ''}`}>{msg.senderName}</p>
                  <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${isSelf ? 'bg-primary-green text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                  <p className={`text-[9px] text-gray-400 mt-1 ${isSelf ? 'text-right' : ''}`}>{msg.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Messaging Footer Input Box */}
        <form onSubmit={onSendMessage} className="p-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={chatChannel === 'landlord' ? "Message landlord..." : "Text roommates..."}
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3.5 text-xs font-medium bg-white outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition"
          />
          <button type="submit" className="h-11 w-11 bg-primary-green hover:bg-[#1d5d39] text-white rounded-xl flex items-center justify-center transition active:scale-95 shrink-0">
            <LuSend className="text-base" />
          </button>
        </form>
      </div>
    </div>
  );
}