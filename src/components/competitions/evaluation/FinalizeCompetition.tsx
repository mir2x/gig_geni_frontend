import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy, Download } from "lucide-react";

interface FinalizeCompetitionProps {
  pendingCount: number;
  evaluatedCount: number;
  winnersCount: number;
  evaluatedParticipants: any[];
  bulkEvaluation: {
    passingScore: number;
    autoRank: boolean;
    sendNotifications: boolean;
  };
  setBulkEvaluation: (value: any) => void;
  competitionStatus: string;
  handleFinalizeCompetition: () => void;
}

export function FinalizeCompetition({
  pendingCount,
  evaluatedCount,
  winnersCount,
  evaluatedParticipants,
  bulkEvaluation,
  setBulkEvaluation,
  competitionStatus,
  handleFinalizeCompetition,
}: FinalizeCompetitionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalize Competition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">
            ⚠️ Important Notice
          </h3>
          <p className="text-sm text-yellow-700">
            Once you finalize the competition, rankings will be locked and
            participants will be notified of the results. This action cannot be
            undone.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Pre-Finalization Checklist</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle
                className={`h-5 w-5 ${
                  pendingCount === 0 ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span
                className={
                  pendingCount === 0 ? "text-green-700" : "text-gray-600"
                }
              >
                All participants evaluated ({evaluatedCount + winnersCount}/
                {evaluatedParticipants.length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle
                className={`h-5 w-5 ${
                  winnersCount > 0 ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span
                className={
                  winnersCount > 0 ? "text-green-700" : "text-gray-600"
                }
              >
                Winners selected ({winnersCount})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-700">Final rankings calculated</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Finalization Options</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Auto-rank by final scores
              </span>
              <input
                type="checkbox"
                checked={bulkEvaluation.autoRank}
                onChange={(e) =>
                  setBulkEvaluation((prev: any) => ({
                    ...prev,
                    autoRank: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-orange-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Send result notifications
              </span>
              <input
                type="checkbox"
                checked={bulkEvaluation.sendNotifications}
                onChange={(e) =>
                  setBulkEvaluation((prev: any) => ({
                    ...prev,
                    sendNotifications: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleFinalizeCompetition}
            className="flex-1 bg-green-500 hover:bg-green-600"
            disabled={pendingCount > 0 || competitionStatus === "completed"}
          >
            <Trophy className="h-4 w-4 mr-2" />
            {competitionStatus === "completed"
              ? "Competition Completed"
              : "Finalize Competition"}
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
