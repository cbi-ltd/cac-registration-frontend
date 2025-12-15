"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { CheckCircle2, Zap, Shield, Clock, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="animate-slide-up space-y-8">
              <div className="space-y-4">
                <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
                  Business Registration Portal
                </h1>
                <p className="text-balance text-xl text-muted-foreground max-w-2xl">
                  Register your business with CAC to qualify for PoS terminal deployment. Fast, secure, and compliant
                  registration for Nigerian merchants and agents.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Register New Business
                </Link>
                <Link
                  href="/status"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all duration-200"
                >
                  Check Application Status
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-8 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">CAC Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Quick Processing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Complete your CAC business registration in 7 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Check Availability",
                  description: "Verify your preferred business names against CAC records",
                },
                {
                  step: 2,
                  title: "Applicant Info",
                  description: "Provide your personal and identification details",
                },
                {
                  step: 3,
                  title: "Business Details",
                  description: "Enter your business information and objectives",
                },
                {
                  step: 4,
                  title: "Upload Documents",
                  description: "Submit required identification and address proof",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  step: 5,
                  title: "Review & Confirm",
                  description: "Review all information and confirm submission",
                },
                {
                  step: 6,
                  title: "Process Payment",
                  description: "Securely pay registration and service fees",
                },
                {
                  step: 7,
                  title: "Track Status",
                  description: "Monitor your application status in real-time",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="bg-background rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                    <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mt-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Why Choose This Portal?</h2>

                <div className="space-y-4">
                  {[
                    {
                      icon: Clock,
                      title: "Lightning Fast",
                      description: "Average registration time under 15 minutes with auto-save functionality",
                    },
                    {
                      icon: Shield,
                      title: "Bank-Level Security",
                      description: "SSL/TLS encryption and GDPR/NDPR compliance for all data",
                    },
                    {
                      icon: TrendingUp,
                      title: "95% Success Rate",
                      description: "High API integration success rate with CAC through Oasis VAS",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Complete Guidance",
                      description: "Clear instructions and tooltips throughout the entire process",
                    },
                  ].map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary mt-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary rounded-2xl p-8 space-y-6 border border-primary/20">
                <div className="space-y-2">
                  <div className="h-2 bg-primary/30 rounded-full w-3/4 animate-pulse"></div>
                  <div className="h-2 bg-primary/20 rounded-full w-1/2 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-background rounded-lg border border-border"></div>
                  ))}
                </div>
                <div className="h-10 bg-primary/20 rounded-lg mt-4"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-primary">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground text-balance">
              Ready to Register Your Business?
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Join hundreds of merchants and agents who have successfully registered with CAC through our portal.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Registration Now
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-secondary/50">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about our registration portal
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How long does registration take?",
                  a: "Most registrations are completed in under 15 minutes. The total time depends on document upload speed and CAC processing times.",
                },
                {
                  q: "What documents do I need?",
                  a: "You'll need: valid ID (NIN, Passport, Driver's License, Voter's Card), passport photo, proof of address, and a signed consent letter.",
                },
                {
                  q: "What are the registration fees?",
                  a: "CAC Registration Fee: ₦10,000 | Service Charge: ₦2,000 | VAT: As applicable. Total varies based on your location.",
                },
                {
                  q: "Can I edit my information after submission?",
                  a: "Yes, you can continue editing your application if payment hasn't been completed. After payment, contact support for changes.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-background rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
