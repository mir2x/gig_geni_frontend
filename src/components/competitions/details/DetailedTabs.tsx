import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Award,
  CheckCircle,
  Target,
  Calendar,
  Clock,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Competition } from "@/lib/features/competition/types";

interface DetailedTabsProps {
  competition: Competition;
  criteriaArray: string[];
  skillsArray: string[];
  formatDate: (dateString: string | undefined) => string;
}

export function DetailedTabs({
  competition,
  criteriaArray,
  skillsArray,
  formatDate,
}: DetailedTabsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="terms">Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              {competition.submissionFormats &&
                competition.submissionFormats.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Download className="h-5 w-5 mr-2 text-orange-500" />
                      Submission Formats
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {competition.submissionFormats.map((format, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-500" />
                  Evaluation Criteria
                </h4>
                <div className="space-y-3">
                  {criteriaArray.map((criterion, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-500" />
                Skills Being Tested
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skillsArray.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-orange-500 mr-3" />
                    <span className="text-gray-800 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                Important Dates
              </h4>

              <div className="space-y-4">
                {competition.startDate && (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Competition Starts
                        </p>
                        <p className="text-sm text-gray-600">
                          Registration deadline
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatDate(competition.startDate)}
                    </p>
                  </div>
                )}

                {competition.endDate && (
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-orange-500 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Submission Deadline
                        </p>
                        <p className="text-sm text-gray-600">
                          Final submissions due
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-orange-600">
                      {formatDate(competition.endDate)}
                    </p>
                  </div>
                )}

                {competition.resultDate && (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Results Announced
                        </p>
                        <p className="text-sm text-gray-600">
                          Winners will be announced
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-600">
                      {formatDate(competition.resultDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="mt-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-orange-500" />
                Terms and Conditions
              </h4>
              {competition.termsAndConditions &&
              competition.termsAndConditions.length > 0 ? (
                <div className="space-y-3">
                  {competition.termsAndConditions.map((term, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-orange-500 font-semibold mr-3">
                        {index + 1}.
                      </span>
                      <p className="text-gray-700">{term}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  Terms and conditions will be provided upon registration.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
