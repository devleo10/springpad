import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-8 pt-20 pb-16 relative bg-white">
      <div className="max-w-7xl mx-auto text-sm text-neutral-700 flex sm:flex-row flex-col justify-between items-start">
        {/* Left: Logo + Copyright */}
        <div>
          <div className="mr-4 md:flex mb-6">
            <Link
              href="/"
              className="font-normal flex space-x-2 items-center text-sm mr-4 px-2 py-1 relative z-20 text-black"
            >
              <Image
                src="/logo.png"
                alt="SpringPad Logo"
                width={150}
                height={100}
                className="p-2 object-contain"
              />
            </Link>
          </div>
          <div className="text-black">Copyright © 2024 Springpad</div>
          <div className="mt-2 text-yellow-500 font-medium">
            All rights reserved
          </div>
        </div>

        {/* Right 3-column section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 items-start mt-10 md:mt-0 w-full sm:w-auto">
          {/* Column 1: Product */}
          <div className="flex justify-center space-y-4 flex-col mt-4">
            <Link
              href="/pricing"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Contact
            </Link>
          </div>

          {/* Column 2: Legal */}
          <div className="flex justify-center space-y-4 flex-col mt-4">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Terms of Service
            </Link>
            <Link
              href="/refund-policy"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Refund Policy
            </Link>
          </div>

          {/* Column 3: Social */}
          <div className="flex justify-center space-y-4 flex-col mt-4">
            <Link
              href="https://twitter.com"
              target="_blank"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              Twitter
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="transition-colors hover:text-yellow-500 text-xs sm:text-sm text-black"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom background text */}
      <div
        className="mt-16 text-[14vw] lg:text-[16vw] xl:text-[16vw] leading-none font-extrabold text-center select-none tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-yellow-400 via-yellow-200 to-white drop-shadow-[0_2px_16px_rgba(234,179,8,0.15)]"
        style={{
          WebkitTextStroke: "2px #111",
          letterSpacing: "-0.04em",
          transform: "scaleY(1.2)",
        }}
      >
        SPRINGPAD
      </div>
    </footer>
  );
}
