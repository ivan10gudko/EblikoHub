import React from 'react';

interface ContactChannel {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
  isExternal: boolean;
}

const CONTACTS_CONFIG: ContactChannel[] = [
  {
    id: 'email',
    title: 'Email',
    subtitle: 'lb.softwaresup@gmail.com',
    href: 'mailto:lb.softwaresup@gmail.com',
    icon: '📧',
    isExternal: false,
  },
  {
    id: 'github',
    title: 'GitHub',
    subtitle: 'Contribute to the project',
    href: 'https://github.com/ivan10gudko/EblikoHub',
    icon: '🐙',
    isExternal: true,
  },
];

export function ContactPage() {
  return (
    <div className="min-h-[80vh] bg-background text-foreground transition-colors duration-200 flex flex-col items-center justify-start pt-16 md:pt-24">
      <div className="max-w-2xl w-full mx-auto p-6 space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            Contact Us
          </h1>
          <p className="text-foreground-muted text-lg max-w-md mx-auto leading-relaxed opacity-90">
            Have questions, suggestions, or just want to say hi? Feel free to reach out to us through any of the platforms below!
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTACTS_CONFIG.map((channel) => (
            <a 
              key={channel.id}
              href={channel.href}
              target={channel.isExternal ? "_blank" : undefined}
              rel={channel.isExternal ? "noreferrer" : undefined}
              className="flex items-center gap-4 p-4 bg-card hover:bg-accent/50 rounded-xl border border-border shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] group"
            >
              <span className="text-3xl select-none" role="img" aria-label={channel.title}>
                {channel.icon}
              </span>
              <div className="space-y-0.5">
                <h4 className="font-semibold text-xs text-foreground-muted uppercase tracking-wider">
                  {channel.title}
                </h4>
                <p className="text-primary group-hover:underline font-medium text-sm md:text-base transition-colors truncate">
                  {channel.subtitle}
                </p>
              </div>
            </a>
          ))}
        </section>

      </div>
    </div>
  );
}