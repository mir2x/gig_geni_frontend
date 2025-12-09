import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { QuizQuestion } from "@/lib/features/quizQuestion/types";
import { HtmlRendererIframe } from "./HtmlRendererIframe";
import { decodeFromBase64 } from "./types";

interface QuestionListProps {
  questions: QuizQuestion[];
  isFetchingQuestions: boolean;
  isError: boolean;
  handleRemoveQuestion: (id: string) => void;
}

export function QuestionList({
  questions,
  isFetchingQuestions,
  isError,
  handleRemoveQuestion,
}: QuestionListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions ({questions.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
        {isFetchingQuestions && (
          <p className="text-center text-gray-500">Loading questions...</p>
        )}
        {isError && (
          <p className="text-center text-red-500">Failed to load questions.</p>
        )}
        {!isFetchingQuestions && questions.length === 0 && (
          <p className="text-center text-gray-500">No questions added yet.</p>
        )}

        {questions.map((q: QuizQuestion, index) => {
          // ⭐ BASE64 DECODING LOGIC
          let displayedQuestion = q.question;
          if (q.isMarkdown) {
            // Decode from Base64 before displaying/rendering as HTML
            displayedQuestion = decodeFromBase64(q.question);
          }

          return (
            <div key={q._id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="prose prose-sm max-w-none pr-4">
                  <span className="font-medium">Q{index + 1}: </span>
                  {q.isMarkdown ? (
                    // ⭐ NEW ISOLATED HTML RENDERING WITH IFRAME
                    <HtmlRendererIframe
                      htmlContent={displayedQuestion}
                      className="mt-1"
                    />
                  ) : (
                    // Render as plain text
                    <span>{displayedQuestion}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Badge className={getDifficultyColor(q.difficulty)}>
                    {q.difficulty}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-600 hover:text-red-700"
                    onClick={() => handleRemoveQuestion(q._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                {q.options?.map((option, optIndex) => (
                  <div
                    key={option._id || optIndex}
                    className={`p-2 rounded text-xs ${
                      option.isCorrect
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "bg-gray-100"
                    }`}
                  >
                    {String.fromCharCode(65 + optIndex)}. {option.text}
                    {option.isCorrect && " ✓"}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Points: {q.points}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
