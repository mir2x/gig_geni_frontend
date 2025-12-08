import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CompetitionFormData } from "./types";

interface QuizSettingsStepProps {
  formData: CompetitionFormData;
  handleInputChange: (
    field: string,
    value: string | string[] | boolean | number
  ) => void;
}

export function QuizSettingsStep({
  formData,
  handleInputChange,
}: QuizSettingsStepProps) {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Settings</h2>
        <p className="text-gray-600">
          Configure the settings for the quiz part of your competition.
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="passingScore" className="text-sm font-medium">
              Passing Score (%)
            </Label>
            <Input
              id="passingScore"
              type="number"
              value={formData.quizSettings.passingScore}
              onChange={(e) =>
                handleInputChange("quizSettings.passingScore", e.target.value)
              }
              placeholder="e.g., 75"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeLimit" className="text-sm font-medium">
              Time Limit (minutes)
            </Label>
            <Input
              id="timeLimit"
              type="number"
              value={formData.quizSettings.timeLimit}
              onChange={(e) =>
                handleInputChange("quizSettings.timeLimit", e.target.value)
              }
              placeholder="e.g., 60"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="randomizeQuestions"
              checked={formData.quizSettings.randomizeQuestions}
              onCheckedChange={(checked) =>
                handleInputChange("quizSettings.randomizeQuestions", !!checked)
              }
            />
            <Label
              htmlFor="randomizeQuestions"
              className="text-base font-medium"
            >
              Randomize Questions
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="showResults"
              checked={formData.quizSettings.showResults}
              onCheckedChange={(checked) =>
                handleInputChange("quizSettings.showResults", !!checked)
              }
            />
            <Label htmlFor="showResults" className="text-base font-medium">
              Show Results to Participants Immediately
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
