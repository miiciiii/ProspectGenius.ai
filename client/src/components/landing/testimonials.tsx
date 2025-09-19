export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">What Our Users Say</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <blockquote className="rounded-lg border border-border p-6 shadow-sm">
            <p className="text-lg text-muted-foreground">
              “This platform changed how we manage our funding pipeline. 
              It’s like having a full operations team.”
            </p>
            <footer className="mt-4 font-semibold">— Sarah L., Founder</footer>
          </blockquote>
          <blockquote className="rounded-lg border border-border p-6 shadow-sm">
            <p className="text-lg text-muted-foreground">
              “Clean, modern, and intuitive. The dark mode is gorgeous.”
            </p>
            <footer className="mt-4 font-semibold">— David R., Investor</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
