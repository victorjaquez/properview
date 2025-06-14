import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-24 bg-gradient-to-br from-muted/30 to-transparent">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4 lg:pl-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Elevate Your Real Estate Business with ProperView
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                The all-in-one platform for agents to manage listings, track
                inquiries, and gain valuable insights. Focus on selling, we'll
                handle the rest.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/dashboard" prefetch={false}>
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#features" prefetch={false}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[400px]:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <Image
            src="/home.png"
            priority
            width="600"
            height="600"
            alt="Home Image"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
          />
        </div>
      </div>
    </section>
  );
}
