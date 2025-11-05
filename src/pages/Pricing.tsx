import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Check, X, Zap, ArrowRight, Video } from "lucide-react";

const Pricing = () => {
  const tiers = [
    {
      name: "Bronze",
      price: 299,
      description: "Perfect for small broadcasters and content creators",
      popular: false,
      features: [
        { text: "2 concurrent live feeds", included: true },
        { text: "Up to 50 highlights/day", included: true },
        { text: "720p video output", included: true },
        { text: "2 sports models", included: true },
        { text: "Standard watermark", included: true },
        { text: "5-10s latency", included: true },
        { text: "Email support", included: true },
        { text: "API access (1,000 req/day)", included: true },
        { text: "1080p video output", included: false },
        { text: "Custom AI model training", included: false },
        { text: "Priority processing", included: false },
        { text: "White-label branding", included: false },
      ],
    },
    {
      name: "Silver",
      price: 799,
      description: "Ideal for professional sports organizations",
      popular: true,
      features: [
        { text: "10 concurrent live feeds", included: true },
        { text: "Up to 500 highlights/day", included: true },
        { text: "1080p video output", included: true },
        { text: "All sports models", included: true },
        { text: "Custom watermark", included: true },
        { text: "3-5s latency", included: true },
        { text: "Priority email & chat support", included: true },
        { text: "API access (10,000 req/day)", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Multi-language subtitles", included: true },
        { text: "Custom AI model training", included: false },
        { text: "White-label branding", included: false },
      ],
    },
    {
      name: "Gold",
      price: 1999,
      description: "Enterprise solution for major broadcasters",
      popular: false,
      features: [
        { text: "Unlimited concurrent live feeds", included: true },
        { text: "Unlimited highlights", included: true },
        { text: "4K video output", included: true },
        { text: "All sports models + custom training", included: true },
        { text: "White-label branding", included: true },
        { text: "<3s latency", included: true },
        { text: "24/7 dedicated support", included: true },
        { text: "Unlimited API access", included: true },
        { text: "Advanced analytics & insights", included: true },
        { text: "Multi-language subtitles", included: true },
        { text: "Custom AI model training", included: true },
        { text: "Dedicated account manager", included: true },
      ],
    },
  ];

  const allFeatures = [
    "Video processing capacity",
    "Highlights per day",
    "Video output quality",
    "AI sports models",
    "Watermark options",
    "Processing latency",
    "Support level",
    "API requests",
    "Analytics dashboard",
    "Multi-language support",
    "Custom model training",
    "White-label branding",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">LiveClip AI</h1>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
              <Link to="/client">
                <Button variant="outline" size="sm">Client</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Flexible Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-muted-foreground">
              Scale your sports highlight generation with plans designed for every need—from content creators to major broadcasters
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {tiers.map((tier, index) => (
              <Card
                key={tier.name}
                className={`p-8 bg-gradient-to-br from-card to-card/50 border-border/50 relative animate-fade-in hover:border-primary/30 transition-all ${
                  tier.popular ? "scale-105 border-primary/50 shadow-[0_0_50px_rgba(96,165,250,0.15)]" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="border-y border-border bg-card/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Detailed Feature Comparison</h2>
              <p className="text-muted-foreground">See exactly what's included in each plan</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold">Bronze</th>
                    <th className="text-center py-4 px-6 font-semibold">Silver</th>
                    <th className="text-center py-4 px-6 font-semibold">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, idx) => (
                    <tr key={feature} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-6 text-muted-foreground">{feature}</td>
                      <td className="py-4 px-6 text-center">
                        {tiers[0].features[idx]?.included ? (
                          <Check className="h-5 w-5 text-accent mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {tiers[1].features[idx]?.included ? (
                          <Check className="h-5 w-5 text-accent mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {tiers[2].features[idx]?.included ? (
                          <Check className="h-5 w-5 text-accent mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I upgrade or downgrade my plan?",
                  a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and can arrange wire transfers for enterprise customers.",
                },
                {
                  q: "Is there a free trial available?",
                  a: "Yes! All new customers get a 14-day free trial with full access to Silver plan features.",
                },
                {
                  q: "What happens if I exceed my plan limits?",
                  a: "We'll notify you when you're approaching your limits. You can upgrade anytime or purchase additional capacity as needed.",
                },
              ].map((faq, idx) => (
                <Card key={idx} className="p-6 bg-gradient-to-br from-card to-card/50 border-border/50">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Video className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Sports Content?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
