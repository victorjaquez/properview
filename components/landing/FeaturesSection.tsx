import { Eye, BarChart3, MessageSquare, CheckCircle } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: 'Effortless Listing Management',
      description:
        'Easily add, update, and manage all your property listings in one centralized place.',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: 'Seamless Inquiry Tracking',
      description:
        'Never miss a lead. Track all potential buyer inquiries and manage communication effectively.',
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Insightful Analytics',
      description:
        'Understand your listing performance with clear, concise analytics and reporting.',
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: 'User-Friendly Interface',
      description:
        'A modern, clean, and intuitive design built for real estate professionals.',
    },
  ];

  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 bg-primary/10 dark:bg-primary/20"
    >
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary-foreground">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why Choose ProperView?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              ProperView is designed to simplify your workflow, boost your
              productivity, and help you close more deals.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="grid gap-1 p-6 rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                {feature.icon}
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
