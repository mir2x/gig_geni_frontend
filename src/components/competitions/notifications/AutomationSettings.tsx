import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export function AutomationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Round Transition Notifications</h3>
                <p className="text-sm text-gray-600">
                  Automatically notify participants when they advance to the next
                  round
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium">Delay after advancement:</label>
                <p className="text-gray-600">5 minutes</p>
              </div>
              <div>
                <label className="font-medium">Template:</label>
                <p className="text-gray-600">Round Transition</p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Deadline Reminders</h3>
                <p className="text-sm text-gray-600">
                  Send reminders before round deadlines
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium">Reminder schedule:</label>
                <p className="text-gray-600">3 days, 1 day, 2 hours before</p>
              </div>
              <div>
                <label className="font-medium">Template:</label>
                <p className="text-gray-600">Quiz Reminder</p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Interview Confirmations</h3>
                <p className="text-sm text-gray-600">
                  Automatically send interview details when scheduled
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium">Send immediately:</label>
                <p className="text-gray-600">Yes</p>
              </div>
              <div>
                <label className="font-medium">Template:</label>
                <p className="text-gray-600">Interview Scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
