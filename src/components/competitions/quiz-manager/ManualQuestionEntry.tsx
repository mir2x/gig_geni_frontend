"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useCreateQuizQuestionMutation,
  useGetAllQuizQuestionQuery,
} from "@/lib/api/quizQuestionApi";
import {
  CreateQuizQuestionPayload,
} from "@/lib/features/quizQuestion/types";
import { QuestionStats } from "./entry/QuestionStats";
import { QuestionForm } from "./entry/QuestionForm";
import { QuestionList } from "./entry/QuestionList";
import { initialNewQuestionState, encodeToBase64 } from "./entry/types";

interface ManualQuestionEntryProps {
  competitionId: string;
}

export default function ManualQuestionEntry({
  competitionId,
}: ManualQuestionEntryProps) {
  const {
    data: questions = [],
    isLoading: isFetchingQuestions,
    isError,
  } = useGetAllQuizQuestionQuery(competitionId, {
    skip: !competitionId,
  });

  const [createQuestion, { isLoading: isCreatingQuestion }] =
    useCreateQuizQuestionMutation();

  const [newQuestion, setNewQuestion] = useState(initialNewQuestionState);

  const stats = useMemo(() => {
    return {
      totalQuestions: questions.length,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
      difficulty: {
        easy: questions.filter((q) => q.difficulty === "easy").length,
        medium: questions.filter((q) => q.difficulty === "medium").length,
        hard: questions.filter((q) => q.difficulty === "hard").length,
      },
    };
  }, [questions]);

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) {
      return toast.error("Question text cannot be empty.");
    }

    // BASE64 ENCODING LOGIC
    let questionContentToSend = newQuestion.question;
    if (newQuestion.isMarkdown) {
      questionContentToSend = encodeToBase64(newQuestion.question);
    }

    const payload: CreateQuizQuestionPayload = {
      competition: competitionId,
      question: questionContentToSend,
      type: newQuestion.type,
      points: newQuestion.points,
      difficulty: newQuestion.difficulty,
      isMarkdown: newQuestion.isMarkdown,
    };

    if (["single", "multiple", "true_false"].includes(newQuestion.type)) {
      const options =
        newQuestion.type === "true_false"
          ? ["True", "False"]
          : newQuestion.options;
      if (options.some((opt) => !opt.trim())) {
        return toast.error("All options must be filled out.");
      }
      payload.options = options.map((text, index) => ({
        text,
        isCorrect: newQuestion.correctAnswerIndexes.includes(index),
      }));
    }

    if (["short", "broad"].includes(newQuestion.type)) {
      payload.wordLimit = newQuestion.wordLimit;
    }

    try {
      await createQuestion(payload).unwrap();
      toast.success("Question added successfully!");
      setNewQuestion(initialNewQuestionState);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to add question.");
    }
  };

  const handleRemoveQuestion = (questionId: string) => {
    toast.error("Delete functionality is not yet implemented.");
    console.log("TODO: Implement delete for question ID:", questionId);
  };

  return (
    <div className="space-y-6">
      <QuestionStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionForm
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          handleAddQuestion={handleAddQuestion}
          isCreatingQuestion={isCreatingQuestion}
        />

        <QuestionList
          questions={questions}
          isFetchingQuestions={isFetchingQuestions}
          isError={isError}
          handleRemoveQuestion={handleRemoveQuestion}
        />
      </div>
    </div>
  );
}
