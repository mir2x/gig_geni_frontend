import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Trophy, BarChart3 } from "lucide-react";
import { Participant } from "./types";

interface EvaluationStatsProps {
  evaluatedParticipants: Participant[];
}

export function EvaluationStats({
  evaluatedParticipants,
}: EvaluationStatsProps) {
  const pendingCount = evaluatedParticipants.filter(
    (p) => p.status === "pending"
  ).length;
  const evaluatedCount = evaluatedParticipants.filter(
    (p) => p.status === "evaluated"
  ).length;
  const winnersCount = evaluatedParticipants.filter((p) => p.isWinner).length;
  const averageScore =
    evaluatedParticipants
      .filter((p) => p.finalScore !== undefined)
      .reduce((sum, p) => sum + (p.finalScore || 0), 0) /
      evaluatedParticipants.filter((p) => p.finalScore !== undefined).length ||
    0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Evaluated</p>
              <p className="text-2xl font-bold text-blue-600">
                {evaluatedCount}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Winners</p>
              <p className="text-2xl font-bold text-green-600">
                {winnersCount}
              </p>
            </div>
            <Trophy className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {averageScore.toFixed(1)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
