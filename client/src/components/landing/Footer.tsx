import { Facebook, Twitter, Github, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-black/90 text-muted-foreground">
      {/* Top decorative line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Card className="bg-background/50 backdrop-blur-md border-border">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-10 p-8">
            {/* Logo + Description */}
            <div>
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-foreground">CosmoSafe</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed">
                Safeguarding Earth and Space — real-time monitoring of asteroids,
                satellites, and cosmic threats with cutting-edge AI and data visualization.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-foreground font-semibold text-lg">Quick Links</h3>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About</Link>
              <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
              <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>

            {/* Social + Newsletter */}
            <div>
              <h3 className="text-foreground font-semibold text-lg">Stay Connected</h3>
              <p className="mt-2 text-sm">
                Follow our journey to protect Earth & Space.
              </p>
              <div className="flex space-x-3 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full hover:text-primary"
                >
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full hover:text-primary"
                >
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <Facebook className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full hover:text-primary"
                >
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="rounded-full hover:text-primary"
                >
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Line */}
        <div className="mt-10 border-t border-border pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} CosmoSafe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
