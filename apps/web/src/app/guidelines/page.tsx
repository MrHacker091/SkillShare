import Link from "next/link";
import { ArrowLeft, FileText, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GuidelinesPage() {
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
              Community{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Guidelines
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Creating a safe and respectful environment for all creators and customers.
            </p>
          </div>
        </div>
      </div>

      {/* Guidelines Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Core Values */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Our Core Values</h2>
                  <p className="text-muted-foreground">
                    SkillShare is built on respect, creativity, and collaboration. We expect all members to uphold these values.
                  </p>
                </div>
              </div>
              
              <ul className="space-y-3 ml-16">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Be respectful and professional in all interactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Share only original work or properly licensed content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Deliver quality work and meet agreed-upon deadlines</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Communicate clearly and honestly with clients</span>
                </li>
              </ul>
            </div>

            {/* Prohibited Content */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-red-100 dark:bg-red-900/20 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Prohibited Content</h2>
                  <p className="text-muted-foreground">
                    The following types of content are strictly prohibited on SkillShare:
                  </p>
                </div>
              </div>
              
              <ul className="space-y-3 ml-16">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Plagiarized or stolen content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Hate speech, harassment, or discrimination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Adult or inappropriate content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  <span>Spam, scams, or fraudulent activities</span>
                </li>
              </ul>
            </div>

            {/* Detailed Guidelines */}
            <div className="bg-muted/50 rounded-lg p-8">
              <FileText className="h-12 w-12 mx-auto mb-6 text-muted-foreground" />
              <h3 className="text-2xl font-bold mb-4 text-center">Detailed Guidelines Coming Soon</h3>
              <p className="text-center text-muted-foreground mb-6">
                We're working on comprehensive community guidelines. For now, please use common sense and treat others as you'd like to be treated.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">Report an Issue</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/help">Get Help</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
