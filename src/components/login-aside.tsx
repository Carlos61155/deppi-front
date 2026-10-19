export default function LoginAside() {
  return (
    <aside
      className="
        relative
        h-screen
        w-full
        overflow-hidden
        bg-[url('/images/login-background.jpg')]
        bg-cover
        bg-center
      "
    >
      <div className="absolute left-14 top-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--verde-if)]">
          <span className="text-xl font-bold text-white">
            D
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold leading-5">
            DEPPI
          </h1>

          <p className="text-xs text-gray-500">
            IFCE · Extensão
          </p>
        </div>
      </div>

      <div className="absolute bottom-14 left-14">
        <h2 className="text-4xl font-bold leading-tight text-white">
          Cursos de extensão
          <br />
          do IFCE, num só lugar.
        </h2>

        <p className="mt-4 text-base text-white">
          Inscreva-se, envie seus documentos e acompanhe a análise da
          <br />
          sua inscrição.
        </p>
      </div>
    </aside>
  );
}