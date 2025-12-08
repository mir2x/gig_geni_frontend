import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  CheckCircle,
  Trophy,
  AlertCircle,
  Calendar,
  Users,
  Building,
} from "lucide-react";
import { Competition } from "@/lib/features/competition/types";

interface SidebarProps {
  competition: Competition;
  participationStatus: "checking" | "joined" | "not_joined" | "error";
  status: { text: string; color: string };
  formatShortDate: (date: Date | undefined) => string;
  handleJoin: () => void;
}

export function Sidebar({
  competition,
  participationStatus,
  status,
  formatShortDate,
  handleJoin,
}: SidebarProps) {
  const getJoinButtonContent = () => {
    switch (participationStatus) {
      case "checking":
        return (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Checking Status...
          </>
        );
      case "joined":
        return (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            Already Joined
          </>
        );
      case "not_joined":
        return (
          <>
            <Trophy className="h-4 w-4 mr-2" />
            Join Competition
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="h-4 w-4 mr-2" />
            Cannot Join
          </>
        );
      default:
        return "Join Competition";
    }
  };

  return (
    <div className="space-y-6 sticky top-6">
      {/* Join Competition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Join Competition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              ৳{competition.prize}
            </div>
            <p className="text-sm text-gray-600">Total Prize Pool</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Registration:</span>
              <span className="font-medium">{competition.registrationFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Deadline:</span>
              <span className="font-medium text-orange-600">
                {formatShortDate(new Date(competition.endDate))}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button
              onClick={handleJoin}
              className={`w-full ${
                participationStatus === "joined"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-600 hover:bg-orange-700"
              } text-white`}
              size="lg"
              disabled={
                status.text === "Completed" ||
                participationStatus === "checking" ||
                participationStatus === "joined" ||
                participationStatus === "error"
              }
            >
              {getJoinButtonContent()}
            </Button>

            {status.text === "Completed" && (
              <p className="text-sm text-gray-500 text-center">
                This competition has ended
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Quick Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Duration</p>
              <p className="text-sm text-gray-600">
                {formatShortDate(new Date(competition.startDate))} -{" "}
                {formatShortDate(new Date(competition.endDate))}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Announcement</p>
              <p className="text-sm text-gray-600">
                {formatShortDate(new Date(competition.resultDate!)) ||
                  "Not Announced"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organizer Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Organizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {competition.createdBy.name}
              </p>
              <p className="text-sm text-gray-600">Competition Host</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
