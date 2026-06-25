import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto bg-card p-8 rounded-2xl border border-border/60 shadow-xs">
        
        
        <div className="border-b border-border pb-6 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-foreground/50">
            Last updated: June 25, 2026
          </p>
        </div>

        
        <div className="flex flex-col gap-8 text-foreground/80 leading-relaxed text-sm sm:text-base">
          
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-primary uppercase tracking-wide">
              1. Information We Collect
            </h2>
            <p className="text-foreground/90">
              We only collect information that is necessary to provide and improve our services at Ebliko-Hub. This includes details you actively provide when creating an account, managing your Watchlist, or customizing your profile.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-primary uppercase tracking-wide">
              2. How We Use Your Data
            </h2>
            <p className="text-foreground/90">
              Your personal data, including your anime ratings, comments, and list statistics, is used solely to render your personal dashboard and dynamically sync your interactions across devices using safe storage solutions like local storage and secured databases.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-primary uppercase tracking-wide">
              3. Data Retention and Syncing
            </h2>
            <p className="text-foreground/90">
              Your filter preferences, design theme configurations (light or dark mode), and visual sessions are securely stored. We do not sell, trade, or transfer your analytical profile data to third-party tracking services.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-primary uppercase tracking-wide">
              4. Cookies and Theme Settings
            </h2>
            <p className="text-foreground/90">
              We use functional identifiers to preserve your active interface layouts (such as hiding or showing scrollbars, keeping filter states active, and identifying authorization scopes). You can manage or purge these states through your browser settings at any moment.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-primary uppercase tracking-wide">
              5. Contact Us
            </h2>
            <p className="text-foreground/90">
              If you have questions about this Privacy Policy or data flow optimizations within the application, feel free to contact our development core team directly through the support hub.
            </p>
          </section>

        </div>
        
      </div>
    </div>
  );
}