import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Eye } from "lucide-react";
import { Notification, priorityColors, statusColors, typeIcons } from "./types";

interface NotificationListProps {
  notifications: Notification[];
  onSend: (id: string) => void;
  onView: (notification: Notification) => void;
}

export function NotificationList({
  notifications,
  onSend,
  onView,
}: NotificationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => {
            const TypeIcon = typeIcons[notification.type];
            return (
              <div
                key={notification.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <TypeIcon className="h-5 w-5 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        <Badge className={statusColors[notification.status]}>
                          {notification.status}
                        </Badge>
                        <Badge className={priorityColors[notification.priority]}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Recipients: {notification.recipients.length}</span>
                        <span>Type: {notification.type}</span>
                        <span>
                          Category: {notification.category.replace("_", " ")}
                        </span>
                        {notification.sentAt && (
                          <span>
                            Sent:{" "}
                            {new Date(notification.sentAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {notification.deliveryStats && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>
                            Delivered: {notification.deliveryStats.delivered}/
                            {notification.deliveryStats.sent}
                          </span>
                          <span>
                            Opened: {notification.deliveryStats.opened}
                          </span>
                          <span>
                            Clicked: {notification.deliveryStats.clicked}
                          </span>
                          {notification.deliveryStats.failed > 0 && (
                            <span className="text-red-600">
                              Failed: {notification.deliveryStats.failed}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {notification.status === "draft" && (
                      <Button
                        size="sm"
                        onClick={() => onSend(notification.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(notification)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
