export default function HomePage() {
  return (
    <main className="min-h-screen bg-genis-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-genis-yellow">DNA Genis</p>
        <h1 className="text-3xl font-bold">Acesse seu dashboard pelo link dedicado</h1>
        <p className="text-gray-400">
          Cada aluno tem uma URL única no formato
          {' '}
          <code className="bg-white/5 px-2 py-1 rounded border border-white/10 text-sm">/seu-nome</code>
          . Consulte o link enviado para você ou peça ao suporte.
        </p>
      </div>
    </main>
  );
}
