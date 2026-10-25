import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate({ to: "/chat" });
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const res = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, name || email.split("@")[0]);
    setLoading(false);
    if (res.error) { toast.error(res.error); return; }
    if (mode === "signup") {
      toast.success("Conta criada! Verifique seu e-mail se solicitado.");
    } else {
      toast.success("Bem-vindo de volta!");
    }
    navigate({ to: "/chat" });
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative z-10 h-full flex flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl glass-strong grid place-items-center"><Sparkles className="w-5 h-5" /></div>
            <span className="font-display text-2xl">TurisRio</span>
          </Link>
          <div>
            <h2 className="font-display text-5xl leading-tight">O Rio te espera.</h2>
            <p className="mt-3 opacity-90 max-w-sm">Crie sua conta e desbloqueie roteiros, favoritos e seu histórico de conversas.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-card">
          <h1 className="font-display text-3xl mb-1">{mode === "signin" ? "Entrar" : "Criar conta"}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signin" ? "Continue sua jornada carioca." : "Comece sua aventura no Rio."}
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nome</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-accent outline-none" placeholder="Como devo te chamar?" maxLength={60} />
              </div>
            )}
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-accent outline-none" placeholder="voce@email.com" maxLength={120} />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Senha</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary border border-transparent focus:border-accent outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-soft hover:opacity-90 transition disabled:opacity-50">
              {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-5 w-full text-sm text-muted-foreground hover:text-foreground">
            {mode === "signin" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
