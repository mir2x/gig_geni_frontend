import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Save } from "lucide-react";
import { Participant, EvaluationCriteria } from "./types";

interface EvaluationFormProps {
  selectedParticipant: Participant | null;
  evaluationCriteria: EvaluationCriteria[];
  evaluationScores: Record<string, number>;
  handleScoreChange: (criteriaId: string, score: number) => void;
  calculateFinalScore: () => number;
  finalComments: string;
  setFinalComments: (comments: string) => void;
  handleSaveEvaluation: () => void;
}

export function EvaluationForm({
  selectedParticipant,
  evaluationCriteria,
  evaluationScores,
  handleScoreChange,
  calculateFinalScore,
  finalComments,
  setFinalComments,
  handleSaveEvaluation,
}: EvaluationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedParticipant
            ? `Evaluate: ${selectedParticipant.name}`
            : "Select a Participant"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedParticipant ? (
          <div className="space-y-6">
            {/* Previous Round Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Previous Round Performance</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Round 1 Quiz</p>
                  <p className="font-medium">{selectedParticipant.round1Score}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Round 2 Video</p>
                  <p className="font-medium capitalize">
                    {selectedParticipant.round2Status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Round 3 Interview</p>
                  <p className="font-medium">
                    {selectedParticipant.round3Rating}/5 ⭐
                  </p>
                </div>
              </div>
              {selectedParticipant.round3Notes && (
                <div className="mt-3">
                  <p className="text-gray-600 text-sm">Interview Notes:</p>
                  <p className="text-sm">{selectedParticipant.round3Notes}</p>
                </div>
              )}
            </div>

            {/* Evaluation Criteria */}
            <div className="space-y-4">
              <h3 className="font-medium">Final Evaluation Criteria</h3>
              {evaluationCriteria.map((criteria) => (
                <div key={criteria.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{criteria.name}</p>
                      <p className="text-sm text-gray-600">
                        {criteria.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Weight: {(criteria.weight * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={evaluationScores[criteria.id] || ""}
                      onChange={(e) =>
                        handleScoreChange(criteria.id, parseInt(e.target.value) || 0)
                      }
                      placeholder="0-100"
                      className="w-20"
                    />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${evaluationScores[criteria.id] || 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">
                      {evaluationScores[criteria.id] || 0}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Score Preview */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Calculated Final Score:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {calculateFinalScore()}/100
                </span>
              </div>
            </div>

            {/* Final Comments */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Final Comments
              </label>
              <Textarea
                value={finalComments}
                onChange={(e) => setFinalComments(e.target.value)}
                placeholder="Overall assessment, strengths, areas for improvement..."
                rows={4}
              />
            </div>

            <Button
              onClick={handleSaveEvaluation}
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={Object.keys(evaluationScores).length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Evaluation
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Select a participant to begin evaluation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
