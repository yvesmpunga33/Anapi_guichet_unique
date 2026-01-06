"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
  User,
  Building,
  ChevronRight,
  Plus,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { usePageTitle } from "../../../contexts/PageTitleContext";

export default function InvestorMessagesPage() {
  const { data: session } = useSession();
  const { setPageTitle } = usePageTitle();
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setPageTitle("Messages");
  }, [setPageTitle]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations([
        {
          id: "conv-001",
          contact: {
            name: "Service Agrements",
            role: "ANAPI",
            avatar: "SA",
            isOnline: true,
          },
          lastMessage: "Votre dossier est en cours d'evaluation...",
          lastMessageTime: "Il y a 2h",
          unreadCount: 2,
          messages: [
            {
              id: "msg-001",
              sender: "agent",
              content: "Bonjour, nous avons bien recu votre demande d'agrement pour le projet 'Centrale solaire Katanga'.",
              time: "10:30",
              date: "Aujourd'hui",
            },
            {
              id: "msg-002",
              sender: "user",
              content: "Merci pour la confirmation. Pouvez-vous me donner une estimation du delai de traitement?",
              time: "10:45",
              date: "Aujourd'hui",
            },
            {
              id: "msg-003",
              sender: "agent",
              content: "Votre dossier est en cours d'evaluation technique. Le delai estime est de 15 a 20 jours ouvrables.",
              time: "11:00",
              date: "Aujourd'hui",
            },
            {
              id: "msg-004",
              sender: "agent",
              content: "Nous vous contacterons si des documents supplementaires sont necessaires.",
              time: "11:01",
              date: "Aujourd'hui",
            },
          ],
        },
        {
          id: "conv-002",
          contact: {
            name: "Conseiller Investissement",
            role: "ANAPI",
            avatar: "CI",
            isOnline: false,
          },
          lastMessage: "Je reste a votre disposition pour toute question.",
          lastMessageTime: "Hier",
          unreadCount: 0,
          messages: [
            {
              id: "msg-005",
              sender: "user",
              content: "Bonjour, je souhaite avoir des informations sur les opportunites dans le secteur agricole.",
              time: "14:30",
              date: "Hier",
            },
            {
              id: "msg-006",
              sender: "agent",
              content: "Bonjour! Le secteur agricole offre de nombreuses opportunites. Nous avons actuellement plusieurs projets de parcs agro-industriels.",
              time: "15:00",
              date: "Hier",
            },
            {
              id: "msg-007",
              sender: "agent",
              content: "Je reste a votre disposition pour toute question.",
              time: "15:01",
              date: "Hier",
            },
          ],
        },
        {
          id: "conv-003",
          contact: {
            name: "Support Technique",
            role: "ANAPI",
            avatar: "ST",
            isOnline: true,
          },
          lastMessage: "Le probleme a ete resolu. Merci de verifier.",
          lastMessageTime: "Il y a 3 jours",
          unreadCount: 0,
          messages: [
            {
              id: "msg-008",
              sender: "user",
              content: "J'ai un probleme pour telecharger mes documents sur la plateforme.",
              time: "09:00",
              date: "Il y a 3 jours",
            },
            {
              id: "msg-009",
              sender: "agent",
              content: "Nous allons regarder cela immediatement. Quel type de fichier essayez-vous de telecharger?",
              time: "09:15",
              date: "Il y a 3 jours",
            },
            {
              id: "msg-010",
              sender: "user",
              content: "Un fichier PDF de 5 Mo.",
              time: "09:20",
              date: "Il y a 3 jours",
            },
            {
              id: "msg-011",
              sender: "agent",
              content: "Le probleme a ete resolu. Merci de verifier.",
              time: "10:00",
              date: "Il y a 3 jours",
            },
          ],
        },
      ]);

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              sender: "user",
              content: newMessage,
              time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
              date: "Aujourd'hui",
            },
          ],
          lastMessage: newMessage,
          lastMessageTime: "A l'instant",
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find((c) => c.id === selectedConversation.id));
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A853] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex h-full">
        {/* Conversations List */}
        <div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-700 flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
              <button className="p-2 bg-[#D4A853] text-[#0A1628] rounded-lg hover:bg-[#E5B964] transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left ${
                  selectedConversation?.id === conversation.id ? "bg-gray-50 dark:bg-gray-700/50" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-full flex items-center justify-center text-[#D4A853] font-semibold">
                    {conversation.contact.avatar}
                  </div>
                  {conversation.contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{conversation.contact.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.lastMessageTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-[#D4A853] text-[#0A1628] text-xs font-bold rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <button
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0A1628] to-[#1E3A5F] rounded-full flex items-center justify-center text-[#D4A853] font-semibold text-sm">
                  {selectedConversation.contact.avatar}
                </div>
                {selectedConversation.contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{selectedConversation.contact.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedConversation.contact.isOnline ? "En ligne" : "Hors ligne"}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message, index) => {
                const showDate = index === 0 || message.date !== selectedConversation.messages[index - 1].date;
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                          {message.date}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-[#0A1628] text-white rounded-br-sm"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#D4A853] transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Ecrire un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4A853]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-[#D4A853] text-[#0A1628] rounded-lg hover:bg-[#E5B964] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900/50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Vos messages</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Selectionnez une conversation pour afficher les messages ou commencez une nouvelle discussion.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
