import { ReactNode } from "react";
import Link from "next/link";
import { ShieldAlert, Map, ListTodo, LogOut } from "lucide-react";

export default function OfficerLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-red-900 selection:text-white">
            {/* Top Bar for Officials - Distinct "Tactical" Look */}
            <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-700 p-1.5 rounded-sm">
                            <ShieldAlert className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-slate-100 uppercase leading-none">
                                Dhaal <span className="text-red-500">Official</span>
                            </h1>
                            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                                Response Console
                            </p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/officer" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                            <ListTodo className="h-4 w-4" />
                            My Assignments
                        </Link>
                        <Link href="/officer/nearby" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                            <Map className="h-4 w-4" />
                            Nearby Reports
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono text-emerald-500 hidden sm:inline-block">SYSTEM ONLINE</span>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Bottom - Tactical Style */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-50 pb-safe">
                <Link href="/officer" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                    <ListTodo className="h-5 w-5" />
                    <span className="text-[10px] uppercase">Tasks</span>
                </Link>
                <Link href="/officer/nearby" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                    <Map className="h-5 w-5" />
                    <span className="text-[10px] uppercase">Map</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    <span className="text-[10px] uppercase">Profile</span>
                </Link>
            </div>

            <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
                {children}
            </main>
        </div>
    );
}
