import { motion } from "motion/react";
import { Compass, Globe2, HeartHandshake, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => <main className="app-shell"><div className="page-container">
  <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
    <p className="eyebrow">Why LearnMate exists</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Learning is a human thing.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">We believe the best learning relationships are built on curiosity, consistency, and a little mutual encouragement.</p>
    <div className="mt-12 grid gap-4 md:grid-cols-2"><Card className="app-surface"><CardContent className="p-7"><Target className="size-6 text-primary" /><h2 className="mt-6 text-xl font-semibold">Our mission</h2><p className="mt-3 leading-7 text-muted-foreground">Make it easier for every learner to find a thoughtful partner, stay accountable, and make progress that lasts.</p></CardContent></Card><Card className="app-surface"><CardContent className="p-7"><HeartHandshake className="size-6 text-primary" /><h2 className="mt-6 text-xl font-semibold">Our belief</h2><p className="mt-3 leading-7 text-muted-foreground">The right community changes what feels possible. Every conversation can be the beginning of momentum.</p></CardContent></Card></div>
    <div className="mt-14"><p className="eyebrow">The LearnMate approach</p><div className="mt-5 grid gap-4 sm:grid-cols-3">{[{ icon: Users, title: "People first" }, { icon: Compass, title: "Purposeful discovery" }, { icon: Globe2, title: "Open community" }].map(({ icon: Icon, title }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><Icon className="size-5 text-primary" /><p className="mt-8 font-medium">{title}</p></div>)}</div></div>
  </motion.div>
</div></main>;
export default About;
