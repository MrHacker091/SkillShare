import { CreditCard, MessageCircle, Search, Star } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "Discover Talent",
      description: "Browse through thousands of student portfolios and find the perfect creator for your project needs.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "Connect & Collaborate",
      description: "Message creators directly, discuss your requirements, and get custom quotes for your project.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay securely through our platform with milestone-based payments and buyer protection.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Star,
      title: "Rate & Review",
      description: "Leave reviews and ratings to help other buyers and support amazing student creators.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
            How SkillShare Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect with talented student creators in four simple steps and bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/5 z-0" />
              )}

              <div className="relative bg-background rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border group-hover:-translate-y-2">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} mx-auto`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-medium">
            <span>Ready to get started?</span>
            <span className="text-primary">Join thousands of satisfied customers!</span>
          </div>
        </div>
      </div>
    </section>
  );
}