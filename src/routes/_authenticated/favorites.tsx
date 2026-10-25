import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  component: FavoritesPage,
});

type Fav = { id: string; name: string; category: string | null; description: string | null; created_at: string };

function FavoritesPage() {
  const { user } = useAuth();
  const [favs, setFavs] = useState<Fav[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("favorites").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setFavs((data as Fav[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  async function remove(id: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (error) toast.error("Erro ao remover");
    else { setFavs((f) => f.filter((x) => x.id !== id)); toast.success("Removido"); }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pb-20">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-foreground/70 font-medium">Sua coleção</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">Favoritos</h1>
        <p className="text-muted-foreground mt-2">Lugares e ideias que você guardou do concierge.</p>
      </header>
      {loading ? (
        <p className="text-muted-foreground">Carregando…</p>
      ) : favs.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center shadow-card">
          <Heart className="w-10 h-10 mx-auto text-accent mb-3" />
          <p className="text-muted-foreground">Você ainda não salvou nada. Converse com o concierge e clique em "Salvar".</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {favs.map((f) => (
            <article key={f.id} className="glass rounded-3xl p-6 shadow-card hover:shadow-glow transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {f.category && <span className="text-[10px] uppercase tracking-widest font-semibold text-accent-foreground/80">{f.category}</span>}
                  <h3 className="font-display text-xl mt-1">{f.name}</h3>
                </div>
                <button onClick={() => remove(f.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition" aria-label="Remover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {f.description && <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap line-clamp-6">{f.description}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
