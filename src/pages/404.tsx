import Link from "next/link";

// pages/404.js
export default function Custom404() {
  return (
    <div className="hero min-h-screen" style={{ backgroundImage: 'url(/404.jpg)' }}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">404</h1>
          <p className="mb-5">We can't seem to find the page you're looking for.</p>
          <Link className="btn m-1 bg-fuchsia-300 hover:bg-fuchsia-500 text-black" href="/">Go to home</Link>
        </div>
      </div>
    </div>
  );
}
