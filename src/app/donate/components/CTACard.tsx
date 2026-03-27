import Button from "@/components/ui/Button/Button";

export default function CTACard() {
  return (
    <article className="bg-rose-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-5">
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
        Can't find a match?
      </h3>
      <p className="text-white/80 text-sm mb-6 leading-relaxed">
        Register as a universal donor to be notified the moment your blood type
        is needed in your area.
      </p>
      <Button variant="white" size="md">
        Register as Donor
      </Button>
    </article>
  );
}
