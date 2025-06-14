import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to Streamline Your Real Estate Operations?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join ProperView today and experience the future of real estate
              management. Sign up for a free trial or explore our flexible
              pricing plans.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Link href="/dashboard" prefetch={false}>
              <Button size="lg" className="w-full">
                Sign Up for Free Trial
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
