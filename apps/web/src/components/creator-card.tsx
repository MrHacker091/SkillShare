import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as BadgeIcon, Briefcase, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CreatorCardProps {
  id: string;
  name: string;
  title: string;
  avatar: string;
  coverImage: string;
  location: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseTime: string;
  isVerified: boolean;
  skills: string[];
  startingPrice: number;
}

export function CreatorCard({
  id,
  name,
  title,
  avatar,
  coverImage,
  location,
  rating,
  reviewCount,
  completedProjects,
  responseTime,
  isVerified,
  skills,
  startingPrice,
}: CreatorCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-24 overflow-hidden">
        <Image
          src={coverImage}
          alt={`${name}'s cover`}
          width={400}
          height={96}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

        {/* Verification Badge */}
        {isVerified && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-green-500/90 text-white backdrop-blur-sm"
          >
            <BadgeIcon className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Avatar and Basic Info */}
        <div className="mb-4 flex items-start space-x-3">
          <Avatar className="h-16 w-16 border-4 border-background shadow-lg -mt-8 relative z-10">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-4">
            <Link href={`/creators/${id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors truncate">
                {name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-1 mb-1">
              {title}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{completedProjects} projects</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-xs"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Response Time & Price */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            Responds in <span className="font-medium text-green-600">{responseTime}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Starting at</div>
            <div className="font-semibold">${startingPrice}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link href={`/creators/${id}`} className="w-full">
            <Button className="w-full" size="sm">
              View Profile
            </Button>
          </Link>
          <Link href={`/messages?creator=${id}`} className="w-full">
            <Button variant="outline" className="w-full" size="sm">
              Contact Creator
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}