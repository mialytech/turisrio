import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { sendChatMessage } from "@/lib/chat.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Send, Plus, Sparkles, MessageCircle, Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatPage,
});

type Conv = { id: string; title: string; updated_at: string };
type Msg = { id?: string; role: "user" | "assistant"; content: string };

function ChatPage() {
  const { user } = useAuth();
  const sendFn = useServerFn(sendChatMessage);
  const [convs, setConvs] = useState<Conv[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversations
  useEffect(() => {
    if (!user) return;
    supabase.from("conversations").select("id,title,updated_at").order("updated_at", { ascending: false }).then(({ data }) => {
      if (data) setConvs(data);
    });
  }, [user]);

  // Load messages when active changes
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    supabase.from("messages").select("id,role,content").eq("conversation_id", activeId).order("created_at").then(({ data }) => {
      if (data) setMessages(data.map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content })));
    });
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    if (text.length > 2000) { toast.error("Mensagem muito longa (máx 2000)."); return; }
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const res = await sendFn({ data: { conversationId: activeId, message: text } });
      if (res.error) {
        toast.error(res.error);
        setMessages((m) => m.slice(0, -1));
      } else {
        if (!activeId && res.conversationId) {
          setActiveId(res.conversationId);
          const { data } = await supabase.from("conversations").select("id,title,updated_at").order("updated_at", { ascending: false });
          if (data) setConvs(data);
        }
        setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Falha ao enviar.");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  async function saveFavorite(content: string) {
    const name = content.split("\n")[0].replace(/[#*_`]/g, "").slice(0, 80) || "Sugestão do TurisRio";
    const { error } = await supabase.from("favorites").insert({
      user_id: user!.id, name, description: content.slice(0, 500), category: "Sugestão IA",
    });
    if (error) toast.error("Não foi possível salvar."); else toast.success("Salvo nos favoritos!");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-6 grid lg:grid-cols-[280px_1fr] gap-4 min-h-[calc(100dvh-7rem)]">
      {/* Sidebar */}
      <aside className="glass rounded-3xl p-4 shadow-card lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100dvh-7rem)] flex flex-col">
        <button
          onClick={() => { setActiveId(null); setMessages([]); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-soft"
        >
          <Plus className="w-4 h-4" /> Nova conversa
        </button>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mt-5 mb-2 px-1">Histórico</p>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {convs.length === 0 && <p className="text-xs text-muted-foreground px-1">Nenhuma conversa ainda.</p>}
          {convs.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm truncate transition ${activeId === c.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary"}`}
            >
              <MessageCircle className="w-3.5 h-3.5 inline mr-2 opacity-60" />
              {c.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="glass rounded-3xl shadow-card flex flex-col overflow-hidden min-h-[70vh]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-5">
          {messages.length === 0 && !sending && (
            <div className="h-full grid place-items-center text-center py-12">
              <div className="max-w-md">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-hero-gradient grid place-items-center shadow-glow mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-display text-3xl mb-2">Olá! Sou o TurisRio.</h2>
                <p className="text-muted-foreground">Pergunte sobre praias, roteiros, restaurantes, samba, trilhas ou segurança no Rio.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-2 text-left">
                  {[
                    "Monte um roteiro de 3 dias para casal",
                    "Onde comer feijoada de verdade?",
                    "Praias menos lotadas perto de Ipanema",
                    "Como ir do aeroporto ao centro com segurança?",
                  ].map((s) => (
                    <button key={s} onClick={() => setInput(s)} className="text-sm px-4 py-3 rounded-xl bg-secondary hover:bg-accent/30 transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{m.content}</p>
                {m.role === "assistant" && (
                  <button onClick={() => saveFavorite(m.content)} className="mt-2 text-xs inline-flex items-center gap-1 opacity-70 hover:opacity-100">
                    <Heart className="w-3 h-3" /> Salvar
                  </button>
                )}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-border p-4 bg-card/40">
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Pergunte sobre o Rio…"
              rows={1}
              maxLength={2000}
              className="flex-1 resize-none px-4 py-3 rounded-2xl bg-secondary outline-none focus:ring-2 focus:ring-accent max-h-40"
            />
            <button type="submit" disabled={sending || !input.trim()} className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition shadow-soft">
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">IA pode cometer erros. Confirme informações importantes.</p>
        </div>
      </section>
    </div>
  );
}
