import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Competition } from "@/lib/features/competition/types";

interface HeroSectionProps {
  competition: Competition;
  status: { text: string; color: string };
}

export function HeroSection({ competition, status }: HeroSectionProps) {
  return (
    <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
      <Image
        src={competition.bannerImage}
        alt={competition.title}
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-6 left-6 text-white z-10">
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-white text-gray-900">
            {competition.category}
          </Badge>
          <Badge className={status.color}>{status.text}</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {competition.title}
        </h1>
        <p className="text-lg opacity-90">by {competition.createdBy.name}</p>
      </div>
    </div>
  );
}
