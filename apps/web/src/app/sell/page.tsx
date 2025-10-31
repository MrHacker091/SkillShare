'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Check, Clock, DollarSign, Shield, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SellPage() {
  const [selectedPlan, setSelectedPlan] = useState('basic')

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      title: "Earn Money",
      description: "Set your own prices and keep 95% of what you earn"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Global Reach",
      description: "Access to thousands of potential customers worldwide"
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Secure Payments",
      description: "Protected payments with 24/7 fraud monitoring"
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "Flexible Schedule",
      description: "Work on your own terms and set your availability"
    }
  ]

  const plans = [
    {
      id: 'basic',
      name: 'Basic Seller',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'List up to 5 projects',
        '5% platform fee',
        'Basic support',
        'Standard payment processing'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Seller',
      price: '$29/month',
      description: 'For serious creators',
      features: [
        'Unlimited projects',
        '3% platform fee',
        'Priority support',
        'Advanced analytics',
        'Custom portfolio page',
        'Promoted listings'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'For agencies and teams',
      features: [
        'Everything in Pro',
        '2% platform fee',
        'Dedicated account manager',
        'API access',
        'White-label options',
        'Custom contracts'
      ]
    }
  ]

  const successStories = [
    {
      name: 'Sarah Johnson',
      title: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
      earnings: '$12,500',
      projects: 47,
      rating: 4.9,
      quote: "SkillShare helped me turn my design skills into a thriving freelance business!"
    },
    {
      name: 'Marcus Chen',
      title: 'Web Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      earnings: '$8,900',
      projects: 32,
      rating: 4.8,
      quote: "The platform made it easy to find clients and showcase my work professionally."
    },
    {
      name: 'Emily Rodriguez',
      title: 'Content Writer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      earnings: '$6,200',
      projects: 89,
      rating: 5.0,
      quote: "I love the flexibility and the quality of clients I work with here."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Turn Your
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent"> Skills</span> into
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent"> Income</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of student creators earning money by selling their digital projects,
              services, and creative work to a global audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?type=creator">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600">
                  Start Selling Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/creators">
                <Button variant="outline" size="lg">
                  See Success Stories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Sell on SkillShare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Choose Your Plan</h2>
            <p className="text-center text-muted-foreground mb-12">
              Start free and upgrade as you grow your business
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all ${selectedPlan === plan.id ? 'ring-2 ring-blue-600 shadow-lg' : 'hover:shadow-md'
                    } ${plan.popular ? 'border-blue-600' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full mt-6"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={story.avatar} alt={story.name} />
                    <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{story.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{story.title}</p>

                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-green-600">{story.earnings}</div>
                      <div className="text-xs text-muted-foreground">Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">{story.projects}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {story.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <p className="text-sm italic text-muted-foreground">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Creative Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of student creators who are already earning with their skills
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?type=creator">
                <Button size="lg" variant="secondary">
                  Create Seller Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}