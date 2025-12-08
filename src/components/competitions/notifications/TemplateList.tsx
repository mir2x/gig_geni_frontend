import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Copy } from "lucide-react";
import { NotificationTemplate } from "./types";

interface TemplateListProps {
  templates: NotificationTemplate[];
}

export function TemplateList({ templates }: TemplateListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    {template.isDefault && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Subject:</strong> {template.subject}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Content:</strong>{" "}
                    {template.content.substring(0, 100)}...
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="outline"
                        className="text-xs"
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    Use
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
