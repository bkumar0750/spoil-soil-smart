import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Satellite, Droplets, TreeDeciduous, BarChart3, Map, Database, ArrowRight, Shield, Award, Globe } from "lucide-react";
import heroImage from "@/assets/hero-reclamation.jpg";
import { AreaAnalysisForm } from "@/components/AreaAnalysisForm";
import { AnalysisResults } from "@/components/AnalysisResults";

const Home = () => {
  const [analysisData, setAnalysisData] = useState<any>(null);

  const features = [
    {
      icon: Satellite,
      title: "Satellite Data Integration",
      description: "Sentinel-1 SAR and Sentinel-2 MSI for high-resolution soil moisture estimation and vegetation monitoring.",
    },
    {
      icon: Droplets,
      title: "Soil Moisture Prediction",
      description: "ML models trained on field data to predict soil moisture at multiple depths across mine overburden.",
    },
    {
      icon: TreeDeciduous,
      title: "Species Suitability",
      description: "Multi-criteria analysis combining moisture, soil chemistry, and topography for optimal species selection.",
    },
    {
      icon: Map,
      title: "Interactive Mapping",
      description: "Visualize predictions, suitability zones, and uncertainty maps with interactive GIS capabilities.",
    },
    {
      icon: BarChart3,
      title: "Model Performance",
      description: "Track model accuracy, feature importance, and validation metrics with comprehensive analytics.",
    },
    {
      icon: Database,
      title: "Multi-Mine Support",
      description: "Upload and manage datasets for any mine worldwide with automated validation and quality scoring.",
    },
  ];

  const stats = [
    { value: "10m", label: "Spatial Resolution", sublabel: "Sentinel-2 MSI" },
    { value: "R² > 0.96", label: "Model Accuracy", sublabel: "AI-Ensemble" },
    { value: "120+", label: "Training Samples", sublabel: "Monthly Composites" },
    { value: "5", label: "Feature Inputs", sublabel: "LST, NDVI, Rainfall, Slope, TWI" },
  ];

  const trustItems = [
    { icon: Shield, text: "Peer-reviewed methodology" },
    { icon: Award, text: "CMIP6 climate projections" },
    { icon: Globe, text: "Open satellite data (ESA/NASA)" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="px-3 py-1 text-xs font-semibold tracking-wide border-primary/30 text-primary">
                M.Tech Research Project
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                Soil Moisture Prediction for{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Mine Reclamation
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Advanced remote sensing and machine learning platform for predicting soil moisture and species suitability on mine overburden dumps for successful afforestation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all gap-2">
                  <Link to="/data">Explore Data <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/predictions">View Predictions</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 pt-4">
                {trustItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 to-accent/15 blur-3xl rounded-3xl" />
              <img
                src={heroImage}
                alt="Mine reclamation site with vegetation recovery showing green plants growing on former mine overburden"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border border-border/50"
                loading="eager"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-xl p-3 border border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">Jharia Coalfield, Jharkhand</span>
                  <Badge variant="secondary" className="text-[10px]">Active Monitoring</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/20">
        <div className="container py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-1">
                <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
                <div className="text-sm font-medium">{stat.label}</div>
                <div className="text-[11px] text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center space-y-3 mb-12">
            <Badge variant="outline" className="mb-2">Platform Capabilities</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comprehensive Analysis Tools
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Integrating remote sensing, field data, and machine learning for data-driven reclamation decisions
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/40">
                  <CardHeader className="pb-3">
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="mb-2">Live Analysis</Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Analyze Your Mine Area
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get real-time soil moisture analysis and tree growth predictions using satellite data and ML models
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AreaAnalysisForm onAnalysisComplete={setAnalysisData} />
          </div>

          {analysisData && (
            <div className="max-w-6xl mx-auto">
              <AnalysisResults data={analysisData} />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Ready to Explore?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Access comprehensive datasets, train prediction models, and generate suitability maps for mine reclamation planning.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/model">Train Models <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/data">Browse Datasets</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
