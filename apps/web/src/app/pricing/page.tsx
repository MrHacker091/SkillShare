import Link from "next/link";
import { ArrowLeft, DollarSign, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
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
              Simple,{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start for free. Pay only when you earn. No hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Free Plan */}
            <div className="bg-card border rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full h-12 w-12 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Customers</h3>
                  <p className="text-muted-foreground">Browse and purchase</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">Free</div>
                <p className="text-muted-foreground">No cost to join or browse</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Browse unlimited projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Connect with creators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Secure payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Purchase protection</span>
                </li>
              </ul>
              
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth/register">Sign Up Free</Link>
              </Button>
            </div>

            {/* Creator Plan */}
            <div className="bg-linear-to-br from-blue-600/5 via-indigo-500/5 to-purple-500/5 border-2 border-blue-600 rounded-lg p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full h-12 w-12 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Creators</h3>
                  <p className="text-muted-foreground">Sell your work</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">10% Fee</div>
                <p className="text-muted-foreground">Only pay when you earn</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Unlimited project listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Custom pricing & packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Direct client communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Instant payouts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Creator badge</span>
                </li>
              </ul>
              
              <Button asChild className="w-full bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-600">
                <Link href="/sell">Start Selling</Link>
              </Button>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="bg-muted/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-start gap-4">
                <DollarSign className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Transparent Fees</h4>
                  <p className="text-muted-foreground">
                    We charge 10% on each transaction. What you see is what you pay - no hidden fees.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">You Keep 90%</h4>
                  <p className="text-muted-foreground">
                    For every $100 earned, you keep $90. Set your own prices and earn what you deserve.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-purple-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Customer Protection</h4>
                  <p className="text-muted-foreground">
                    Our platform fee covers secure payments, dispute resolution, and customer support.
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
