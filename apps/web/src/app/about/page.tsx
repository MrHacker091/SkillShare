import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, Briefcase, CheckCircle2, Heart, Shield, Target, Users } from "lucide-react";

const stats = [
  { label: "Active Students", value: "50,000+", icon: Users },
  { label: "Projects Completed", value: "125,000+", icon: Briefcase },
  { label: "Universities", value: "500+", icon: Award },
  { label: "Countries", value: "75+", icon: Target },
];

const values = [
  {
    icon: Target,
    title: "Empowering Students",
    description: "We believe every student has unique talents worth sharing. Our platform provides the tools and opportunities for students to showcase their skills and earn while learning."
  },
  {
    icon: Heart,
    title: "Quality & Excellence",
    description: "We maintain high standards through our verification process, ensuring clients receive exceptional work while helping students build professional portfolios."
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "Built-in payment protection, dispute resolution, and transparent review systems create a safe environment for both students and clients to collaborate."
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-Founder",
    bio: "Former VP of Product at Upwork. Stanford MBA with a passion for student empowerment.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b635?w=128&h=128&fit=crop&crop=face",
    linkedin: "#"
  },
  {
    name: "Michael Chen",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer. MIT graduate building the future of student freelancing.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
    linkedin: "#"
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Community",
    bio: "Former community manager at Fiverr. Berkeley graduate focused on creator success.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
    linkedin: "#"
  },
  {
    name: "David Park",
    role: "Head of Product",
    bio: "Product leader from Airbnb. Carnegie Mellon alum building intuitive experiences.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    linkedin: "#"
  }
];

const milestones = [
  {
    year: "2022",
    title: "SkillShare Founded",
    description: "Started as a university project to connect student freelancers with local businesses."
  },
  {
    year: "2022",
    title: "First 100 Students",
    description: "Reached our first milestone with students from 10 universities across the US."
  },
  {
    year: "2023",
    title: "International Expansion",
    description: "Expanded to 15 countries, connecting students worldwide with global opportunities."
  },
  {
    year: "2023",
    title: "Series A Funding",
    description: "Raised $5M Series A to accelerate growth and enhance platform features."
  },
  {
    year: "2024",
    title: "50,000 Active Students",
    description: "Became the largest student freelancing platform with students from 500+ universities."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering the Next{" "}
              <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Generation of Creators
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              SkillShare is the world's largest marketplace connecting talented students with businesses
              and individuals who need exceptional digital services at affordable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Join as Student
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Hire Students
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                To create a world where every student can monetize their skills,
                gain real-world experience, and build successful careers while still in school.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  SkillShare began in 2022 when our founders, both former students themselves,
                  recognized a gap in the market. Talented students were struggling to find
                  meaningful work opportunities, while businesses needed affordable,
                  high-quality digital services.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  What started as a simple university project has grown into a global
                  platform serving over 50,000 students from 500+ universities worldwide.
                  We've facilitated over $10M in earnings for student creators while
                  helping thousands of businesses access fresh, innovative talent.
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Verified student creators</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Payment protection guarantee</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">24/7 customer support</span>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Journey</h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in building the world's largest student freelancing platform
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-8 items-start">
                  <div className="shrink-0">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground">
                Passionate individuals building the future of student entrepreneurship
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <Badge variant="outline" className="mb-4">{member.role}</Badge>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whether you're a student looking to earn while you learn, or a business
            seeking fresh talent, SkillShare is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Selling Your Skills
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 text-white border-white hover:bg-white hover:text-primary">
              Find Student Talent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
