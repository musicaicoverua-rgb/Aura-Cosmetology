import { useState, useRef } from 'react';
import { Send, Phone, Search, Check, CheckCheck, MessageSquare } from 'lucide-react';
import type { Message } from '@/types';

interface Conversation {
  partnerId: string;
  partnerName: string;
  lastMessage: Message;
  unreadCount: number;
}

export const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demo
  const mockConversations: Conversation[] = [
    {
      partnerId: 'client1',
      partnerName: 'Olena Kovalenko',
      lastMessage: {
        id: '1',
        senderId: 'client1',
        receiverId: 'admin',
        text: 'Hello, I would like to book an appointment for next week.',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      unreadCount: 1,
    },
    {
      partnerId: 'client2',
      partnerName: 'Maria Petrenko',
      lastMessage: {
        id: '2',
        senderId: 'admin',
        receiverId: 'client2',
        text: 'Your appointment is confirmed for tomorrow at 2 PM.',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      unreadCount: 0,
    },
    {
      partnerId: 'client3',
      partnerName: 'Anna Shevchenko',
      lastMessage: {
        id: '3',
        senderId: 'client3',
        receiverId: 'admin',
        text: 'Thank you for the great service!',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      unreadCount: 0,
    },
  ];

  const [conversations] = useState<Conversation[]>(mockConversations);

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    // Mock messages for demo
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: conv.partnerId,
        receiverId: 'admin',
        text: 'Hello, I would like to book an appointment.',
        isRead: true,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        senderId: 'admin',
        receiverId: conv.partnerId,
        text: 'Hello! Of course, what service are you interested in?',
        isRead: true,
        createdAt: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: '3',
        senderId: conv.partnerId,
        receiverId: 'admin',
        text: 'I would like a facial treatment.',
        isRead: true,
        createdAt: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: '4',
        senderId: 'admin',
        receiverId: conv.partnerId,
        text: 'Great! We have availability next Tuesday at 10 AM or Thursday at 2 PM.',
        isRead: true,
        createdAt: new Date(Date.now() - 3300000).toISOString(),
      },
      {
        id: '5',
        senderId: conv.partnerId,
        receiverId: 'admin',
        text: 'Tuesday at 10 AM works for me.',
        isRead: false,
        createdAt: new Date(Date.now() - 3200000).toISOString(),
      },
    ];
    setMessages(mockMessages);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      receiverId: selectedConversation.partnerId,
      text: newMessage,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-display mb-6">Messages</h1>

      <div className="bg-white rounded-xl shadow-sm h-full flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.partnerId}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                  selectedConversation?.partnerId === conv.partnerId ? 'bg-[#D4A24F]/5' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4A24F]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D4A24F] font-medium">
                      {conv.partnerName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.partnerName}</p>
                      <span className="text-xs text-gray-400">
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage.text}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-[#D4A24F] text-white text-xs rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4A24F]/20 flex items-center justify-center">
                  <span className="text-[#D4A24F] font-medium">
                    {selectedConversation.partnerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{selectedConversation.partnerName}</p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Phone size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isAdmin = msg.senderId === 'admin';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        isAdmin
                          ? 'bg-[#D4A24F] text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs ${
                          isAdmin ? 'text-white/70' : 'text-gray-400'
                        }`}
                      >
                        <span>{formatTime(msg.createdAt)}</span>
                        {isAdmin && (
                          msg.isRead ? (
                            <CheckCheck size={14} className="text-blue-300" />
                          ) : (
                            <Check size={14} />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24F]"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-[#D4A24F] text-white rounded-lg hover:bg-[#c49345] transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};