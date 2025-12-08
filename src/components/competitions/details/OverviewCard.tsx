import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Trophy } from "lucide-react";
import { Competition } from "@/lib/features/competition/types";

interface OverviewCardProps {
  competition: Competition;
  status: { text: string; color: string };
}

export function OverviewCard({ competition, status }: OverviewCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <Badge className={status.color}>{status.text}</Badge>

              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                4.8
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">{competition.category}</div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {competition.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{competition.location}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            <span>{competition.registrationFee}</span>
          </div>

          <div className="flex items-center text-sm font-semibold text-green-600">
            <Trophy className="h-4 w-4 mr-2" />
            <span>{competition.prize}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            About This Competition
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {competition.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
