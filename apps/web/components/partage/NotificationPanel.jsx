"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  X,
  FileText,
  Share2,
  MessageSquare,
  AlertTriangle,
  Check,
  CheckCheck,
  Clock,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useShareNotifications } from "../../contexts/ShareNotificationContext";

// Format relative time
const formatRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

// Notification item component
function NotificationItem({ notification, onMarkRead, onClose }) {
  const getIcon = () => {
    switch (notification.type) {
      case "share":
        return <Share2 className="w-5 h-5 text-blue-500" />;
      case "comment":
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
        !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            notification.isUrgent
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-gray-100 dark:bg-slate-700"
          }`}
        >
          {notification.isUrgent ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            getIcon()
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p
                className={`text-sm ${
                  !notification.isRead
                    ? "font-semibold text-gray-900 dark:text-white"
                    : "font-medium text-gray-700 dark:text-gray-300"
                }`}
              >
                {notification.title}
                {notification.isUrgent && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                    Urgent
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {notification.message}
              </p>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
            )}
          </div>

          {/* Document link */}
          {notification.documentId && (
            <Link
              href={`/partage/documents/${notification.documentId}`}
              onClick={onClose}
              className="inline-flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FileText className="w-4 h-4 mr-1" />
              {notification.documentName}
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatRelativeTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Marquer comme lu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Notification Panel
export function NotificationPanel({ isOpen, onClose }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useShareNotifications();

  const [filter, setFilter] = useState("all"); // all, unread, urgent

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "urgent") return n.isUrgent;
    return true;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-1 mt-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === "all"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === "unread"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Non lues
            </button>
            <button
              onClick={() => setFilter("urgent")}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filter === "urgent"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Urgentes
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
                onClose={onClose}
              />
            ))
          ) : (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                {filter === "all"
                  ? "Aucune notification"
                  : filter === "unread"
                  ? "Aucune notification non lue"
                  : "Aucune notification urgente"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Tout marquer comme lu
              </button>
            )}
            <Link
              href="/partage/notifications"
              onClick={onClose}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Voir tout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// Notification Bell Button
export function NotificationBell() {
  const { unreadCount, urgentNotifications } = useShareNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const hasUrgent = urgentNotifications.some((n) => !n.isRead);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-lg hover:bg-slate-700 text-white transition-colors relative ${
          hasUrgent ? "animate-pulse" : ""
        }`}
      >
        <Bell className={`w-5 h-5 ${hasUrgent ? "text-red-400" : ""}`} />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center text-xs font-bold rounded-full ${
              hasUrgent
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

// Urgent Document Snackbar
export function UrgentDocumentSnackbar() {
  const { showSnackbar, currentSnackbar, dismissSnackbar } = useShareNotifications();

  if (!showSnackbar || !currentSnackbar) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 max-w-md">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded">
                URGENT
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(currentSnackbar.createdAt)}
              </span>
            </div>

            <h4 className="font-semibold text-gray-900 dark:text-white mt-1">
              Nouveau document partagé
            </h4>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium">
                {currentSnackbar.fromUser?.firstName} {currentSnackbar.fromUser?.lastName}
              </span>{" "}
              vous a partagé un document urgent
            </p>

            <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentSnackbar.documentName}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 mt-3">
              <Link
                href={`/partage/documents/${currentSnackbar.documentId}`}
                onClick={dismissSnackbar}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Voir maintenant
              </Link>
              <button
                onClick={dismissSnackbar}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={dismissSnackbar}
            className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
