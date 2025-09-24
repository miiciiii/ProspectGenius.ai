import { CheckCircle } from "lucide-react";

const features = [
  { title: "Team Management", desc: "Easily manage team roles and access." },
  { title: "Real-time Insights", desc: "Track funding rounds and growth metrics." },
  { title: "Secure Platform", desc: "Enterprise-grade security and reliability." },
];

export default function Features() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-foreground">
          Why Choose Us?
        </h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center">
              <CheckCircle className="h-10 w-10 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
