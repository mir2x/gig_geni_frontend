import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  BookMarked,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Competition } from "@/lib/features/competition/types";

interface DetailsHeaderProps {
  competition: Competition;
  isSaved: boolean;
  onSave: () => void;
}

export function DetailsHeader({
  competition,
  isSaved,
  onSave,
}: DetailsHeaderProps) {
  const router = useRouter();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function"
    ) {
      if (navigator.canShare({ url: window.location.href })) {
        setIsNativeShareSupported(true);
      }
    }
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this competition: ${competition.title}\n${shareUrl}`;

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!");
        setIsShareOpen(false);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Could not copy link.");
        setIsShareOpen(false);
      });
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: competition?.title,
          text: `Check out this competition: ${competition?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error))
        .finally(() => setIsShareOpen(false));
    } else {
      toast.error("Web sharing is not supported on this browser.");
    }
  };

  return (
    <div className="relative z-20 bg-transparent mt-5">
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white border border-gray-300 shadow-md"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-3">
            <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="end">
                <div className="flex flex-col space-y-1">
                  {isNativeShareSupported && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={handleNativeShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share via...
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        shareText
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Share on WhatsApp
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsShareOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Share on Messenger
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleCopyToClipboard}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={onSave}
              className={
                isSaved
                  ? "bg-orange-500 hover:bg-orange-600 shadow-sm"
                  : "bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              }
            >
              {isSaved ? (
                <BookMarked className="h-4 w-4 mr-2" />
              ) : (
                <Bookmark className="h-4 w-4 mr-2" />
              )}
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
