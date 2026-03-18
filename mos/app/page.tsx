import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Factory, Globe, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Welcome",
};

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex flex-col items-center justify-center">
      {/* Background ambient gradients */}
      <div className="absolute top-0 -translate-y-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] sm:w-[800px] sm:h-[600px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 translate-y-1/3 left-0 w-[400px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[300px] h-[400px] sm:w-[500px] sm:h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center text-center gap-10 py-20">
        
        {/* App Logo/Icon */}
        <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20 text-primary shadow-2xl shadow-primary/20 backdrop-blur-md animate-in zoom-in duration-1000">
          <Factory className="w-12 h-12" />
        </div>

        {/* Title & Quote */}
        <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500 drop-shadow-sm">MOS</span>
          </h1>
          <div className="relative">
            <span className="absolute -top-6 -left-4 sm:-left-8 text-6xl text-primary/20 font-serif">"</span>
            <p className="text-lg sm:text-2xl text-muted-foreground font-medium leading-relaxed italic px-4">
              Empowering seamless collaboration between brands and manufacturers. From the first order to the final delivery, we provide the tools to manage it all.
            </p>
            <span className="absolute -bottom-8 -right-4 sm:-right-8 text-6xl text-primary/20 font-serif">"</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <Link href="/home">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Supporting Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-12 sm:mt-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 fill-mode-both">
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-card/60 border border-border/50 shadow-sm backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-blue-500/10 mb-4">
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Global Network</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Connect with certified manufacturers and scale your brand worldwide with ease.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-card/60 border border-border/50 shadow-sm backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-primary/10 mb-4">
              <Factory className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Production Tracking</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Gain full visibility into your orders at every critical stage of the production cycle.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-card/60 border border-border/50 shadow-sm backdrop-blur-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="p-3 rounded-2xl bg-emerald-500/10 mb-4">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Secure Ecosystem</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">Built with enterprise-grade security to protect your business data and partnerships.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
