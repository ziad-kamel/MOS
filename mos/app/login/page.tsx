import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";
import { ArrowLeft, Factory } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background'>
      {/* Background Orbs */}
      <div className='absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none' />
      <div className='absolute bottom-0 translate-y-1/2 right-1/4 w-[500px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none' />

      {/* Main Container */}
      <div className='relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-700'>
        {/* Card Component */}
        <div className='relative flex flex-col items-center bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-primary/5'>
          {/* Logo */}
          <div className='flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-inner'>
            <Factory className='w-8 h-8' />
          </div>

          <div className='text-center mb-8 space-y-2'>
            <h1 className='text-3xl font-extrabold tracking-tight'>
              Welcome Back
            </h1>
            <p className='text-sm text-muted-foreground font-medium'>
              Log in to your <span className='text-primary font-bold'>MOS</span>{" "}
              account
            </p>
          </div>

          <div className='w-full'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
