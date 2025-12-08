"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Notification,
  NotificationTemplate,
  mockNotifications,
  mockTemplates,
} from "./notifications/types";
import { NotificationStats } from "./notifications/NotificationStats";
import { NotificationFilters } from "./notifications/NotificationFilters";
import { NotificationList } from "./notifications/NotificationList";
import { TemplateList } from "./notifications/TemplateList";
import { AutomationSettings } from "./notifications/AutomationSettings";
import { CreateNotificationModal } from "./notifications/CreateNotificationModal";

interface NotificationSystemProps {
  competitionId: string;
  participants: any[];
  onSendNotification?: (notification: Notification) => void;
}

export default function NotificationSystem({
  competitionId,
  participants,
  onSendNotification,
}: NotificationSystemProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [templates, setTemplates] =
    useState<NotificationTemplate[]>(mockTemplates);
  const [activeTab, setActiveTab] = useState("notifications");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    type: "email",
    category: "announcement",
    recipientType: "all",
    priority: "medium",
    status: "draft",
  });

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || notification.status === statusFilter;
    const matchesType =
      typeFilter === "all" || notification.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || notification.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) return;

    const notification: Notification = {
      id: `n${Date.now()}`,
      type: newNotification.type || "email",
      category: newNotification.category || "announcement",
      title: newNotification.title,
      message: newNotification.message,
      recipients: newNotification.recipients || [],
      recipientType: newNotification.recipientType || "all",
      targetRound: newNotification.targetRound,
      status: "draft",
      createdAt: new Date().toISOString(),
      createdBy: "admin@company.com",
      priority: newNotification.priority || "medium",
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({
      type: "email",
      category: "announcement",
      recipientType: "all",
      priority: "medium",
      status: "draft",
    });
    setIsCreating(false);

    if (onSendNotification) {
      onSendNotification(notification);
    }
  };

  const handleSendNotification = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId
          ? { ...n, status: "sent" as const, sentAt: new Date().toISOString() }
          : n
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <NotificationStats
        notifications={notifications}
        templatesCount={templates.length}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onCreate={() => setIsCreating(true)}
          />

          <NotificationList
            notifications={filteredNotifications}
            onSend={handleSendNotification}
            onView={setSelectedNotification}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <TemplateList templates={templates} />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <AutomationSettings />
        </TabsContent>
      </Tabs>

      {/* Create Notification Modal */}
      {isCreating && (
        <CreateNotificationModal
          onClose={() => setIsCreating(false)}
          onCreate={handleCreateNotification}
          newNotification={newNotification}
          setNewNotification={setNewNotification}
          participantsCount={participants.length}
        />
      )}
    </div>
  );
}
