import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, File, Trash2 } from "lucide-react";
import { CompetitionFormData } from "./types";
import { useState } from "react";

interface TermsSubmissionStepProps {
  formData: CompetitionFormData;
  addToArray: (
    field: string,
    value: string,
    setter: (value: string) => void
  ) => void;
  removeFromArray: (field: string, index: number) => void;
  handleAddFileLink: (name: string, url: string) => void;
  removeFileLink: (index: number) => void;
}

export function TermsSubmissionStep({
  formData,
  addToArray,
  removeFromArray,
  handleAddFileLink,
  removeFileLink,
}: TermsSubmissionStepProps) {
  const [newFormat, setNewFormat] = useState("");
  const [newTerm, setNewTerm] = useState("");
  const [newFileLink, setNewFileLink] = useState("");
  const [newFileName, setNewFileName] = useState("");

  const onAddFileLink = () => {
    if (newFileLink.trim() && newFileName.trim()) {
      handleAddFileLink(newFileName, newFileLink);
      setNewFileLink("");
      setNewFileName("");
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Terms & Submission
        </h2>
        <p className="text-gray-600">
          Final details, terms, and additional files
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Submission Formats</Label>
          <div className="flex space-x-2">
            <Input
              value={newFormat}
              onChange={(e) => setNewFormat(e.target.value)}
              placeholder="e.g., GitHub repository, PDF document, Video URL"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                addToArray("submissionFormats", newFormat, setNewFormat)
              }
              className="h-10"
            />
            <Button
              type="button"
              onClick={() =>
                addToArray("submissionFormats", newFormat, setNewFormat)
              }
              size="default"
              className="px-4 h-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formData.submissionFormats.map((format, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
              >
                <span className="text-sm font-medium">{format}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("submissionFormats", index)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Files & Documents Links */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            Additional Files & Documents
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Add links to additional files like project requirements, templates,
            or reference materials (Google Drive, Dropbox, etc.).
          </p>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter file link (e.g., Google Drive, Dropbox)"
                value={newFileLink}
                onChange={(e) => setNewFileLink(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="File name/description"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-48"
              />
              <Button
                type="button"
                onClick={onAddFileLink}
                disabled={!newFileLink.trim() || !newFileName.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Display added file links */}
          {formData.fileLinks && formData.fileLinks.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Added Files:</p>
              <div className="space-y-2">
                {formData.fileLinks.map((fileLink, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center space-x-3">
                      <File className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {fileLink.name}
                        </p>
                        <a
                          href={fileLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {fileLink.url}
                        </a>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFileLink(index)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium">Terms and Conditions</Label>
          <div className="flex space-x-2">
            <Input
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              placeholder="Add a term or condition"
              onKeyPress={(e) =>
                e.key === "Enter" &&
                addToArray("termsAndConditions", newTerm, setNewTerm)
              }
              className="h-10"
            />
            <Button
              type="button"
              onClick={() =>
                addToArray("termsAndConditions", newTerm, setNewTerm)
              }
              size="default"
              className="px-4 h-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.termsAndConditions.map((term, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
              >
                <span className="text-sm font-medium">{term}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("termsAndConditions", index)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">
              Competition Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Title:</strong> {formData.title || "Not set"}
            </p>
            <p>
              <strong>Category:</strong> {formData.category || "Not set"}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {formData.skillsTested.join(", ") || "None added"}
            </p>
            <p>
              <strong>Prize:</strong> {formData.prize || "Not set"}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {formData.startDate && formData.endDate
                ? `${formData.startDate} to ${formData.endDate}`
                : "Not set"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
