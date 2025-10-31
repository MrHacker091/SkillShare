import Link from "next/link";
import { ArrowLeft, Newspaper, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-20">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Press &{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Media
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The latest news, press releases, and media resources about SkillShare.
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-12 text-center">
            <Newspaper className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-3xl font-bold mb-4">Press Kit Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're preparing comprehensive press materials, brand assets, and media resources. 
              For press inquiries, please contact our media team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Media Contact</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">About Us</Link>
              </Button>
            </div>
          </div>

          {/* Press Contact Info */}
          <div className="mt-16 bg-muted/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Media Inquiries</h3>
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">General Press Inquiries</h4>
                  <p className="text-muted-foreground">
                    For general media questions and interview requests: <strong>press@skillshare.com</strong>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Newspaper className="h-6 w-6 text-indigo-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Partnership Opportunities</h4>
                  <p className="text-muted-foreground">
                    For strategic partnerships and collaborations: <strong>partnerships@skillshare.com</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
