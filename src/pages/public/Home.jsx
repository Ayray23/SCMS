// src/pages/PublicHome.jsx

import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Bell,
  BarChart3,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function PublicHome() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Complaint Handling",
      description:
        "All complaints are securely stored and managed using Firebase.",
    },
    {
      icon: Bell,
      title: "Real-Time Updates",
      description:
        "Students receive instant notifications whenever their complaint status changes.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Administrators can monitor trends and resolution performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            SCMS
          </h1>

          <div className="flex gap-3">
            <Link
              to="/auth/login"
              className="px-5 py-2 rounded-xl border border-slate-700 hover:border-slate-500 transition"
            >
              Login
            </Link>

            <Link
              to="/auth/register"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
              Student Complaint Management System
            </span>

            <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
              Modern Complaint
              <span className="block text-indigo-400">
                Resolution Platform
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 max-w-xl">
              Submit complaints, track progress, communicate with
              administrators, and ensure transparency throughout the
              complaint resolution process.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/auth/register"
                className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/auth/login"
                className="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-xl"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-10 flex gap-10">
              <div>
                <h2 className="text-3xl font-bold">1000+</h2>
                <p className="text-slate-400">Complaints Managed</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">95%</h2>
                <p className="text-slate-400">Resolution Rate</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">24/7</h2>
                <p className="text-slate-400">Accessibility</p>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-slate-400 text-sm">
                  Total Complaints
                </h3>
                <p className="text-3xl font-bold mt-2">1,248</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-slate-400 text-sm">
                  Resolved
                </h3>
                <p className="text-3xl font-bold mt-2 text-green-400">
                  1,105
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-slate-400 text-sm">
                  Pending
                </h3>
                <p className="text-3xl font-bold mt-2 text-yellow-400">
                  89
                </p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-slate-400 text-sm">
                  Departments
                </h3>
                <p className="text-3xl font-bold mt-2">12</p>
              </div>
            </div>

            <div className="mt-6 bg-slate-800 rounded-2xl p-5">
              <h3 className="font-semibold mb-4">
                Complaint Workflow
              </h3>

              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-2 rounded-full bg-yellow-500/20 text-yellow-400">
                  Pending
                </span>

                <span className="px-3 py-2 rounded-full bg-blue-500/20 text-blue-400">
                  Assigned
                </span>

                <span className="px-3 py-2 rounded-full bg-purple-500/20 text-purple-400">
                  In Review
                </span>

                <span className="px-3 py-2 rounded-full bg-green-500/20 text-green-400">
                  Resolved
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            Why Choose SCMS?
          </h2>

          <p className="text-slate-400 mt-4">
            Everything needed to manage student complaints efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500 transition"
              >
                <Icon className="text-indigo-400" size={40} />

                <h3 className="text-xl font-semibold mt-6">
                  {feature.title}
                </h3>

                <p className="text-slate-400 mt-3">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mt-16">
          {[
            "Submit Complaint",
            "Department Review",
            "Investigation",
            "Resolution",
          ].map((step, index) => (
            <div
              key={index}
              className="text-center bg-slate-900 rounded-3xl p-8 border border-slate-800"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold">
                {index + 1}
              </div>

              <h3 className="mt-5 font-semibold">
                {step}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 text-center">
          <CheckCircle
            size={60}
            className="mx-auto mb-6"
          />

          <h2 className="text-4xl font-bold">
            Ready to Get Started?
          </h2>

          <p className="mt-4 text-lg text-indigo-100">
            Join the Student Complaint Management System and
            experience a transparent complaint resolution process.
          </p>

          <Link
            to="/auth/register"
            className="inline-block mt-8 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between">
          <p className="text-slate-400">
            © 2026 Student Complaint Management System
          </p>

          <p className="text-slate-400">
            RAY
          </p>
        </div>
      </footer>
    </div>
  );
}