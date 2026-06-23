import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Donut } from "@/components/animations/Donut";
import { socialLinks } from "@/lib/social";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export function AboutMe() {
  return (
    <section className="py-32 relative overflow-hidden bg-dot-accent">
      <FloatingParticles count={20} />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16 text-center">
          <ScrollReveal>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl text-balance text-foreground">
              About Me
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal className="flex items-center justify-center">
            <Donut />
          </ScrollReveal>

          <div className="flex flex-col justify-center">
            <ScrollReveal>
              <p className="mb-4 leading-relaxed text-foreground/80 text-pretty max-w-[65ch]">
                I&apos;m a student with a passion for science, technology, and understanding how things work. This is a place where I share ideas, projects, and things I&apos;ve learned along the way.
              </p>
              <p className="mb-6 leading-relaxed text-foreground/80 text-pretty max-w-[65ch]">
                When I&apos;m not studying, you&apos;ll usually find me exploring new concepts, experimenting with technology, playing games, or diving down rabbit holes that started with a simple question.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-6 flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-accent/30 hover:text-accent hover:shadow-[0_0_15px_-6px_rgba(99,102,241,0.3)]"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
