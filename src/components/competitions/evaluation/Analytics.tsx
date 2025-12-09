import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Participant, EvaluationCriteria } from "./types";

interface AnalyticsProps {
  evaluatedParticipants: Participant[];
  evaluationCriteria: EvaluationCriteria[];
  averageScore: number;
  evaluatedCount: number;
  winnersCount: number;
  competitionStatus: string;
}

export function Analytics({
  evaluatedParticipants,
  evaluationCriteria,
  averageScore,
  evaluatedCount,
  winnersCount,
  competitionStatus,
}: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {evaluationCriteria.map((criteria) => {
              const avgScore =
                evaluatedParticipants
                  .filter((p) => p.finalScore !== undefined)
                  .reduce((sum, p) => sum + (p.finalScore || 0), 0) /
                  evaluatedParticipants.filter((p) => p.finalScore !== undefined)
                    .length || 0;

              return (
                <div key={criteria.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{criteria.name}</span>
                    <span>{avgScore.toFixed(1)}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${avgScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competition Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Participants:</span>
              <span className="font-medium">{evaluatedParticipants.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Evaluations:</span>
              <span className="font-medium">
                {evaluatedCount + winnersCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Final Score:</span>
              <span className="font-medium">{averageScore.toFixed(1)}/100</span>
            </div>
            <div className="flex justify-between">
              <span>Winners Selected:</span>
              <span className="font-medium">{winnersCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Competition Status:</span>
              <Badge
                className={
                  competitionStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {competitionStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
