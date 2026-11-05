import { motion } from "motion/react";
import { ArrowRight, BookOpen, Check, Globe2, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Users, title: "Meaningful matches", copy: "Meet people who share your topics, pace, and availability." },
  { icon: Globe2, title: "Learn across borders", copy: "Build perspective with a supportive global learning community." },
  { icon: BookOpen, title: "Make progress together", copy: "Turn conversations into consistent habits and real momentum." },
];

const LandingPage = () => (
  <main className="app-shell">
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-40">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2">
            <Sparkles className="size-3.5" /> Social learning, made simple
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
            Find your people. <span className="text-primary">Learn further.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            LearnMate helps curious people find reliable study partners, share goals, and keep showing up together.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 shadow-lg shadow-primary/15">
              <Link to="/auth/signup">Start learning free <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-white/15 bg-white/[0.03] px-6">
              <Link to="/features">Explore the platform</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            {["No pressure, just progress", "Built for real conversations", "Your pace, your people"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2"><Check className="size-4 text-primary" />{item}</span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7, delay: .1 }} className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-primary/10 blur-3xl" />
          <Card className="app-surface relative overflow-hidden border-white/15 p-2">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=85"
              alt="Learners collaborating around a table"
              className="h-[28rem] w-full rounded-[1rem] object-cover"
            />
            <CardContent className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md">
              <p className="text-sm font-medium text-white">“The right partner makes consistency feel natural.”</p>
              <p className="mt-1 text-xs text-white/60">A note from the LearnMate community</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-xl">
        <p className="eyebrow">A better way to grow</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Progress feels better together.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {benefits.map(({ icon: Icon, title, copy }) => (
          <Card key={title} className="app-surface transition-colors hover:border-primary/30">
            <CardContent className="p-6">
              <div className="mb-7 flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary"><Icon className="size-5" /></div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  </main>
);

export default LandingPage;
