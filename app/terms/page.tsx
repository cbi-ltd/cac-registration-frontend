"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Terms & Conditions</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this Business Registration Portal, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on the
                Business Registration Portal for personal, non-commercial transitory viewing only. This is the grant of
                a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the portal</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Disclaimer</h2>
              <p>
                The materials on the Business Registration Portal are provided on an "as is" basis. CBI Technologies
                makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties
                including, without limitation, implied warranties or conditions of merchantability, fitness for a
                particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Limitations</h2>
              <p>
                In no event shall CBI Technologies or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out of the use
                or inability to use the materials on the Business Registration Portal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on the Business Registration Portal could include technical, typographical, or
                photographic errors. CBI Technologies does not warrant that any of the materials on the portal are
                accurate, complete, or current. CBI Technologies may make changes to the materials contained on the
                portal at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Links</h2>
              <p>
                CBI Technologies has not reviewed all of the sites linked to the portal and is not responsible for the
                contents of any such linked site. The inclusion of any link does not imply endorsement by CBI
                Technologies of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Modifications</h2>
              <p>
                CBI Technologies may revise these terms of service for the portal at any time without notice. By using
                the portal, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the Federal
                Republic of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that
                location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. CAC Registration Disclaimer</h2>
              <p>
                This portal is an intermediary service for CAC business name registration. We are not affiliated with or
                endorsed by the Corporate Affairs Commission. All registration decisions and final approval rest with
                CAC. CBI Technologies is not liable for rejections or delays by CAC.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">10. Payment Terms</h2>
              <p>
                All fees are payable through the portal's secure payment gateway. Payments are non-refundable except
                where required by law. A receipt will be provided for all successful transactions. Payment is required
                before application submission to CAC.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">11. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information in your registration</li>
                <li>Not use the portal for any illegal purposes</li>
                <li>Not upload malicious code or viruses</li>
                <li>Not attempt to gain unauthorized access to the portal</li>
                <li>Maintain confidentiality of your application reference</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">12. Contact Information</h2>
              <div className="mt-4 p-4 rounded-lg bg-secondary border border-border">
                <p className="font-semibold text-foreground">For inquiries about these Terms & Conditions:</p>
                <p>Email: legal@cbi.ng</p>
                <p>Phone: +234 (0) 800 000 0000</p>
              </div>
            </section>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-secondary border border-border">
            <p className="text-sm text-muted-foreground">
              Read our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
