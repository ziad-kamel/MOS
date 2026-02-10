import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/data-acess/auth-user";
import {
  ArrowRight,
  Settings,
  BarChart3,
  ShieldCheck,
  Users,
  Factory,
  CheckCircle2,
  Box,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToogleBtn/ThemeToogleBtn";

export default async function Page() {
  const loggedInUser = await getCurrentUser();

  return (
    <div className='flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30'>
      {/* Navigation */}
      <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary rounded-lg p-1.5'>
              <Factory className='h-6 w-6 text-primary-foreground' />
            </div>
            <span className='text-xl font-bold tracking-tight'>MOS</span>
          </div>

          <div className='flex items-center gap-4'>
            <ThemeToggle />
            {loggedInUser ? (
              <Button asChild variant='default' className='rounded-full px-6'>
                <Link href='/home'>Go to Dashboard</Link>
              </Button>
            ) : (
              <div className='flex items-center gap-3'>
                <Button
                  asChild
                  variant='ghost'
                  className='hidden sm:inline-flex'
                >
                  <Link href='/login'>Login</Link>
                </Button>
                <Button asChild className='rounded-full px-6'>
                  <Link href='/register'>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className='flex-1'>
        {/* Hero Section */}
        <section className='relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36'>
          <div className='absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary)_0%,transparent_100%)] opacity-[0.03]' />
          <div className='container mx-auto px-4 text-center'>
            <div className='inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 mb-6 text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-bottom-3 duration-1000'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
              </span>
              Now trusted by 500+ manufacturers worldwide
            </div>
            <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150'>
              Seamless Manufacturing,
              <br />
              Smarter Orders.
            </h1>
            <p className='max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300'>
              Connect brands with manufacturers through a powerful, transparent,
              and efficient order management system built for the modern
              industry.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500'>
              <Button
                asChild
                size='lg'
                className='rounded-full h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all'
              >
                <Link href={loggedInUser ? "/home" : "/register"}>
                  {loggedInUser ? "Explore MOS" : "Start Free Trial"}{" "}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-24 bg-muted/30'>
          <div className='container mx-auto px-4'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                Precision-built for every role
              </h2>
              <p className='text-muted-foreground max-w-xl mx-auto'>
                Whether you're a manufacturer or a brand, MOS provides the tools
                you need to scale your operations.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  icon: <BarChart3 className='h-6 w-6 ' />,
                  title: "Real-time Tracking",
                  description:
                    "Monitor every step of your production life-cycle from initial order to final delivery with sub-second updates.",
                },
                {
                  icon: <ShieldCheck className='h-6 w-6 ' />,
                  title: "Verified Networks",
                  description:
                    "Security is our priority. Connect only with vetted manufacturers and brands on our secure platform.",
                },
                {
                  icon: <Truck className='h-6 w-6 ' />,
                  title: "Streamlined Logistics",
                  description:
                    "Automated routing and sub-order management ensure your products get where they need to go, faster.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className='group p-8 rounded-2xl bg-background border hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1'
                >
                  <div className='mb-4 inline-block p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className='py-20'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
              {[
                { label: "Active Orders", value: "10K+" },
                { label: "Manufacturers", value: "2.4K" },
                { label: "Delivery Rate", value: "99.9%" },
                { label: "Countries", value: "45+" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className='text-4xl md:text-5xl font-black text-primary mb-2 line-clamp-1'>
                    {stat.value}
                  </p>
                  <p className='text-sm font-medium text-muted-foreground uppercase tracking-widest'>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-24'>
          <div className='container mx-auto px-4'>
            <div className='relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-16 text-center'>
              <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.15),transparent)]' />
              <div className='relative z-10'>
                <h2 className='text-3xl md:text-5xl font-bold mb-6'>
                  Ready to transform your production?
                </h2>
                <p className='text-background/70 max-w-xl mx-auto mb-10 text-lg'>
                  Join thousands of brands and manufacturers who have already
                  streamlined their operations with MOS.
                </p>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                  <Button
                    asChild
                    size='lg'
                    variant='secondary'
                    className='rounded-full h-12 px-8 text-base'
                  >
                    <Link href='/register'>Create Account</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-t py-12 bg-muted/20'>
        <div className='container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8'>
          <div className='flex items-center gap-2'>
            <Factory className='h-5 w-5 text-primary' />
            <span className='text-lg font-bold tracking-tight'>MOS</span>
          </div>
          <p className='text-sm text-muted-foreground'>
            © 2024 Manufacturer Order System. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-primary'
            >
              Privacy
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-primary'
            >
              Terms
            </Link>
            <Link
              href='#'
              className='text-sm text-muted-foreground hover:text-primary'
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
