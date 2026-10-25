import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, MessageCircle, Heart, User, LogOut } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(96%,1100px)]">
      <nav className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between shadow-card">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-hero-gradient grid place-items-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">
            Turis<span className="text-gradient-sunset">Rio</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/" className="px-3 py-1.5 rounded-lg hover:bg-secondary transition" activeOptions={{ exact: true }} activeProps={{ className: "text-primary font-semibold" }}>
            Início
          </Link>
          {user && (
            <>
              <Link to="/chat" className="px-3 py-1.5 rounded-lg hover:bg-secondary transition flex items-center gap-1.5" activeProps={{ className: "text-primary font-semibold" }}>
                <MessageCircle className="w-4 h-4" /> Concierge
              </Link>
              <Link to="/favorites" className="px-3 py-1.5 rounded-lg hover:bg-secondary transition flex items-center gap-1.5" activeProps={{ className: "text-primary font-semibold" }}>
                <Heart className="w-4 h-4" /> Favoritos
              </Link>
              <Link to="/profile" className="px-3 py-1.5 rounded-lg hover:bg-secondary transition flex items-center gap-1.5" activeProps={{ className: "text-primary font-semibold" }}>
                <User className="w-4 h-4" /> Perfil
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="p-2 rounded-lg hover:bg-secondary transition"
              aria-label="Sair"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition shadow-soft">
              Entrar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
