"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { selectCurrentUser } from "@/lib/features/auth/authSlice";
import { useGetCompetitionQuery } from "@/lib/api/competitionApi";
import { useAppSelector } from "@/lib/hooks";
import { Competition } from "@/lib/features/competition/types";
import { useCheckParticipantMutation } from "@/lib/api/participantApi";

import { DetailsHeader } from "@/components/competitions/details/DetailsHeader";
import { HeroSection } from "@/components/competitions/details/HeroSection";
import { OverviewCard } from "@/components/competitions/details/OverviewCard";
import { ResourcesCard } from "@/components/competitions/details/ResourcesCard";
import { DetailedTabs } from "@/components/competitions/details/DetailedTabs";
import { Sidebar } from "@/components/competitions/details/Sidebar";

export default function CompetitionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const {
    data: competition,
    isLoading,
    isError,
  } = useGetCompetitionQuery(competitionId, { skip: !competitionId });
  const currentUser = useAppSelector(selectCurrentUser);

  const [participationStatus, setParticipationStatus] = useState<
    "checking" | "joined" | "not_joined" | "error"
  >("checking");

  const [checkParticipant] = useCheckParticipantMutation();

  useEffect(() => {
    if (competition && currentUser && competitionId) {
      const performCheck = async () => {
        try {
          const result = await checkParticipant({ competitionId }).unwrap();

          if (result.canParticipate === false) {
            setParticipationStatus("joined");
          } else {
            setParticipationStatus("not_joined");
          }
        } catch (err: any) {
          if (err.status === 409) {
            setParticipationStatus("joined");
          } else {
            console.error("Failed to check participation status:", err);
            setParticipationStatus("error");
            toast.error("Could not verify participation status.");
          }
        }
      };

      performCheck();
    }
  }, [competition, currentUser, competitionId, checkParticipant]);

  const [isSaved, setIsSaved] = useState(false);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const getStatusBadge = (comp: Competition) => {
    const now = new Date();
    const startDate = comp.startDate;
    const endDate = comp.endDate;

    if (now < new Date(startDate))
      return { text: "Upcoming", color: "bg-blue-100 text-blue-700" };
    if (now > new Date(endDate))
      return { text: "Completed", color: "bg-gray-100 text-gray-500" };
    return { text: "Active", color: "bg-green-100 text-green-700" };
  };
  const formatShortDate = (date: Date | undefined) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleJoin = () => {
    router.push(`/competitions/${competitionId}/join`);
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    toast.success(!isSaved ? "Competition saved!" : "Competition unsaved.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading competition details...</p>
        </div>
      </div>
    );
  }

  if (isError || !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Competition Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The competition you are looking for does not exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  const skillsString = competition.skillsTested;
  const skillsArray = skillsString
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  const criteriaString = competition.evaluationCriteria;
  const criteriaArray = criteriaString
    .split(",")
    .map((criterion) => criterion.trim())
    .filter((criterion) => criterion.length > 0);

  const decodedHtml = atob(competition.projectBrief);
  const projectBriefHtml = { __html: decodedHtml };

  const status = getStatusBadge(competition);

  return (
    <div className="min-h-screen container">
      <DetailsHeader
        competition={competition}
        isSaved={isSaved}
        onSave={handleSave}
      />

      <HeroSection competition={competition} status={status} />

      <div className="w-full py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8  ">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <OverviewCard competition={competition} status={status} />

            {/* Project Brief */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Project Brief</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={projectBriefHtml}
                />
              </CardContent>
            </Card>

            <ResourcesCard competition={competition} />

            <DetailedTabs
              competition={competition}
              criteriaArray={criteriaArray}
              skillsArray={skillsArray}
              formatDate={formatDate}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              competition={competition}
              participationStatus={participationStatus}
              status={status}
              formatShortDate={formatShortDate}
              handleJoin={handleJoin}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
