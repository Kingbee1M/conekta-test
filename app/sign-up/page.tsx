import { Metadata } from "next";
import SignUpForm from "@/app/components/SignUpForm";

export const metadata: Metadata = {
  title: "Create an Account | Conekta",
  description: "Join Conekta today to find verified properties and manage your rentals effortlessly.",
  openGraph: {
    title: "Create an Account | Conekta",
    description: "Join Conekta today to find verified properties and manage your rentals effortlessly.",
  },
};

export default function SignUpPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white py-12 flex items-center justify-center">
      {/* Structural visual details */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-tertiary-green/10 blur-3xl pointer-events-none" />

      <SignUpForm />
    </main>
  );
}