import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart3 } from "lucide-react";

interface QuestionStatsProps {
  stats: {
    totalQuestions: number;
    totalPoints: number;
  };
}

export function QuestionStats({ stats }: QuestionStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Questions
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalQuestions}
            </p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Points</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalPoints}
            </p>
          </div>
          <BarChart3 className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>
    </div>
  );
}
