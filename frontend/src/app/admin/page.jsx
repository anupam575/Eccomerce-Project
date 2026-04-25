"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const WelcomeAdmin = () => {
  const canvasRef = useRef(null);
  const sparkleRef = useRef(null);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const stats = [
    { label: "Total Users", value: 1250, icon: <PeopleIcon fontSize="large" />, color: "from-blue-400 to-indigo-600" },
    { label: "Products", value: 340, icon: <Inventory2Icon fontSize="large" />, color: "from-green-400 to-teal-600" },
    { label: "Orders", value: 542, icon: <ShoppingCartIcon fontSize="large" />, color: "from-yellow-400 to-orange-500" },
  ];

  // ================= PARTICLES BEHIND CARD =================
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = 120;
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.color = `hsla(${Math.random() * 360}, 70%, 60%, 0.5)`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }, []);

  // ================= STATS COUNTER + SPARKLE =================
  useEffect(() => {
    stats.forEach((s, idx) => {
      let start = 0;
      const end = s.value;
      const duration = 1200;
      const increment = end / (duration / 20);

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(counter);
        }
        setAnimatedStats((prev) => {
          const updated = [...prev];
          updated[idx] = Math.floor(start);
          return updated;
        });

        // sparkle trigger
        if (sparkleRef.current) {
          const sparkle = document.createElement("div");
          sparkle.className = `absolute w-2 h-2 bg-white rounded-full opacity-80 animate-sparkle`;
          sparkle.style.top = `${Math.random() * 50 + 25}%`;
          sparkle.style.left = `${Math.random() * 50 + 25}%`;
          sparkleRef.current.appendChild(sparkle);
          setTimeout(() => sparkle.remove(), 800);
        }
      }, 20);
    });
  }, []);

  // ================= MOUSE FOLLOW SPARKLES =================
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (sparkleRef.current) {
        const sparkle = document.createElement("div");
        sparkle.className = `absolute w-2 h-2 bg-white rounded-full opacity-70 animate-sparkle`;
        sparkle.style.top = `${e.clientY}px`;
        sparkle.style.left = `${e.clientX}px`;
        sparkleRef.current.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 600);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden dark:bg-gray-900">
      {/* PARTICLES & GRADIENT BACKGROUND */}
      <canvas ref={canvasRef} className="absolute  inset-0 w-full h-full z-0" />
      <div className="absolute inset-0 bg-gradient-to-br  from-purple-500 via-pink-400 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 animate-gradient-bg z-0" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 -mt-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 gap-16">
        {/* ================= WELCOME CARD ================= */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl w-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-3xl border border-white/20 dark:border-gray-700 rounded-[3rem] p-14 text-center shadow-[0_35px_80px_-20px_rgba(0,0,0,0.25)] dark:shadow-[0_35px_80px_-20px_rgba(255,255,255,0.05)] hover:-translate-y-2 hover:shadow-[0_55px_140px_-25px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_55px_140px_-25px_rgba(255,255,255,0.05)] transition-all duration-700"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Welcome to the <span className="text-indigo-600 dark:text-indigo-400">Admin Dashboard</span>
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-10">
            Take full control of your platform — manage users, products, and orders, monitor growth, and deliver a world-class experience.
          </p>
          <button className="inline-flex items-center justify-center px-10 py-4 rounded-3xl bg-indigo-600 text-white dark:bg-indigo-500 font-semibold shadow-[0_20px_60px_-10px_rgba(79,70,229,0.5)] hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-[1.05] transition-all duration-300">
            Get Started
          </button>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Tip: Use the sidebar to navigate admin tools
          </p>

          {/* sparkle container */}
          <div ref={sparkleRef} className="absolute inset-0 pointer-events-none"></div>
        </motion.div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl w-full">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -5, scale: 1.05, rotate: 3 }}
              className="relative group bg-white/25 dark:bg-gray-900/30 backdrop-blur-3xl border border-white/10 dark:border-gray-700 rounded-3xl p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_-10px_rgba(255,255,255,0.05)] transition-all duration-500"
            >
              <div className={`absolute inset-0 rounded-3xl blur-3xl opacity-0 group-hover:opacity-60 transition duration-700 bg-gradient-to-br ${s.color}`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400">{s.label}</p>
                  <motion.p
                    className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2"
                    animate={{ color: ["#fff", "#f0f", "#fff"], transition: { repeat: Infinity, duration: 2 } }}
                  >
                    {animatedStats[idx]}
                  </motion.p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0], transition: { duration: 0.5 } }}
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl text-white text-3xl bg-gradient-to-br ${s.color} shadow-lg relative`}
                >
                  {s.icon}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-bg {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-bg {
          background-size: 200% 200%;
          animation: gradient-bg 30s ease infinite;
        }
        @keyframes sparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(2) rotate(360deg); opacity: 0; }
        }
        .animate-sparkle {
          animation: sparkle 0.8s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default WelcomeAdmin;
