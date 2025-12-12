"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">Support Center</h1>
            <p className="text-lg text-muted-foreground">
              We're here to help. Find answers to your questions or contact our support team.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Email Support</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Send us an email and we'll respond within 24 hours</p>
              <a
                href="mailto:support@cbitechnologiesltd.com"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              > support@cbitechnologiesltd.com
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Phone Support</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Call our support team during business hours</p>
              <a
                href="tel:+2348112936083"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                +2348112936083
              </a>
            </div>

            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Business Hours</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="block">Monday - Friday: 9:00 AM - 5:00 PM</span>
                <span className="block">Saturday: 10:00 AM - 3:00 PM</span>
                <span className="block">Sunday: Closed</span>
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {[
                {
                  question: "How long does business registration take?",
                  answer:
                    "CAC business registration typically takes 2-5 working days after payment. You'll receive status updates via email.",
                },
                {
                  question: "What if my application is rejected?",
                  answer:
                    "If rejected, we'll provide detailed feedback. You can then make corrections and resubmit. A resubmission fee may apply.",
                },
                {
                  question: "Can I track my application status?",
                  answer:
                    "Yes! Use the Check Status page with your application reference number to track your registration progress.",
                },
                {
                  question: "Are the fees refundable?",
                  answer:
                    "Registration fees are non-refundable once submitted. However, you can cancel before final submission.",
                },
                {
                  question: "What documents do I need?",
                  answer:
                    "You need a valid ID, passport photo, proof of address, and a signed consent letter. Templates are provided.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "Yes, we use SSL/TLS encryption and comply with NDPR data protection requirements. Your data is stored securely.",
                },
              ].map((faq, index) => (
                <details key={index} className="group p-4 rounded-lg border border-border cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-foreground">
                    <span>{faq.question}</span>
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-4 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-secondary/50 rounded-lg p-8 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Common Issues & Solutions
            </h3>

            <div className="space-y-4">
              {[
                {
                  issue: "Payment gateway showing network error",
                  solution: "Check your internet connection and try again. If persistent, contact support.",
                },
                {
                  issue: "Application not submitted after payment",
                  solution:
                    "Wait 5 minutes for system processing. If still not submitted, use your reference to check status.",
                },
                {
                  issue: "Receiving 'Name Not Available' message",
                  solution: "Try alternative business names. Check with CAC if a similar name exists or is reserved.",
                },
                {
                  issue: "Document upload failing",
                  solution: "Ensure file is PDF/JPG/PNG, under 5MB, and not corrupted. Try a different file.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{item.issue}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-lg border-2 border-primary/30 bg-primary/5">
            <h3 className="text-lg font-semibold text-foreground mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is ready to assist. Reach out via email or phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@cbitechnologiesltd.com"
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Email Support
              </a>
              <a
                href="tel:+2348112936083"
                className="px-6 py-2.5 rounded-lg border border-primary text-primary font-medium hover:bg-primary/10 transition-colors text-center"
              >
                Call Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
