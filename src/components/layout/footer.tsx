export function Footer() {
  return (
    <footer className="p-4 text-base-content text-white m-8">
      <div>
        <p>
          Created and open-sourced by{" "}
          <a
            href="https://github.com/aeminium-labs/nextjs-solana-starter-kit"
            target="_blank"
            rel="noreferrer"
            className="link link-primary"
          >
            aeminium labs
          </a>
          . Powered by{" "}
          <a
            href="https://helius.xyz/"
            target="_blank"
            rel="noreferrer"
            className="link link-primary"
          >
            Helius
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
