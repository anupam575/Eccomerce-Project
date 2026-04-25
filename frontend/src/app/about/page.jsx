"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function About() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 150);
  }, []);

  return (
    <div
      className="
        flex items-start justify-center -mt-16
        px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-8
        overflow-y-auto max-h-screen scrollbar-thin
        bg-gradient-to-br from-zinc-100 via-white to-zinc-200
        dark:bg-zinc-900
      "
    >
      <div
        className={`
          relative max-w-7xl w-full -mt-10
          bg-white/60 dark:bg-zinc-800/60 backdrop-blur-3xl
          rounded-3xl border border-white/20 dark:border-zinc-700/40
          shadow-lg shadow-black/10
          overflow-hidden
          transition-all duration-1000
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        `}
      >
        <div className="flex flex-col lg:flex-row">
          {/* IMAGE */}
          <div className="relative lg:w-1/2 h-[520px] lg:h-[900px] group overflow-hidden rounded-t-3xl lg:rounded-l-3xl">
            <Image
              src="/images/developers.jpg"
              alt="MERN Developer"
              fill
              priority
              className="
                object-cover scale-105
                transition-transform duration-[1500ms]
                group-hover:scale-110
              "
            />

            {/* Dynamic overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/20 to-transparent group-hover:from-black/60 group-hover:via-black/30 transition-colors duration-500" />

            <div className="absolute bottom-8 left-8 px-6 py-3 rounded-full bg-white/20 dark:bg-zinc-700/30 backdrop-blur-xl border border-white/30 dark:border-zinc-600 text-white text-sm font-semibold shadow-lg">
              MERN Stack Specialist
            </div>
          </div>

          {/* CONTENT */}
          <div className="lg:w-1/2 p-8 -mt-16 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.35em] text-amber-500 font-semibold mb-4">
              About Me
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-400">
              Crafting <br />
              <span className="text-amber-500">Premium Experiences</span>
            </h1>

            <p className="text-zinc-700 dark:text-zinc-300 text-lg sm:text-xl leading-relaxed mb-6 transition-colors duration-300">
              I’m a <strong>full-stack MERN developer</strong> focused on building high-performance, scalable and visually premium applications.
            </p>

            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-10 transition-colors duration-300">
              Every product is crafted with performance, security and clean architecture — inspired by <strong>Amazon-level reliability</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/contact"
                className="
                  relative inline-flex items-center justify-center
                  px-8 sm:px-9 py-4 rounded-2xl
                  bg-gradient-to-r from-amber-500 to-yellow-400
                  hover:from-yellow-400 hover:to-amber-500
                  text-white font-semibold
                  shadow-lg shadow-amber-300/50
                  hover:scale-[1.05] active:scale-95
                  transition-all duration-300
                "
              >
                Let’s Work Together
              </Link>

              <span className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
                Available for freelance & projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}