import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Eye,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2, // Added for loading state
} from "lucide-react";

import { RoundStatusBadge } from "./RoundStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Participant, RoundStatus } from "@/lib/features/participant/types";
import { useUpdateParticipantMutation } from "@/lib/api/participantApi";

interface ParticipantCardProps {
  participant: Participant;
  onViewDetails: () => void;
}

const roundNames = {
  1: "Screening Quiz",
  2: "Video Pitch",
  3: "Live Interview",
  4: "Final Task",
};

export const ParticipantCard = ({
  participant,
  onViewDetails,
}: ParticipantCardProps) => {
  const { user } = participant;
  const steps = [
    { name: "Quiz", status: participant.round1_quiz.status },
    { name: "Video", status: participant.round2_video.status },
    { name: "Meeting", status: participant.round3_meeting.status },
    { name: "Task", status: participant.round4_task.status },
  ];

  // 1. Instantiate the mutation hook
  const [updateParticipant, { isLoading }] = useUpdateParticipantMutation();

  // 2. Create handler functions
  const handlePassParticipant = () => {
    updateParticipant({
      id: participant._id,
      isEliminated: false,
      round1_quiz: { status: RoundStatus.PASSED },
    });
  };

  const handleFailParticipant = () => {
    updateParticipant({
      id: participant._id,
      isEliminated: true,
      // Using the nested object structure required by Partial<Participant>
      round1_quiz: { status: RoundStatus.FAILED },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "passed":
      case "submitted":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
      case "eliminated":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "in_progress":
      case "under_review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "not_started":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* Top Section: Basic Info & Overall Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage
                    src={
                      user.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                  />
                  <AvatarFallback className="text-3xl">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-6 w-6 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              {/* <div className="text-xs text-gray-500 mt-1">
                <span>Registered: {participant.registrationDate}</span> |{" "}
                <span>Last Active: {participant.lastActivity}</span>
              </div> */}
            </div>
          </div>
          {/* <div className="text-right">
            <RoundStatusBadge status={participant.overallStatus} />
            <p className="text-sm font-medium mt-1">
    _          Progress: {participant.progressPercentage}%
            </p>
          </div> */}
        </div>

        {/* Middle Section: Round Timeline */}
        <div className="flex items-center space-x-1 mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center p-2 rounded-lg border bg-gray-50 text-center min-w-24">
                {getStatusIcon(step.status)}
                <p className="text-xs font-semibold mt-1">{step.name}</p>
                <RoundStatusBadge status={step.status} isSmall />
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-gray-300 mx-1 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom Section: Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button size="sm" onClick={onViewDetails}>
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button size="sm" variant="outline">
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </Button>

            {/* 3. Add conditional buttons */}
            {participant.isEliminated ? (
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={handlePassParticipant}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-1" />
                )}
                Pass
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleFailParticipant}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                Fail
              </Button>
            )}
          </div>
          {/* <p className="text-sm text-gray-600 font-medium">
            Current Round: {participant.currentRound} -{" "}
            {roundNames[participant.currentRound as keyof typeof roundNames]}
          </p> */}
        </div>
      </CardContent>
    </Card>
  );
};
