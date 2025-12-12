"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>
                CBI Technologies Limited ("we", "us", "our") operates the Business Registration Portal. This Privacy
                Policy explains how we collect, use, disclose, and otherwise handle your personal information when you
                use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p>We collect information you provide directly, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal identification information (names, date of birth, email, phone)</li>
                <li>Business information (business name, address, activity)</li>
                <li>Government ID information (NIN, passport, driver's license)</li>
                <li>Documents (identification, photos, proof of address)</li>
                <li>Payment information (processed securely via payment gateway)</li>
                <li>Technical data (IP address, browser type, usage patterns)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your CAC business registration</li>
                <li>Verify your identity and information</li>
                <li>Communicate about your application status</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Improve our services and website</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Data Protection</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encryption at rest for sensitive data</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p>
                We retain your personal information for the duration necessary to provide our services and comply with
                legal obligations. Generally, we retain registration data for 7 years as required by regulatory
                standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Sharing Your Information</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Corporate Affairs Commission (CAC) for registration processing</li>
                <li>Payment service providers for transaction processing</li>
                <li>Legal authorities when required by law</li>
                <li>Third-party service providers under strict confidentiality agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Your Rights</h2>
              <p>Under NDPR and applicable laws, you have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Rectify inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Lodge complaints with data protection authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Contact Us</h2>
              <p>For privacy concerns or inquiries:</p>
              <div className="mt-4 p-4 rounded-lg bg-secondary border border-border">
                <p className="font-semibold text-foreground">CBI Technologies Limited</p>
                <p>Email: support@cbitechnologiesltd.com</p>
                <p>Phone: +2348112936083</p>
              </div>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-secondary border border-border">
            <p className="text-sm text-muted-foreground">
              Read our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
