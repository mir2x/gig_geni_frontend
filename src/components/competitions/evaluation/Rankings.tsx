import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Crown, Medal, Award, Trophy } from "lucide-react";
import { Participant, prizeCategories } from "./types";

interface RankingsProps {
  evaluatedParticipants: Participant[];
  handleSetWinner: (participantId: string, prizeCategory: string) => void;
}

export function Rankings({
  evaluatedParticipants,
  handleSetWinner,
}: RankingsProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-500" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <Trophy className="h-5 w-5 text-blue-500" />;
    }
  };

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
        <CardTitle>Final Rankings & Winner Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {evaluatedParticipants
            .filter((p) => p.finalScore !== undefined)
            .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
            .map((participant, index) => (
              <div key={participant.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(index + 1)}
                      <span className="text-lg font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-gray-600">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {participant.finalScore}/100
                      </p>
                      <Badge className={getStatusColor(participant.status)}>
                        {participant.isWinner
                          ? participant.prizeCategory
                          : participant.status}
                      </Badge>
                    </div>
                    {!participant.isWinner && (
                      <Select
                        onValueChange={(value) =>
                          handleSetWinner(participant.id, value)
                        }
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Set as winner" />
                        </SelectTrigger>
                        <SelectContent>
                          {prizeCategories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              <div>
                                <p className={`font-medium ${category.color}`}>
                                  {category.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {category.prize}
                                </p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                {participant.finalComments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm">{participant.finalComments}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
