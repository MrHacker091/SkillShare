import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Eye, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  rating: number;
  reviewCount: number;
  likes: number;
  views: number;
  tags: string[];
}

export function ProjectCard({
  id,
  title,
  description,
  image,
  price,
  category,
  creator,
  rating,
  reviewCount,
  likes,
  views,
  tags,
}: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={400}
          height={250}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" className="h-8 w-8 backdrop-blur-sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 backdrop-blur-sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
        >
          {category}
        </Badge>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-background/90 backdrop-blur-sm px-2 py-1">
          <span className="text-sm font-semibold">${price}</span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/projects/${id}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* Creator Info */}
        <div className="mb-3 flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`/creators/${creator.id}`}>
              <p className="text-sm font-medium hover:text-primary transition-colors truncate">
                {creator.name}
                {creator.isVerified && (
                  <Badge variant="secondary" className="ml-1 h-4 text-xs">
                    ✓
                  </Badge>
                )}
              </p>
            </Link>
          </div>
        </div>

        {/* Rating and Stats */}
        <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span>({reviewCount})</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}