import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { User as UserIcon, MessageCircle, Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [stats, setStats] = useState({ conv: 0, fav: 0 });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).single().then(({ data }) => {
      if (data) setName(data.display_name ?? "");
    });
    Promise.all([
      supabase.from("conversations").select("id", { count: "exact", head: true }),
      supabase.from("favorites").select("id", { count: "exact", head: true }),
    ]).then(([c, f]) => setStats({ conv: c.count ?? 0, fav: f.count ?? 0 }));
  }, [user]);

  async function save() {
    const { error } = await supabase.from("profiles").update({ display_name: name }).eq("id", user!.id);
    if (error) toast.error("Erro ao salvar"); else toast.success("Perfil atualizado");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pb-20">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70 font-medium">Sua conta</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Perfil</h1>
      </header>

      <div className="glass rounded-3xl p-8 shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-hero-gradient grid place-items-center shadow-glow">
            <UserIcon className="w-7 h-7 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl truncate">{name || user?.email}</h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground">Nome de exibição</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className="mt-1 w-full px-4 py-3 rounded-xl bg-secondary outline-none focus:ring-2 focus:ring-accent" />
        <div className="flex gap-2 mt-4">
          <button onClick={save} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-soft">Salvar</button>
          <button onClick={signOut} className="px-5 py-2.5 rounded-xl bg-secondary font-medium">Sair</button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <div className="glass rounded-3xl p-6 shadow-card">
          <MessageCircle className="w-6 h-6 text-primary mb-2" />
          <p className="text-3xl font-display">{stats.conv}</p>
          <p className="text-sm text-muted-foreground">Conversas salvas</p>
        </div>
        <div className="glass rounded-3xl p-6 shadow-card">
          <Heart className="w-6 h-6 text-accent mb-2" />
          <p className="text-3xl font-display">{stats.fav}</p>
          <p className="text-sm text-muted-foreground">Favoritos</p>
        </div>
      </div>
    </div>
  );
}
