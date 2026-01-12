"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const ShareNotificationContext = createContext(null);

export function ShareNotificationProvider({ children }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [urgentNotifications, setUrgentNotifications] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [currentSnackbar, setCurrentSnackbar] = useState(null);

  // Fetch notifications on mount and periodically
  const fetchNotifications = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      // Simulated data - Replace with actual API call
      // const response = await fetch(`${API_URL}/notifications`, {
      //   headers: { Authorization: `Bearer ${session.accessToken}` }
      // });
      // const data = await response.json();

      // Simulated notifications
      const mockNotifications = [
        {
          id: "1",
          type: "share",
          title: "Nouveau document partagé",
          message: "Marie Martin a partagé 'Plan Stratégique 2025.pptx' avec vous",
          documentId: "doc1",
          documentName: "Plan Stratégique 2025.pptx",
          fromUser: { firstName: "Marie", lastName: "Martin", image: null },
          permission: "view",
          isUrgent: true,
          isRead: false,
          createdAt: new Date(Date.now() - 300000), // 5 min ago
        },
        {
          id: "2",
          type: "share",
          title: "Document urgent",
          message: "Pierre Durand a partagé un document urgent avec vous",
          documentId: "doc2",
          documentName: "Contrat Urgent - À signer.pdf",
          fromUser: { firstName: "Pierre", lastName: "Durand", image: null },
          permission: "edit",
          isUrgent: true,
          isRead: false,
          createdAt: new Date(Date.now() - 600000), // 10 min ago
        },
        {
          id: "3",
          type: "share",
          title: "Nouveau document partagé",
          message: "Sophie Bernard a partagé 'Budget 2024.xlsx' avec vous",
          documentId: "doc3",
          documentName: "Budget 2024.xlsx",
          fromUser: { firstName: "Sophie", lastName: "Bernard", image: null },
          permission: "view",
          isUrgent: false,
          isRead: false,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          id: "4",
          type: "comment",
          title: "Nouveau commentaire",
          message: "Luc Petit a commenté sur 'Rapport Annuel.pdf'",
          documentId: "doc4",
          documentName: "Rapport Annuel.pdf",
          fromUser: { firstName: "Luc", lastName: "Petit", image: null },
          isUrgent: false,
          isRead: true,
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          id: "5",
          type: "share",
          title: "Accès modifié",
          message: "Votre accès au dossier 'Projets 2024' a été mis à jour",
          documentId: "folder1",
          documentName: "Projets 2024",
          fromUser: { firstName: "Admin", lastName: "System", image: null },
          permission: "full",
          isUrgent: false,
          isRead: true,
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);

      // Get urgent unread notifications
      const urgent = mockNotifications.filter((n) => n.isUrgent && !n.isRead);
      setUrgentNotifications(urgent);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [session?.accessToken]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Show snackbar for urgent notifications on initial load
  useEffect(() => {
    if (urgentNotifications.length > 0 && !currentSnackbar) {
      showNextUrgentNotification();
    }
  }, [urgentNotifications]);

  const showNextUrgentNotification = () => {
    const unshownUrgent = urgentNotifications.find(
      (n) => !n.snackbarShown
    );
    if (unshownUrgent) {
      setCurrentSnackbar(unshownUrgent);
      setShowSnackbar(true);
      // Mark as shown
      setUrgentNotifications((prev) =>
        prev.map((n) =>
          n.id === unshownUrgent.id ? { ...n, snackbarShown: true } : n
        )
      );
    }
  };

  const dismissSnackbar = () => {
    setShowSnackbar(false);
    setCurrentSnackbar(null);
    // Show next urgent notification after a delay
    setTimeout(() => {
      showNextUrgentNotification();
    }, 500);
  };

  const markAsRead = async (notificationId) => {
    // API call to mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    // API call to mark all as read
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      isRead: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    if (notification.isUrgent) {
      setUrgentNotifications((prev) => [newNotification, ...prev]);
      setCurrentSnackbar(newNotification);
      setShowSnackbar(true);
    }
  };

  return (
    <ShareNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        urgentNotifications,
        showSnackbar,
        currentSnackbar,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        dismissSnackbar,
      }}
    >
      {children}
    </ShareNotificationContext.Provider>
  );
}

export function useShareNotifications() {
  const context = useContext(ShareNotificationContext);
  if (!context) {
    throw new Error(
      "useShareNotifications must be used within a ShareNotificationProvider"
    );
  }
  return context;
}
