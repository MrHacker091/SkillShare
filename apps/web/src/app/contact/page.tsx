import Link from "next/link";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
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
              Get in{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We'd love to hear from you. Reach out to our team.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="bg-card border rounded-lg p-6">
                <Mail className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  For general inquiries and support
                </p>
                <a href="mailto:support@skillshare.com" className="text-blue-600 hover:underline">
                  support@skillshare.com
                </a>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <FileText className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Inquiries</h3>
                <p className="text-muted-foreground mb-4">
                  For partnerships and business opportunities
                </p>
                <a href="mailto:business@skillshare.com" className="text-blue-600 hover:underline">
                  business@skillshare.com
                </a>
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div className="bg-card border rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Send us a Message</h3>
              <p className="text-muted-foreground mb-6">
                Contact form coming soon. For now, please email us directly.
              </p>
              <Button asChild className="w-full">
                <a href="mailto:support@skillshare.com">Email Us</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
