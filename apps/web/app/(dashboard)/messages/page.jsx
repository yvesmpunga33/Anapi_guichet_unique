"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIntl } from "react-intl";
import {
  Mail,
  MailOpen,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Star,
  Paperclip,
  Clock,
  AlertTriangle,
  Trash2,
  MailPlus,
  RefreshCw,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Send,
  Archive,
  Building2,
  Landmark,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, pt, ar, zhCN, de, ru, es } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";

const dateLocales = { fr, en: enUS, pt, ar, zh: zhCN, de, ru, es };

export default function MessagesInboxPage() {
  const intl = useIntl();
  const { locale } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "", // read, unread
    folder: "inbox", // inbox, sent
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        folder: filters.folder,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.status) params.append("status", filters.status);

      const response = await fetch(`/api/messages?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
        setStats({
          total: result.pagination.total,
          unread: result.unreadCount || 0,
        });
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map((m) => m.id));
    }
  };

  const handleMarkAsRead = async (messageIds) => {
    try {
      await Promise.all(
        messageIds.map((id) =>
          fetch(`/api/messages/${id}/read`, { method: "POST" })
        )
      );
      fetchMessages();
      setSelectedMessages([]);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleMarkAsUnread = async (messageIds) => {
    try {
      await Promise.all(
        messageIds.map((id) =>
          fetch(`/api/messages/${id}/read`, { method: "DELETE" })
        )
      );
      fetchMessages();
      setSelectedMessages([]);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (messageIds) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ces messages ?")) return;

    try {
      await Promise.all(
        messageIds.map((id) =>
          fetch(`/api/messages/${id}`, { method: "DELETE" })
        )
      );
      fetchMessages();
      setSelectedMessages([]);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "URGENT":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {intl.formatMessage({ id: "messages.priority.urgent", defaultMessage: "Urgent" })}
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
            {intl.formatMessage({ id: "messages.priority.high", defaultMessage: "Important" })}
          </span>
        );
      default:
        return null;
    }
  };

  const getMessagePreview = (message) => {
    // Pour inbox, on veut le message reçu (via recipients)
    // Pour sent, on veut le message envoyé directement
    if (filters.folder === "inbox") {
      return message.message || message;
    }
    return message;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/80 to-indigo-600/80 dark:from-blue-800/60 dark:to-indigo-700/60 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{intl.formatMessage({ id: "nav.messages", defaultMessage: "Messages" })}</h1>
              <p className="text-blue-100 mt-1">
                {stats.unread > 0
                  ? `${stats.unread} ${intl.formatMessage({ id: "messages.unread", defaultMessage: "non lus" })}`
                  : intl.formatMessage({ id: "messages.noMessages", defaultMessage: "Aucun message" })}
              </p>
            </div>
          </div>
          <Link
            href="/messages/compose"
            className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
          >
            <MailPlus className="w-5 h-5 mr-2" />
            {intl.formatMessage({ id: "messages.newMessage", defaultMessage: "Nouveau message" })}
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Folder Tabs */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, folder: "inbox" }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.folder === "inbox"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Inbox className="w-4 h-4 mr-2" />
              {intl.formatMessage({ id: "messages.inbox", defaultMessage: "Boîte de réception" })}
              {stats.unread > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                  {stats.unread}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, folder: "sent" }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.folder === "sent"
                  ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Send className="w-4 h-4 mr-2" />
              {intl.formatMessage({ id: "messages.sent", defaultMessage: "Messages envoyés" })}
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "messages.search", defaultMessage: "Rechercher des messages..." })}
              value={filters.search}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, search: e.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, priority: e.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="">{intl.formatMessage({ id: "messages.priority", defaultMessage: "Priorité" })}</option>
              <option value="URGENT">{intl.formatMessage({ id: "messages.priority.urgent", defaultMessage: "Urgent" })}</option>
              <option value="HIGH">{intl.formatMessage({ id: "messages.priority.high", defaultMessage: "Important" })}</option>
              <option value="NORMAL">{intl.formatMessage({ id: "messages.priority.normal", defaultMessage: "Normal" })}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, status: e.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
            >
              <option value="">{intl.formatMessage({ id: "common.status", defaultMessage: "Statut" })}</option>
              <option value="unread">{intl.formatMessage({ id: "messages.unread", defaultMessage: "Non lus" })}</option>
              <option value="read">{intl.formatMessage({ id: "common.all", defaultMessage: "Tous" })}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Refresh */}
          <button
            onClick={fetchMessages}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={intl.formatMessage({ id: "common.refresh", defaultMessage: "Actualiser" })}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMessages.length} {intl.formatMessage({ id: "messages.total", defaultMessage: "sélectionné(s)" })}
            </span>
            <button
              onClick={() => handleMarkAsRead(selectedMessages)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MailOpen className="w-4 h-4 mr-1" />
              {intl.formatMessage({ id: "messages.markUnread", defaultMessage: "Marquer comme lu" })}
            </button>
            <button
              onClick={() => handleMarkAsUnread(selectedMessages)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 mr-1" />
              {intl.formatMessage({ id: "messages.markUnread", defaultMessage: "Marquer comme non lu" })}
            </button>
            <button
              onClick={() => handleDelete(selectedMessages)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {intl.formatMessage({ id: "messages.delete", defaultMessage: "Supprimer" })}
            </button>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {intl.formatMessage({ id: "messages.noMessages", defaultMessage: "Aucun message" })}
            </p>
            <Link
              href="/messages/compose"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MailPlus className="w-4 h-4 mr-2" />
              {intl.formatMessage({ id: "messages.compose", defaultMessage: "Nouveau message" })}
            </Link>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSelectAll}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                {selectedMessages.length === messages.length ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {filters.folder === "inbox"
                  ? intl.formatMessage({ id: "messages.to", defaultMessage: "De" })
                  : intl.formatMessage({ id: "messages.to", defaultMessage: "À" })}
              </span>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                {intl.formatMessage({ id: "common.date", defaultMessage: "Date" })}
              </span>
            </div>

            {/* Message Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {messages.map((item) => {
                const msg = getMessagePreview(item);
                const isUnread =
                  filters.folder === "inbox" && item.readAt === null;
                const sender = msg.sender || {};
                const recipients = msg.recipients || [];

                return (
                  <div
                    key={item.id || msg.id}
                    className={`flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      isUnread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMessage(item.id || msg.id);
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      {selectedMessages.includes(item.id || msg.id) ? (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {/* Unread Indicator */}
                    <div className="w-2 mx-2">
                      {isUnread && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0 mr-3">
                      {filters.folder === "inbox" ? (
                        sender.image ? (
                          <Image
                            src={sender.image}
                            alt={sender.name || ""}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(sender.name || "?")[0].toUpperCase()}
                          </div>
                        )
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                          <Send className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <Link
                      href={`/messages/${msg.id}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-medium ${
                            isUnread
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {filters.folder === "inbox"
                            ? sender.name || sender.email || "Inconnu"
                            : recipients
                                .filter((r) => r.recipientType === "TO")
                                .map(
                                  (r) => r.recipient?.name || r.recipient?.email
                                )
                                .join(", ") || "Destinataires"}
                        </span>
                        {/* Ministry Badge - Style Gmail */}
                        {filters.folder === "inbox" && sender.ministry && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                            <Landmark className="w-3 h-3 mr-1" />
                            {sender.ministry.shortName || sender.ministry.code || sender.ministry.name}
                          </span>
                        )}
                        {getPriorityBadge(msg.priority)}
                        {msg.attachments?.length > 0 && (
                          <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`truncate ${
                            isUnread
                              ? "text-gray-800 dark:text-gray-200 font-medium"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {msg.subject}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                          -
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 truncate text-sm">
                          {msg.body?.replace(/<[^>]*>/g, "").substring(0, 60)}
                          ...
                        </span>
                      </div>
                    </Link>

                    {/* Date */}
                    <div className="flex items-center gap-2 ml-4 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                          locale: dateLocales[locale] || fr,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} sur {pagination.totalPages} (
                  {pagination.total} messages)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
