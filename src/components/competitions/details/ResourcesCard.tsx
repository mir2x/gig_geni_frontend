import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, File } from "lucide-react";
import { Competition } from "@/lib/features/competition/types";

interface ResourcesCardProps {
  competition: Competition;
}

export function ResourcesCard({ competition }: ResourcesCardProps) {
  if (
    !competition.additionalFiles ||
    competition.additionalFiles.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Resources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {competition.additionalFiles.map((file, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors mb-3 last:mb-0"
          >
            <div className="flex items-start space-x-3">
              <File className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <a
                  href={file.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {file.description || "Download Resource"}
                </a>
                <p className="text-sm text-gray-600 mt-1">
                  {file.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
