import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CompetitionFormData } from "./types";

interface TimelineRewardsStepProps {
  formData: CompetitionFormData;
  handleInputChange: (
    field: string,
    value: string | string[] | boolean | number
  ) => void;
}

export function TimelineRewardsStep({
  formData,
  handleInputChange,
}: TimelineRewardsStepProps) {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Timeline & Rewards
        </h2>
        <p className="text-gray-600">
          Set dates and prizes for your competition
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date *
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              End Date *
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultDate" className="text-sm font-medium">
              Result Date
            </Label>
            <Input
              id="resultDate"
              type="date"
              value={formData.resultDate}
              onChange={(e) => handleInputChange("resultDate", e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="prize" className="text-sm font-medium">
              Prize *
            </Label>
            <Input
              id="prize"
              value={formData.prize}
              onChange={(e) => handleInputChange("prize", e.target.value)}
              placeholder="e.g., $5,000 + Job Offer"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants" className="text-sm font-medium">
              Max Participants
            </Label>
            <Input
              id="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={(e) =>
                handleInputChange("maxParticipants", e.target.value)
              }
              placeholder="Leave empty for unlimited"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Registration Fee</Label>
          <div className="flex space-x-8">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="free"
                checked={formData.registrationFee === "free"}
                onCheckedChange={() =>
                  handleInputChange("registrationFee", "free")
                }
              />
              <Label htmlFor="free" className="text-base font-medium">
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="paid"
                checked={formData.registrationFee === "paid"}
                onCheckedChange={() =>
                  handleInputChange("registrationFee", "paid")
                }
              />
              <Label htmlFor="paid" className="text-base font-medium">
                Paid
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
