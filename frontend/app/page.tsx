"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      setIsLoggedIn(true)
      router.replace("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Premium Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
              Z
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SleepBetter
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-block badge-accent">✨ Track. Analyze. Sleep Better.</div>
          <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent text-balance leading-tight">
            Master Your Sleep, Master Your Life
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-balance leading-relaxed">
            Get intelligent insights into your sleep patterns. Track quality, duration, and trends with real-time
            analytics. Designed for high-performing students who care about their health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="px-8 py-3.5 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Why Choose SleepBetter?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize your sleep and boost your performance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Advanced Analytics",
                description:
                  "Track sleep duration, quality, REM cycles, and wake times with beautiful visualizations and deep insights",
              },
              {
                icon: "🤖",
                title: "AI-Powered Insights",
                description: "Get personalized recommendations based on your unique sleep patterns and lifestyle data",
              },
              {
                icon: "🎯",
                title: "Smart Goals",
                description:
                  "Set ambitious sleep goals and watch your progress with detailed statistics and milestone tracking",
              },
              {
                icon: "💡",
                title: "Sleep Advice",
                description: "Receive evidence-based tips and strategies to improve sleep quality and overall wellness",
              },
              {
                icon: "📱",
                title: "Easy Logging",
                description: "Log your sleep entries in seconds with our intuitive interface and smart defaults",
              },
              {
                icon: "🔔",
                title: "Smart Alerts",
                description: "Get notifications when sleep quality dips or health patterns need attention",
              },
            ].map((feature, idx) => (
              <div key={idx} className="card-premium group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { number: "50K+", label: "Active Users" },
              { number: "2.3M", label: "Nights Tracked" },
              { number: "4.8★", label: "App Rating" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Ready to Transform Your Sleep?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of high-performing students optimizing their sleep and wellbeing today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3.5 border border-border rounded-lg font-semibold hover:bg-secondary transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">No credit card required. Start tracking in seconds.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold mb-4">SleepBetter</div>
              <p className="text-sm text-muted-foreground">Sleep science meets smart technology</p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Product</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Company</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-4">Connect</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SleepBetter. Crafted with care for better sleep.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
