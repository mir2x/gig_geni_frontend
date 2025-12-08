import { Card, CardContent } from "@/components/ui/card";
import { Send, CheckCircle, Eye, Settings } from "lucide-react";
import { Notification } from "./types";

interface NotificationStatsProps {
  notifications: Notification[];
  templatesCount: number;
}

export function NotificationStats({
  notifications,
  templatesCount,
}: NotificationStatsProps) {
  const totalSent = notifications.reduce(
    (sum, n) => sum + (n.deliveryStats?.sent || 0),
    0
  );
  const totalDelivered = notifications.reduce(
    (sum, n) => sum + (n.deliveryStats?.delivered || 0),
    0
  );
  const totalOpened = notifications.reduce(
    (sum, n) => sum + (n.deliveryStats?.opened || 0),
    0
  );
  const deliveryRate =
    totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : "0";
  const openRate =
    totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">{totalSent}</p>
            </div>
            <Send className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
              <p className="text-2xl font-bold text-green-600">{deliveryRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Rate</p>
              <p className="text-2xl font-bold text-purple-600">{openRate}%</p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Templates</p>
              <p className="text-2xl font-bold text-orange-600">
                {templatesCount}
              </p>
            </div>
            <Settings className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
