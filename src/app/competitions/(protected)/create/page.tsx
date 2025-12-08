"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trophy, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useCreateCompetitionMutation } from "@/lib/api/competitionApi";
import { CreateCompetitionPayload } from "@/lib/features/competition/types";
import { BasicInfoStep } from "@/components/competitions/create/BasicInfoStep";
import { SkillsStep } from "@/components/competitions/create/SkillsStep";
import { TimelineRewardsStep } from "@/components/competitions/create/TimelineRewardsStep";
import { QuizSettingsStep } from "@/components/competitions/create/QuizSettingsStep";
import { TermsSubmissionStep } from "@/components/competitions/create/TermsSubmissionStep";
import { CompetitionFormData } from "@/components/competitions/create/types";

function CreateCompetitionPageContent() {
  const router = useRouter();
  const [createCompetition, { isLoading }] = useCreateCompetitionMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompetitionFormData>({
    title: "",
    description: "",
    category: "",
    skillsTested: [],
    location: "",
    workType: "",
    experienceLevel: "",
    startDate: "",
    endDate: "",
    resultDate: "",
    prize: "",
    registrationFee: "free",
    maxParticipants: "",
    projectBrief: "",
    evaluationCriteria: [],
    termsAndConditions: [],
    submissionFormats: [],
    attachments: [],
    fileLinks: [],
    bannerImage: null,
    quizSettings: {
      passingScore: 0,
      timeLimit: 0,
      randomizeQuestions: false,
      showResults: false,
    },
  });

  const totalSteps = 5;

  const handleInputChange = (
    field: string,
    value: string | string[] | boolean | number
  ) => {
    if (field.startsWith("quizSettings.")) {
      const key = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        quizSettings: {
          ...prev.quizSettings,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addToArray = (
    field: string,
    value: string,
    setter: (value: string) => void
  ) => {
    if (value.trim()) {
      const currentArray = formData[field as keyof typeof formData] as string[];
      handleInputChange(field, [...currentArray, value.trim()]);
      setter("");
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    handleInputChange(
      field,
      currentArray.filter((_, i) => i !== index)
    );
  };

  const handleAddFileLink = (name: string, url: string) => {
    const newLink = { name: name.trim(), url: url.trim() };
    setFormData((prev) => ({
      ...prev,
      fileLinks: [...prev.fileLinks, newLink],
    }));
  };

  const removeFileLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fileLinks: prev.fileLinks.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (
    files: FileList | null,
    type: "banner" | "attachments"
  ) => {
    if (!files) return;

    if (type === "banner" && files[0]) {
      setFormData((prev) => ({ ...prev, bannerImage: files[0] }));
    } else if (type === "attachments") {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const removeFile = (index: number, type: "banner" | "attachments") => {
    if (type === "banner") {
      setFormData((prev) => ({ ...prev, bannerImage: null }));
    } else {
      setFormData((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index),
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!formData.bannerImage) {
      toast.error("Please upload a banner image before submitting.");
      setCurrentStep(1);
      return;
    }

    const payload: CreateCompetitionPayload = {
      title: formData.title,
      description: formData.description,
      category: [formData.category],
      experienceLevel: formData.experienceLevel,
      location: formData.location,
      workType: formData.workType,
      skillsTested: formData.skillsTested.join(", "),
      projectBrief: formData.projectBrief,
      evaluationCriteria: formData.evaluationCriteria.join(", "),
      startDate: formData.startDate,
      endDate: formData.endDate,
      resultDate: formData.resultDate,
      prize: formData.prize,
      maxParticipants: formData.maxParticipants
        ? parseInt(formData.maxParticipants)
        : undefined,
      registrationFee: formData.registrationFee === "free" ? "Free" : "Paid",
      submissionFormats: formData.submissionFormats,
      additionalFiles: formData.fileLinks.map((link) => ({
        link: link.url,
        description: link.name,
      })),
      termsAndConditions: formData.termsAndConditions,
      quizSettings: {
        passingScore: Number(formData.quizSettings.passingScore),
        timeLimit: Number(formData.quizSettings.timeLimit),
        randomizeQuestions: formData.quizSettings.randomizeQuestions,
        showResults: formData.quizSettings.showResults,
      },
    };

    const promise = createCompetition({
      payload,
      bannerImage: formData.bannerImage,
    }).unwrap();

    toast.promise(promise, {
      loading: "Creating your competition...",
      success: (data) => {
        router.push(`/competitions/${data?._id}/manage`);
        return "Competition created successfully!";
      },
      error: (err) => err.data?.message || "An unknown error occurred.",
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
            removeFile={removeFile}
          />
        );
      case 2:
        return (
          <SkillsStep
            formData={formData}
            handleInputChange={handleInputChange}
            addToArray={addToArray}
            removeFromArray={removeFromArray}
          />
        );
      case 3:
        return (
          <TimelineRewardsStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <QuizSettingsStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <TermsSubmissionStep
            formData={formData}
            addToArray={addToArray}
            removeFromArray={removeFromArray}
            handleAddFileLink={handleAddFileLink}
            removeFileLink={removeFileLink}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-6 ">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-sm px-4 py-2 "
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Competition
              </h1>
              <p className="text-gray-600">
                Set up a new competition to find top talent
              </p>
            </div>
          </div>

          {/* Progress */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#FC5602] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="shadow-lg">
            <CardContent className="p-12">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 text-sm"
            >
              Previous
            </Button>
            <div className="flex space-x-4">
              {currentStep === totalSteps ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => console.log("Save as draft")}
                    className="px-6 py-2 text-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="btn-primary px-8 py-2 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4 mr-2" />
                        Create Competition
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleNext}
                  className="btn-primary px-6 py-2 text-sm"
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateCompetitionPage() {
  return (
    <>
      <CreateCompetitionPageContent />
      <Toaster position="top-center" />
    </>
  );
}
