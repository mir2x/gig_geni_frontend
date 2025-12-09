import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { Participant } from "./types";

interface ParticipantSelectionProps {
  evaluatedParticipants: Participant[];
  selectedParticipant: Participant | null;
  setSelectedParticipant: (p: Participant) => void;
  setFinalComments: (comments: string) => void;
  setEvaluationScores: (scores: Record<string, number>) => void;
  evaluationCriteria: any[];
}

export function ParticipantSelection({
  evaluatedParticipants,
  selectedParticipant,
  setSelectedParticipant,
  setFinalComments,
  setEvaluationScores,
  evaluationCriteria,
}: ParticipantSelectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "winner":
        return "bg-green-100 text-green-800";
      case "evaluated":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Participant to Evaluate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {evaluatedParticipants.map((participant) => (
          <div
            key={participant.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedParticipant?.id === participant.id
                ? "border-orange-500 bg-orange-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => {
              setSelectedParticipant(participant);
              setFinalComments(participant.finalComments || "");
              // Load existing scores if available
              const scores: Record<string, number> = {};
              if (participant.finalScore) {
                evaluationCriteria.forEach((criteria) => {
                  scores[criteria.id] = participant.finalScore || 0;
                });
              }
              setEvaluationScores(scores);
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-gray-600">{participant.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>R1: {participant.round1Score}%</span>
                    <span>R2: {participant.round2Status}</span>
                    <span>R3: {participant.round3Rating}/5</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(participant.status)}>
                  {participant.status}
                </Badge>
                {participant.finalScore && (
                  <p className="text-sm font-medium mt-1">
                    Score: {participant.finalScore}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
