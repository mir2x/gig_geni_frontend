"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Participant,
  mockParticipants,
  evaluationCriteria,
} from "./evaluation/types";
import { EvaluationStats } from "./evaluation/EvaluationStats";
import { ParticipantSelection } from "./evaluation/ParticipantSelection";
import { EvaluationForm } from "./evaluation/EvaluationForm";
import { Rankings } from "./evaluation/Rankings";
import { Analytics } from "./evaluation/Analytics";
import { FinalizeCompetition } from "./evaluation/FinalizeCompetition";

interface FinalEvaluationProps {
  competitionId: string;
  participants: Participant[];
  onEvaluationComplete?: (results: any) => void;
}

export default function FinalEvaluation({
  competitionId,
  participants = mockParticipants,
  onEvaluationComplete,
}: FinalEvaluationProps) {
  const [evaluatedParticipants, setEvaluatedParticipants] =
    useState<Participant[]>(participants);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [evaluationScores, setEvaluationScores] = useState<
    Record<string, number>
  >({});
  const [finalComments, setFinalComments] = useState("");
  const [activeTab, setActiveTab] = useState("evaluate");
  const [competitionStatus, setCompetitionStatus] = useState<
    "ongoing" | "completed"
  >("ongoing");
  const [bulkEvaluation, setBulkEvaluation] = useState({
    passingScore: 70,
    autoRank: true,
    sendNotifications: true,
  });

  const handleScoreChange = (criteriaId: string, score: number) => {
    setEvaluationScores((prev) => ({
      ...prev,
      [criteriaId]: Math.max(0, Math.min(100, score)),
    }));
  };

  const calculateFinalScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    evaluationCriteria.forEach((criteria) => {
      const score = evaluationScores[criteria.id] || 0;
      totalScore += score * criteria.weight;
      totalWeight += criteria.weight;
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  };

  const handleSaveEvaluation = () => {
    if (!selectedParticipant) return;

    const finalScore = calculateFinalScore();
    const totalPoints = Object.values(evaluationScores).reduce(
      (sum, score) => sum + score,
      0
    );

    setEvaluatedParticipants((prev) =>
      prev.map((p) =>
        p.id === selectedParticipant.id
          ? {
              ...p,
              finalScore,
              totalPoints,
              finalComments,
              status: "evaluated" as const,
            }
          : p
      )
    );

    // Reset form
    setSelectedParticipant(null);
    setEvaluationScores({});
    setFinalComments("");
  };

  const handleSetWinner = (participantId: string, prizeCategory: string) => {
    setEvaluatedParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? {
              ...p,
              isWinner: true,
              prizeCategory,
              status: "winner" as const,
            }
          : p
      )
    );
  };

  const handleFinalizeCompetition = () => {
    // Auto-rank participants based on final scores
    const sortedParticipants = [...evaluatedParticipants]
      .filter((p) => p.finalScore !== undefined)
      .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));

    const rankedParticipants = evaluatedParticipants.map((p) => {
      const rank = sortedParticipants.findIndex((sp) => sp.id === p.id) + 1;
      return rank > 0 ? { ...p, finalRank: rank } : p;
    });

    setEvaluatedParticipants(rankedParticipants);
    setCompetitionStatus("completed");
    onEvaluationComplete?.(rankedParticipants);
  };

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
    <div className="space-y-6">
      <EvaluationStats evaluatedParticipants={evaluatedParticipants} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evaluate">Evaluate Participants</TabsTrigger>
          <TabsTrigger value="rankings">Rankings & Winners</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="finalize">Finalize Competition</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ParticipantSelection
              evaluatedParticipants={evaluatedParticipants}
              selectedParticipant={selectedParticipant}
              setSelectedParticipant={setSelectedParticipant}
              setFinalComments={setFinalComments}
              setEvaluationScores={setEvaluationScores}
              evaluationCriteria={evaluationCriteria}
            />

            <EvaluationForm
              selectedParticipant={selectedParticipant}
              evaluationCriteria={evaluationCriteria}
              evaluationScores={evaluationScores}
              handleScoreChange={handleScoreChange}
              calculateFinalScore={calculateFinalScore}
              finalComments={finalComments}
              setFinalComments={setFinalComments}
              handleSaveEvaluation={handleSaveEvaluation}
            />
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <Rankings
            evaluatedParticipants={evaluatedParticipants}
            handleSetWinner={handleSetWinner}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Analytics
            evaluatedParticipants={evaluatedParticipants}
            evaluationCriteria={evaluationCriteria}
            averageScore={averageScore}
            evaluatedCount={evaluatedCount}
            winnersCount={winnersCount}
            competitionStatus={competitionStatus}
          />
        </TabsContent>

        <TabsContent value="finalize" className="space-y-6">
          <FinalizeCompetition
            pendingCount={pendingCount}
            evaluatedCount={evaluatedCount}
            winnersCount={winnersCount}
            evaluatedParticipants={evaluatedParticipants}
            bulkEvaluation={bulkEvaluation}
            setBulkEvaluation={setBulkEvaluation}
            competitionStatus={competitionStatus}
            handleFinalizeCompetition={handleFinalizeCompetition}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
