"use client"
import Image from "next/image"
import cbiLogo from "../public/assets/cbi-logo.png"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CBI</span>
              </div>
              <span className="font-semibold text-foreground">CBI Technologies</span> */}
              <Image src={cbiLogo} alt="CBI Logo" className="w-32 h-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering businesses to achieve CAC compliance and deploy PoS solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/status" className="text-muted-foreground hover:text-primary transition-colors">
                  Check Status
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/support" className="text-muted-foreground hover:text-primary transition-colors">
                  Support Center
                </a>
              </li>
              <li>
                <a href="mailto:support@cbitechnologiesltd.com" className="text-muted-foreground hover:text-primary transition-colors">
                  Email Support
                </a>
              </li>
              <li>
                <a href="tel:+2348112936083" className="text-muted-foreground hover:text-primary transition-colors">
                  Call Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} CBI Technologies Limited. All rights reserved. This portal is dedicated to CAC business
            registration only.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-foreground">CBI Technologies Ltd</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
