import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Notification } from "./types";

interface CreateNotificationModalProps {
  onClose: () => void;
  onCreate: () => void;
  newNotification: Partial<Notification>;
  setNewNotification: (notification: Partial<Notification>) => void;
  participantsCount: number;
}

export function CreateNotificationModal({
  onClose,
  onCreate,
  newNotification,
  setNewNotification,
  participantsCount,
}: CreateNotificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Create Notification</h2>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                value={newNotification.type}
                onValueChange={(value: any) =>
                  setNewNotification({ ...newNotification, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="in_app">In-App</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select
                value={newNotification.category}
                onValueChange={(value: any) =>
                  setNewNotification({ ...newNotification, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_transition">
                    Round Transition
                  </SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="result">Result</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={newNotification.title || ""}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  title: e.target.value,
                })
              }
              placeholder="Notification title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea
              value={newNotification.message || ""}
              onChange={(e) =>
                setNewNotification({
                  ...newNotification,
                  message: e.target.value,
                })
              }
              placeholder="Notification message"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipients
              </label>
              <Select
                value={newNotification.recipientType}
                onValueChange={(value: any) =>
                  setNewNotification({
                    ...newNotification,
                    recipientType: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Participants ({participantsCount})
                  </SelectItem>
                  <SelectItem value="active">Active Participants</SelectItem>
                  <SelectItem value="round_specific">Round Specific</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select
                value={newNotification.priority}
                onValueChange={(value: any) =>
                  setNewNotification({ ...newNotification, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onCreate}>Create Notification</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
