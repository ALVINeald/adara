"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Heart,
  Compass,
  Users,
  AlertCircle,
  BarChart2,
  Bookmark,
  Settings,
  Search,
  Bell,
  ShieldCheck,
  PhoneCall,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ExternalLink,
  Plus,
} from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  title: string;
  experience: string;
  image: string;
  specialties: string[];
  bio: string;
}

const MOCK_THERAPISTS: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah Nakanjako",
    title: "Clinical Psychologist",
    experience: "8 years experience",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    specialties: ["Anxiety", "Trauma", "Depression"],
    bio: "Specializing in trauma recovery and anxiety management across the lifespan.",
  },
  {
    id: "2",
    name: "Mr. David Kato",
    title: "Counselling Psychologist",
    experience: "6 years experience",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    specialties: ["Relationships", "Stress", "Men's Health"],
    bio: "Helping individuals and couples improve communication and build healthier relationships.",
  },
  {
    id: "3",
    name: "Dr. Irene Mutesi",
    title: "Psychiatrist",
    experience: "12 years experience",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    specialties: ["Mood Disorders", "Depression", "ADHD"],
    bio: "Board-certified psychiatrist focused on medication management and holistic care.",
  },
  {
    id: "4",
    name: "Dr. Joan Namulawa",
    title: "Mental Health Counselor",
    experience: "7 years experience",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    specialties: ["Child & Adolescent", "Family", "Behavioral"],
    bio: "Supporting children, teens and families through emotional and behavioral challenges.",
  },
  {
    id: "5",
    name: "Mr. Brian Ssempa",
    title: "Psychotherapist",
    experience: "7 years experience",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    specialties: ["Addiction", "Anxiety", "Stress"],
    bio: "Specializes in addiction recovery and stress management using evidence-based therapies.",
  },
  {
    id: "6",
    name: "Dr. Alice Nabukeera",
    title: "Clinical Psychologist",
    experience: "10 years experience",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200",
    specialties: ["Life Transitions", "Burnout", "Grief"],
    bio: "Helping professionals navigate burnout and major life transitions with clarity and purpose.",
  },
];

export default function TherapistDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedTherapists, setSavedTherapists] = useState<string[]>(["1"]);

  const toggleSave = (id: string) => {
    setSavedTherapists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F7F5FC] text-slate-800 antialiased font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col justify-between border-r border-purple-100/60 bg-white/70 px-4 py-6 backdrop-blur-md">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-200">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Adara</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <SidebarItem href="/dashboard" icon={<Home className="h-4 w-4" />} label="Home" />
            <SidebarItem href="/journal" icon={<BookOpen className="h-4 w-4" />} label="Journal" />
            <SidebarItem href="/therapy" icon={<Heart className="h-4 w-4" />} label="Therapy" active />
            <SidebarItem href="/wellness" icon={<Compass className="h-4 w-4" />} label="Wellness Hub" />
            <SidebarItem href="/directory" icon={<Users className="h-4 w-4" />} label="Therapist Directory" activeSub />
            <SidebarItem href="/crisis" icon={<AlertCircle className="h-4 w-4 text-rose-500" />} label="Crisis Resources" />
            <div className="pt-4 pb-2">
              <div className="border-t border-purple-100" />
            </div>
            <SidebarItem href="/progress" icon={<BarChart2 className="h-4 w-4" />} label="Progress" />
            <SidebarItem href="/favorites" icon={<Bookmark className="h-4 w-4" />} label="Favorites" />
            <SidebarItem href="/messages" icon={<Users className="h-4 w-4" />} label="Messages" />
            <SidebarItem href="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
          </nav>
        </div>

        {/* User Card & Crisis Quick Note */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-purple-100 bg-white p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Aisha Khan"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">Aisha Khan</p>
                <p className="text-xs text-purple-600 font-medium cursor-pointer hover:underline">View Profile</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 p-4 border border-purple-100/80 text-xs text-slate-600 space-y-2">
            <p className="font-medium text-slate-700">You are not alone.</p>
            <p className="text-slate-500">Support is always available.</p>
            <div className="pt-1">
              <div className="h-1.5 w-full bg-purple-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-3/4 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-purple-100/60 bg-white/80 px-8 py-5 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">Therapist Directory</h1>
            <p className="text-sm text-slate-500">Find qualified, compassionate professionals who can support your journey.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, specialty or keyword..."
                className="w-full rounded-full border border-purple-100 bg-[#F9F8FC] py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm transition hover:bg-purple-50">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-white text-slate-600 shadow-sm transition hover:bg-purple-50">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
          </div>
        </header>

        {/* PAGE BODY GRID */}
        <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: DIRECTORY & CARDS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CRISIS BANNER */}
            <div className="flex items-center justify-between rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50/80 via-white to-rose-50/40 p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-inner">
                  <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Need immediate support?</h3>
                  <p className="text-xs text-slate-600">If you are in crisis or feeling unsafe, help is available right now.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-700">
                  View Crisis Resources
                </button>
                <button className="flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-xs font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50">
                  <PhoneCall className="h-3.5 w-3.5" />
                  Call Now
                </button>
              </div>
            </div>

            {/* FILTERS BAR */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <FilterDropdown label="Specialization" />
                <FilterDropdown label="Care Type" />
                <FilterDropdown label="Age Group" />
                <FilterDropdown label="Online / In-person" />
                <button className="flex items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-purple-50">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  More Filters
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <FilterTag label="Accepting New Clients" active />
                <FilterTag label="Trauma-informed" active />
                <FilterTag label="LGBTQ+ Affirming" active />
                <span className="text-xs font-medium text-purple-600 cursor-pointer hover:underline pl-2">Clear All</span>
              </div>
            </div>

            {/* RESULTS COUNT & SORT */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm font-medium text-slate-500">32 therapists found</p>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <span>Sort by:</span>
                <select className="rounded-xl border border-purple-100 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none">
                  <option>Relevance</option>
                  <option>Experience</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            {/* THERAPIST CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MOCK_THERAPISTS.map((therapist) => (
                <div
                  key={therapist.id}
                  className="flex flex-col justify-between rounded-3xl border border-purple-100/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={therapist.image}
                          alt={therapist.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-semibold text-slate-900 text-sm">{therapist.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500">{therapist.title}</p>
                          <p className="text-[11px] font-medium text-purple-600 mt-0.5">{therapist.experience}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSave(therapist.id)}
                        className={`p-1.5 rounded-full transition ${
                          savedTherapists.includes(therapist.id)
                            ? "text-purple-600 bg-purple-50"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <Bookmark className="h-4 w-4" fill={savedTherapists.includes(therapist.id) ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* Specialty Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {therapist.specialties.map((spec, idx) => (
                        <span key={idx} className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-medium text-purple-700">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {therapist.bio}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-5 pt-3 border-t border-purple-50">
                    <button className="flex-1 rounded-xl border border-purple-200 bg-white py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-50">
                      View Profile
                    </button>
                    <button className="flex-1 rounded-xl bg-purple-600 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700">
                      Request Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER CALLOUT BAR */}
            <div className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-6 text-white shadow-lg mt-8">
              <div>
                <h3 className="text-lg font-serif font-semibold">Need Help Now?</h3>
                <p className="text-xs text-purple-200 mt-1">We’re here for you. 24/7 confidential support and verified guidance.</p>
              </div>
              <button className="flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-rose-700">
                <PhoneCall className="h-4 w-4" />
                Emergency Line
              </button>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: CRISIS SUPPORT & APPOINTMENTS */}
          <div className="space-y-6">
            {/* Crisis Support Card */}
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" />
                <h3 className="font-semibold text-slate-900">Crisis Support</h3>
              </div>
              <div className="space-y-3">
                <CrisisContactItem
                  name="Mental Health Uganda"
                  desc="24/7 Support Helpline"
                  number="0800 100 066"
                />
                <CrisisContactItem
                  name="Uganda Police"
                  desc="Emergency"
                  number="999"
                />
                <CrisisContactItem
                  name="Butabika Hospital"
                  desc="Mental Health Services"
                  number="0772 529 604"
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl border border-purple-100 bg-purple-50/50 py-3 text-xs font-semibold text-purple-700 transition hover:bg-purple-100">
                View All Crisis Resources
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Your Appointments */}
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Your Appointments</h3>
                <span className="text-xs font-medium text-purple-600 cursor-pointer hover:underline">View all</span>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    Pending Request
                  </span>
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">Dr. Sarah Nakanjako</h4>
                <p className="text-xs text-slate-500">Requested on May 15, 2025</p>
              </div>
            </div>

            {/* Saved Therapists */}
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Saved Therapists</h3>
                <span className="text-xs font-medium text-purple-600 cursor-pointer hover:underline">View all</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="h-10 w-10 rounded-full object-cover" alt="" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="h-10 w-10 rounded-full object-cover" alt="" />
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" className="h-10 w-10 rounded-full object-cover" alt="" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700">
                  +2
                </div>
              </div>
            </div>

            {/* Inspiration Quote */}
            <div className="rounded-3xl bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-indigo-50/50 p-6 border border-purple-200/60 shadow-sm space-y-3">
              <p className="text-xs font-serif italic text-slate-700 leading-relaxed">
                &ldquo;The first step to healing is reaching out.&rdquo;
              </p>
              <p className="text-[11px] font-medium text-purple-700">You&apos;re already taken it.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  active,
  activeSub,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  activeSub?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all ${
        active || activeSub
          ? "bg-purple-100/80 font-semibold text-purple-900 shadow-sm"
          : "text-slate-600 hover:bg-purple-50/60 hover:text-slate-900"
      }`}
    >
      <span className={active || activeSub ? "text-purple-700" : "text-slate-400"}>{icon}</span>
      {label}
    </Link>
  );
}

function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center justify-between gap-3 rounded-xl border border-purple-100 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-purple-50">
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  );
}

function FilterTag({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-purple-600 text-white shadow-sm"
          : "border border-purple-100 bg-white text-slate-600 hover:bg-purple-50"
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px] opacity-80">×</span>
    </button>
  );
}

function CrisisContactItem({ name, desc, number }: { name: string; desc: string; number: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-purple-50 bg-[#F9F8FC] p-3 transition hover:border-purple-200">
      <div>
        <h4 className="text-xs font-semibold text-slate-800">{name}</h4>
        <p className="text-[11px] text-slate-500">{desc}</p>
        <p className="text-xs font-bold text-rose-600 mt-0.5">{number}</p>
      </div>
      <button className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-md shadow-rose-100 transition hover:bg-rose-700">
        <PhoneCall className="h-4 w-4" />
      </button>
    </div>
  );
}