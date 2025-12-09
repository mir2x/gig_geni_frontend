import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { QuestionType, QuestionDifficulty } from "@/lib/features/quizQuestion/types";
import { NewQuestionState } from "./types";

interface QuestionFormProps {
  newQuestion: NewQuestionState;
  setNewQuestion: React.Dispatch<React.SetStateAction<NewQuestionState>>;
  handleAddQuestion: () => void;
  isCreatingQuestion: boolean;
}

export function QuestionForm({
  newQuestion,
  setNewQuestion,
  handleAddQuestion,
  isCreatingQuestion,
}: QuestionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Question</label>
          <Textarea
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion((p) => ({ ...p, question: e.target.value }))
            }
            placeholder={
              newQuestion.isMarkdown
                ? "Enter your question using HTML syntax..."
                : "Enter your question..."
            }
            rows={5}
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="isMarkdown"
            checked={newQuestion.isMarkdown}
            onCheckedChange={(checked) =>
              setNewQuestion((p) => ({ ...p, isMarkdown: !!checked }))
            }
          />
          <Label
            htmlFor="isMarkdown"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Render question as **HTML** (Content will be Base64 encoded for
            storage)
          </Label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Question Type
          </label>
          <Select
            value={newQuestion.type}
            onValueChange={(value: QuestionType) =>
              setNewQuestion((p) => ({
                ...p,
                type: value,
                correctAnswerIndexes: value === "multiple" ? [] : [0],
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Answer</SelectItem>
              <SelectItem value="multiple">Multiple Answer</SelectItem>
              <SelectItem value="true_false">True/False</SelectItem>
              <SelectItem value="short">Short Descriptive</SelectItem>
              <SelectItem value="broad">Broad Question</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <Select
              value={newQuestion.difficulty}
              onValueChange={(value: QuestionDifficulty) =>
                setNewQuestion((p) => ({ ...p, difficulty: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Points</label>
            <Input
              type="number"
              value={newQuestion.points}
              onChange={(e) =>
                setNewQuestion((p) => ({
                  ...p,
                  points: Math.max(0, parseInt(e.target.value, 10) || 0),
                }))
              }
              placeholder="e.g., 10"
              min="0"
            />
          </div>
        </div>

        {["single", "multiple"].includes(newQuestion.type) && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Options & Correct Answer
            </label>
            {newQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium w-6">
                  {String.fromCharCode(65 + index)}.
                </span>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion((p) => ({ ...p, options: newOptions }));
                  }}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
                {newQuestion.type === "single" ? (
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.correctAnswerIndexes[0] === index}
                    onChange={() =>
                      setNewQuestion((p) => ({
                        ...p,
                        correctAnswerIndexes: [index],
                      }))
                    }
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={newQuestion.correctAnswerIndexes.includes(index)}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const currentIndexes = newQuestion.correctAnswerIndexes;
                      const newIndexes = checked
                        ? [...currentIndexes, index]
                        : currentIndexes.filter((i) => i !== index);
                      setNewQuestion((p) => ({
                        ...p,
                        correctAnswerIndexes: newIndexes.sort(),
                      }));
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {newQuestion.type === "true_false" && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Correct Answer
            </label>
            <Select
              value={newQuestion.correctAnswerIndexes[0]?.toString()}
              onValueChange={(value) =>
                setNewQuestion((p) => ({
                  ...p,
                  correctAnswerIndexes: [parseInt(value)],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">True</SelectItem>
                <SelectItem value="1">False</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {["short", "broad"].includes(newQuestion.type) && (
          <div>
            <label className="block text-sm font-medium mb-2">Word Limit</label>
            <Input
              type="number"
              value={newQuestion.wordLimit}
              onChange={(e) =>
                setNewQuestion((p) => ({
                  ...p,
                  wordLimit: parseInt(e.target.value),
                }))
              }
              min="10"
            />
          </div>
        )}
        <Button
          onClick={handleAddQuestion}
          className="w-full"
          disabled={isCreatingQuestion}
        >
          {isCreatingQuestion ? (
            "Adding..."
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
