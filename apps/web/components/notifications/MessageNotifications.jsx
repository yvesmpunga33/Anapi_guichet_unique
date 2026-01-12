"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Mail,
  MailOpen,
  X,
  AlertTriangle,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageUnreadCount, MessageMarkAsRead } from "@/app/services/admin/Message.service";

export default function MessageNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    unreadCount: 0,
    urgentCount: 0,
    preview: [],
  });
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await MessageUnreadCount();
      const result = response.data;

      if (result.success) {
        setData({
          unreadCount: result.unreadCount || 0,
          urgentCount: result.urgentCount || 0,
          preview: result.preview || [],
        });

        // Si message urgent, afficher une alerte
        if (result.urgentCount > 0 && result.preview?.length > 0) {
          const urgentMessage = result.preview.find(
            (m) => m.priority === "URGENT"
          );
          if (urgentMessage) {
            // On pourrait déclencher une notification ici
          }
        }
      }
    } catch (error) {
      // Ignorer silencieusement les erreurs 404 (route non implementee)
      if (error.response?.status !== 404) {
        console.error("Erreur chargement notifications:", error);
      }
      // Garder les valeurs par defaut (0 messages)
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial et polling
  useEffect(() => {
    fetchUnreadCount();

    // Polling toutes les 30 secondes
    intervalRef.current = setInterval(fetchUnreadCount, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchUnreadCount]);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (messageId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await MessageMarkAsRead(messageId);
      fetchUnreadCount();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Messages"
      >
        <Bell className="w-6 h-6" />

        {/* Badge Count */}
        {data.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {data.unreadCount > 99 ? "99+" : data.unreadCount}
          </span>
        )}

        {/* Urgent Indicator */}
        {data.urgentCount > 0 && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-800" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">Messages</span>
              {data.unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {data.unreadCount} non lu{data.unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Urgent Alert */}
          {data.urgentCount > 0 && (
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {data.urgentCount} message{data.urgentCount > 1 ? "s" : ""}{" "}
                  urgent{data.urgentCount > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {/* Messages Preview */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : data.preview.length === 0 ? (
              <div className="py-8 text-center">
                <MailOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  Aucun message non lu
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {data.preview.map((message) => (
                  <Link
                    key={message.id}
                    href={`/messages/${message.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Avatar */}
                    {message.sender?.image ? (
                      <Image
                        src={message.sender.image}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {(
                          message.sender?.name ||
                          message.sender?.email ||
                          "?"
                        )[0].toUpperCase()}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {message.sender?.name || message.sender?.email}
                        </span>
                        {message.priority === "URGENT" && (
                          <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-xs">
                            <AlertTriangle className="w-3 h-3 mr-0.5" />
                            Urgent
                          </span>
                        )}
                        {message.priority === "HIGH" && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded text-xs">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {message.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                    </div>

                    {/* Mark as Read Button */}
                    <button
                      onClick={(e) => handleMarkAsRead(message.id, e)}
                      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                      title="Marquer comme lu"
                    >
                      <MailOpen className="w-4 h-4" />
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
            <Link
              href="/messages"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Voir tous les messages
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
