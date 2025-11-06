import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Video, Brain, Share2, Clock, Globe, LogIn } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description: "Advanced machine learning models detect key moments across multiple sports automatically",
    },
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Generate highlights within seconds of the action with ultra-low latency processing",
    },
    {
      icon: Globe,
      title: "Multi-Sport Support",
      description: "Basketball, football, cricket, and more - with universal event detection",
    },
    {
      icon: Share2,
      title: "One-Click Publishing",
      description: "Distribute to YouTube, TikTok, Instagram, and more with a single click",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">LiveClip AI</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Universal Sports Highlight Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              LiveClip AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automatically generate, package, and distribute high-quality sports highlights in real-time with AI-powered video processing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" className="text-lg px-8">
                  View Pricing
                </Button>
              </Link>
              <Link to="/admin">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Video className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <Link to="/admin" className="hover:text-foreground transition-colors">
                Admin View
              </Link>
              <span>•</span>
              <Link to="/client" className="hover:text-foreground transition-colors">
                Client View
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to automate sports highlight generation at scale
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">5-10s</p>
              <p className="text-sm text-muted-foreground">Highlight Latency</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">98%+</p>
              <p className="text-sm text-muted-foreground">Detection Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">3</p>
              <p className="text-sm text-muted-foreground">Aspect Ratios</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">100%</p>
              <p className="text-sm text-muted-foreground">Automated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Experience the future of sports highlight generation with LiveClip AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg" className="text-lg px-8">
                View Pricing Plans
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
