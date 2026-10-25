import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Sparkles, MapPin, Compass, Sun } from "lucide-react";
import heroImg from "@/assets/rio-hero.jpg";
import cristoImg from "@/assets/dest-cristo.jpg";
import copaImg from "@/assets/dest-copacabana.jpg";
import paoImg from "@/assets/dest-paodeacucar.jpg";
import lapaImg from "@/assets/dest-lapa.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const destinations = [
  { name: "Cristo Redentor", desc: "O abraço do Rio acima das nuvens.", img: cristoImg, tag: "Ícone" },
  { name: "Copacabana", desc: "A princesinha do mar e seu calçadão eterno.", img: copaImg, tag: "Praia" },
  { name: "Pão de Açúcar", desc: "Bondinho, baía e o pôr-do-sol mais bonito.", img: paoImg, tag: "Mirante" },
  { name: "Escadaria Selarón", desc: "Lapa em mosaico, alma e arte.", img: lapaImg, tag: "Cultura" },
];

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-end overflow-hidden">
        <img src={heroImg} alt="Rio de Janeiro ao pôr-do-sol" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-20 pt-40">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Concierge de IA · Rio de Janeiro
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              O Rio, <span className="text-gradient-sunset italic">curado</span><br />
              para você.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
              Roteiros sob medida, praias secretas, gastronomia, cultura e dicas locais — guiados por uma IA que respira a Cidade Maravilhosa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/chat" className="group px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] transition flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Começar a explorar
              </Link>
              <Link to="/login" className="px-6 py-3.5 rounded-2xl glass-strong font-medium hover:bg-card transition">
                Criar conta grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Compass, title: "Roteiros sob medida", text: "Manhã na praia, almoço em Ipanema, samba em Lapa. Personalizado em segundos." },
            { icon: MapPin, title: "Lugares de verdade", text: "Recomendações honestas — do clássico ao escondido — com dicas de segurança." },
            { icon: Sun, title: "Inspiração tropical", text: "Praias, trilhas, mirantes e pôr-do-sol. O Rio que só os locais conhecem." },
          ].map((p) => (
            <div key={p.title} className="glass rounded-3xl p-7 shadow-card hover:shadow-glow transition">
              <div className="w-12 h-12 rounded-2xl bg-ocean-gradient grid place-items-center mb-4">
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-foreground/70 font-medium">Destinos em destaque</p>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Curated horizons</h2>
          </div>
          <Link to="/chat" className="text-sm font-medium text-primary hover:underline">Pedir mais sugestões →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((d, i) => (
            <article key={d.name} className={`group relative overflow-hidden rounded-3xl shadow-card hover:shadow-glow transition ${i % 2 === 1 ? "lg:translate-y-8" : ""}`}>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={d.img} alt={d.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase tracking-widest font-semibold glass rounded-full px-2.5 py-1 text-foreground">{d.tag}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 text-background">
                <h3 className="font-display text-2xl">{d.name}</h3>
                <p className="text-sm opacity-85 mt-1">{d.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-16 bg-hero-gradient shadow-glow">
          <div className="relative z-10 max-w-2xl text-primary-foreground">
            <h2 className="font-display text-4xl md:text-5xl">Seu próximo dia perfeito no Rio começa aqui.</h2>
            <p className="mt-4 opacity-90">Converse com o concierge, salve seus favoritos e construa um roteiro que parece feito só pra você.</p>
            <Link to="/chat" className="inline-flex items-center gap-2 mt-7 px-6 py-3.5 rounded-2xl bg-background text-foreground font-medium hover:scale-[1.02] transition">
              <Sparkles className="w-4 h-4" /> Conversar com o concierge
            </Link>
          </div>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/40 blur-3xl animate-float" />
        </div>
      </section>

      <footer className="text-center text-xs text-muted-foreground py-8">
        © {new Date().getFullYear()} TurisRio · Feito com ☀️ no Rio de Janeiro
      </footer>
    </div>
  );
}
