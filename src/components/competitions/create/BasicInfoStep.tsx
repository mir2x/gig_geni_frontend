import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { CompetitionFormData } from "./types";
import { useState } from "react";

interface BasicInfoStepProps {
  formData: CompetitionFormData;
  handleInputChange: (
    field: string,
    value: string | string[] | boolean | number
  ) => void;
  handleFileUpload: (
    files: FileList | null,
    type: "banner" | "attachments"
  ) => void;
  removeFile: (index: number, type: "banner" | "attachments") => void;
}

export function BasicInfoStep({
  formData,
  handleInputChange,
  handleFileUpload,
  removeFile,
}: BasicInfoStepProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "banner" | "attachments") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files, type);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Tell us about your competition and upload a banner image
        </p>
      </div>

      {/* Banner Image Upload */}
      <div className="space-y-6">
        <Label className="text-xl font-semibold">
          Competition Banner Image
        </Label>
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? "border-orange-500 bg-orange-50"
              : formData.bannerImage
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => handleDrop(e, "banner")}
        >
          {formData.bannerImage ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3">
                <ImageIcon className="h-10 w-10 text-green-600" />
                <span className="text-xl font-medium text-green-700">
                  {formData.bannerImage.name}
                </span>
              </div>
              <p className="text-base text-gray-600">
                Size: {(formData.bannerImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => removeFile(0, "banner")}
                className="text-red-600 hover:text-red-700 hover:border-red-300 px-8 py-3"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Remove Image
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Upload className="h-16 w-16 text-gray-400 mx-auto" />
              <div>
                <p className="text-xl font-medium text-gray-700 mb-3">
                  Drop your banner image here, or click to browse
                </p>
                <p className="text-base text-gray-500">
                  Recommended: 1200x400px, JPG or PNG, max 5MB
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files, "banner")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Competition Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Senior Frontend Developer Challenge"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what you're looking for and what the competition involves..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel" className="text-sm font-medium">
              Experience Level
            </Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) =>
                handleInputChange("experienceLevel", value)
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                <SelectItem value="senior">Senior Level (5-8 years)</SelectItem>
                <SelectItem value="lead">Lead/Principal (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Remote, New York, NY"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType" className="text-sm font-medium">
              Work Type
            </Label>
            <Select
              value={formData.workType}
              onValueChange={(value) => handleInputChange("workType", value)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select work type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
