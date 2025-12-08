import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { skillSuggestions } from "@/lib/mock-data";
import { CompetitionFormData } from "./types";
import { useState } from "react";

interface SkillsStepProps {
  formData: CompetitionFormData;
  handleInputChange: (
    field: string,
    value: string | string[] | boolean | number
  ) => void;
  addToArray: (
    field: string,
    value: string,
    setter: (value: string) => void
  ) => void;
  removeFromArray: (field: string, index: number) => void;
}

export function SkillsStep({
  formData,
  handleInputChange,
  addToArray,
  removeFromArray,
}: SkillsStepProps) {
  const [newSkill, setNewSkill] = useState("");
  const [newCriteria, setNewCriteria] = useState("");

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Skills & Requirements
        </h2>
        <p className="text-gray-600">
          Define what skills you're looking for and project details
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Skills Tested *</Label>
          <div className="flex space-x-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g., React, Python, UI/UX)"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                addToArray("skillsTested", newSkill, setNewSkill)
              }
              className="h-10"
            />
            <Button
              type="button"
              onClick={() => addToArray("skillsTested", newSkill, setNewSkill)}
              size="default"
              className="px-4 h-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.category &&
            skillSuggestions[
              formData.category as keyof typeof skillSuggestions
            ] && (
              <div className="space-y-4">
                <p className="text-base text-gray-600 font-medium">
                  Suggested skills for {formData.category}:
                </p>
                <div className="flex flex-wrap gap-3">
                  {skillSuggestions[
                    formData.category as keyof typeof skillSuggestions
                  ].map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!formData.skillsTested.includes(skill)) {
                          handleInputChange("skillsTested", [
                            ...formData.skillsTested,
                            skill,
                          ]);
                        }
                      }}
                      disabled={formData.skillsTested.includes(skill)}
                      className="px-3 py-2"
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.skillsTested.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200"
              >
                <span className="text-base font-medium">{skill}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("skillsTested", index)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectBrief" className="text-sm font-medium">
            Project Brief
          </Label>
          <Textarea
            id="projectBrief"
            value={formData.projectBrief}
            onChange={(e) => handleInputChange("projectBrief", e.target.value)}
            placeholder="Describe the project or challenge participants will work on..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Evaluation Criteria</Label>
          <div className="flex space-x-2">
            <Input
              value={newCriteria}
              onChange={(e) => setNewCriteria(e.target.value)}
              placeholder="Add evaluation criteria (e.g., Code Quality, Innovation, User Experience)"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                addToArray("evaluationCriteria", newCriteria, setNewCriteria)
              }
              className="h-10"
            />
            <Button
              type="button"
              onClick={() =>
                addToArray("evaluationCriteria", newCriteria, setNewCriteria)
              }
              size="default"
              className="px-4 h-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.evaluationCriteria.map((criteria, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200"
              >
                <span className="text-base font-medium">{criteria}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("evaluationCriteria", index)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
