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
  Globe,
  Download,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS, pt, ar, zhCN, de, ru, es } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MessageList,
  ExternalEmailInboxList,
  ExternalEmailList,
  ExternalEmailSync,
  MessageMarkAsRead,
  MessageMarkAsUnread,
  MessageDelete,
} from "@/app/services/admin/Message.service";

const dateLocales = { fr, en: enUS, pt, ar, zh: zhCN, de, ru, es };

export default function MessagesInboxPage() {
  const intl = useIntl();
  const { locale } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [selectedMessages, setSelectedMessages] = useState([]);

  // Category: 'internal' ou 'external'
  const [category, setCategory] = useState("internal");

  // Folder: 'inbox' ou 'sent'
  const [folder, setFolder] = useState("inbox");

  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
  });

  const [externalMessages, setExternalMessages] = useState([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [syncingEmails, setSyncingEmails] = useState(false);

  const [externalPagination, setExternalPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Fetch internal messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        folder: folder,
      };

      if (filters.search) params.search = filters.search;
      if (filters.priority) params.priority = filters.priority;
      if (filters.status) params.status = filters.status;

      const response = await MessageList(params);
      const result = response.data;

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
  }, [pagination.page, pagination.limit, folder, filters]);

  // Fetch external emails (received or sent)
  const fetchExternalMessages = useCallback(async () => {
    try {
      setExternalLoading(true);
      const params = {
        page: externalPagination.page.toString(),
        limit: externalPagination.limit.toString(),
      };

      if (filters.search) params.search = filters.search;

      // Different service based on folder
      const response = folder === 'inbox'
        ? await ExternalEmailInboxList(params)
        : await ExternalEmailList(params);
      const result = response.data;

      if (result.success) {
        setExternalMessages(result.data);
        setExternalPagination((prev) => ({
          ...prev,
          total: result.pagination.total,
          totalPages: result.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Erreur chargement emails externes:", error);
    } finally {
      setExternalLoading(false);
    }
  }, [externalPagination.page, externalPagination.limit, folder, filters.search]);

  // Sync external emails from IMAP
  const syncExternalEmails = async () => {
    try {
      setSyncingEmails(true);
      const response = await ExternalEmailSync();
      const result = response.data;

      if (result.success) {
        alert(`${result.message}`);
        fetchExternalMessages();
      } else {
        alert(`Erreur: ${result.error || 'Synchronisation echouee'}`);
      }
    } catch (error) {
      console.error("Erreur sync:", error);
      alert("Erreur lors de la synchronisation des emails");
    } finally {
      setSyncingEmails(false);
    }
  };

  useEffect(() => {
    if (category === 'external') {
      fetchExternalMessages();
    } else {
      fetchMessages();
    }
  }, [fetchMessages, fetchExternalMessages, category, folder]);

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
        messageIds.map((id) => MessageMarkAsRead(id))
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
        messageIds.map((id) => MessageMarkAsUnread(id))
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
        messageIds.map((id) => MessageDelete(id))
      );
      if (category === 'external') {
        fetchExternalMessages();
      } else {
        fetchMessages();
      }
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
    if (folder === "inbox") {
      return message.message || message;
    }
    return message;
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setFolder("inbox");
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExternalPagination((prev) => ({ ...prev, page: 1 }));
    setSelectedMessages([]);
  };

  const handleFolderChange = (newFolder) => {
    setFolder(newFolder);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setExternalPagination((prev) => ({ ...prev, page: 1 }));
    setSelectedMessages([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${category === 'external' ? 'from-emerald-600/80 to-teal-600/80 dark:from-emerald-800/60 dark:to-teal-700/60' : 'from-blue-600/80 to-indigo-600/80 dark:from-blue-800/60 dark:to-indigo-700/60'} rounded-2xl p-8 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              {category === 'external' ? <Globe className="w-8 h-8" /> : <Mail className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {category === 'external' ? 'Emails externes' : intl.formatMessage({ id: "nav.messages", defaultMessage: "Messages internes" })}
              </h1>
              <p className={`${category === 'external' ? 'text-emerald-100' : 'text-blue-100'} mt-1`}>
                {category === 'internal' && stats.unread > 0
                  ? `${stats.unread} ${intl.formatMessage({ id: "messages.unread", defaultMessage: "non lus" })}`
                  : category === 'external'
                    ? `${externalPagination.total} emails`
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

      {/* Category Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleCategoryChange('internal')}
          className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            category === 'internal'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Messages internes
        </button>
        <button
          onClick={() => handleCategoryChange('external')}
          className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            category === 'external'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          <Globe className="w-4 h-4 mr-2" />
          Emails externes
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Folder Tabs (Inbox/Sent) */}
          <div className={`flex items-center rounded-lg p-1 ${category === 'external' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <button
              onClick={() => handleFolderChange('inbox')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                folder === "inbox"
                  ? category === 'external'
                    ? "bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Inbox className="w-4 h-4 mr-2" />
              {category === 'external' ? 'Emails reçus' : 'Boîte de réception'}
              {category === 'internal' && stats.unread > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                  {stats.unread}
                </span>
              )}
            </button>
            <button
              onClick={() => handleFolderChange('sent')}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                folder === "sent"
                  ? category === 'external'
                    ? "bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Send className="w-4 h-4 mr-2" />
              {category === 'external' ? 'Emails envoyés' : 'Messages envoyés'}
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={intl.formatMessage({ id: "messages.search", defaultMessage: "Rechercher..." })}
              value={filters.search}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, search: e.target.value }));
                setPagination((prev) => ({ ...prev, page: 1 }));
                setExternalPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Priority Filter (internal only) */}
          {category === 'internal' && (
            <div className="relative">
              <select
                value={filters.priority}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, priority: e.target.value }));
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
              >
                <option value="">Priorité</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">Important</option>
                <option value="NORMAL">Normal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Refresh / Sync */}
          {category === 'external' && folder === 'inbox' ? (
            <button
              onClick={syncExternalEmails}
              disabled={syncingEmails}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Synchroniser les emails"
            >
              <Download className={`w-4 h-4 mr-1 ${syncingEmails ? "animate-bounce" : ""}`} />
              {syncingEmails ? "Synchronisation..." : "Synchroniser"}
            </button>
          ) : (
            <button
              onClick={category === 'external' ? fetchExternalMessages : fetchMessages}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={`w-5 h-5 ${loading || externalLoading ? "animate-spin" : ""}`} />
            </button>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && category === 'internal' && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMessages.length} sélectionné(s)
            </span>
            <button
              onClick={() => handleMarkAsRead(selectedMessages)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <MailOpen className="w-4 h-4 mr-1" />
              Marquer lu
            </button>
            <button
              onClick={() => handleMarkAsUnread(selectedMessages)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4 mr-1" />
              Marquer non lu
            </button>
            <button
              onClick={() => handleDelete(selectedMessages)}
              className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* External Emails View */}
        {category === 'external' ? (
          externalLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : externalMessages.length === 0 ? (
            <div className="text-center py-20">
              <Globe className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {folder === 'inbox' ? 'Aucun email reçu' : 'Aucun email envoyé'}
              </p>
              {folder === 'inbox' && (
                <>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Cliquez sur "Synchroniser" pour récupérer vos emails
                  </p>
                  <button
                    onClick={syncExternalEmails}
                    disabled={syncingEmails}
                    className="inline-flex items-center mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Download className={`w-4 h-4 mr-2 ${syncingEmails ? "animate-bounce" : ""}`} />
                    {syncingEmails ? "Synchronisation..." : "Synchroniser les emails"}
                  </button>
                </>
              )}
              {folder === 'sent' && (
                <Link
                  href="/messages/compose"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <MailPlus className="w-4 h-4 mr-2" />
                  Envoyer un email externe
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* External Email Header */}
              <div className="flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {folder === 'inbox' ? 'De' : 'À'}
                </span>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  Date
                </span>
              </div>

              {/* External Email Rows */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {externalMessages.map((email) => (
                  <Link
                    key={email.id}
                    href={`/messages/${email.id}`}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${folder === 'inbox' ? 'from-emerald-500 to-teal-500' : 'from-blue-500 to-indigo-500'} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {folder === 'inbox'
                          ? (email.externalFrom || "?")[0].toUpperCase()
                          : <Send className="w-5 h-5" />
                        }
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {folder === 'inbox'
                            ? email.externalFrom
                            : (email.externalTo ? (Array.isArray(email.externalTo) ? email.externalTo.join(', ') : JSON.parse(email.externalTo).join(', ')) : 'Destinataires')
                          }
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${folder === 'inbox' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'}`}>
                          <Globe className="w-3 h-3 mr-1" />
                          {folder === 'inbox' ? 'Reçu' : 'Envoyé'}
                        </span>
                        {email.sendStatus === 'FAILED' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Échec
                          </span>
                        )}
                        {email.attachments?.length > 0 && (
                          <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
                          {email.subject}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">-</span>
                        <span className="text-gray-500 dark:text-gray-400 truncate text-sm">
                          {email.body?.replace(/<[^>]*>/g, "").substring(0, 60)}...
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 ml-4 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(email.sentAt || email.createdAt), {
                          addSuffix: true,
                          locale: dateLocales[locale] || fr,
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* External Pagination */}
              {externalPagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {externalPagination.page} sur {externalPagination.totalPages} ({externalPagination.total} emails)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExternalPagination((prev) => ({
                          ...prev,
                          page: prev.page - 1,
                        }))
                      }
                      disabled={externalPagination.page === 1}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setExternalPagination((prev) => ({
                          ...prev,
                          page: prev.page + 1,
                        }))
                      }
                      disabled={externalPagination.page === externalPagination.totalPages}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {folder === 'inbox' ? 'Aucun message reçu' : 'Aucun message envoyé'}
            </p>
            <Link
              href="/messages/compose"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MailPlus className="w-4 h-4 mr-2" />
              Nouveau message
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
                {folder === "inbox" ? "De" : "À"}
              </span>
              <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                Date
              </span>
            </div>

            {/* Message Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {messages.map((item) => {
                const msg = getMessagePreview(item);
                const isUnread = folder === "inbox" && item.readAt === null;
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
                      {folder === "inbox" ? (
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
                          {folder === "inbox"
                            ? sender.name || sender.email || "Inconnu"
                            : recipients
                                .filter((r) => r.recipientType === "TO")
                                .map(
                                  (r) => r.recipient?.name || r.recipient?.email
                                )
                                .join(", ") || "Destinataires"}
                        </span>
                        {folder === "inbox" && sender.ministry && (
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
