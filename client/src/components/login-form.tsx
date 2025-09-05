import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { requestOtp } from "@/services/authService"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { useAppSelector } from "@/store/hook"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loading, user } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()


  const { mutate, isPending } = useMutation({
    mutationFn: requestOtp,
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success(res.data.message)
        navigate(`/varify-otp/${email}`)
      }
      console.log(res.status)
      console.log(res)
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message)
      } else {
        toast.error("An unknown error occurred")
      }
      console.error(error)
    },
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ email })
  }

  if (loading) return <>Loading...</>
  if (user) return <Navigate to="/" replace />

  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-lg sm:p-8",
        className
      )}
      {...props}
    >
      <form className="flex flex-col gap-6" onSubmit={handleLogin}>
        <div className="flex flex-col items-center gap-2 text-center">
          <a
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <GalleryVerticalEnd className="size-7 text-primary" />
            </div>
            <span className="sr-only">CosmoSafe</span>
          </a>
          <h1 className="text-2xl font-bold tracking-tight">
            Login to CosmoSafe
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to continue
          </p>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending..." : "Send OTP"}
        </Button>

        <div className="relative text-center text-sm">
          <span className="bg-card text-muted-foreground relative z-10 px-2">
            OR
          </span>
          <div className="border-border absolute inset-0 top-1/2 z-0 border-t"></div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full flex items-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="font-medium">Continue with Google</span>
        </Button>
      </form>
    </div>
  )
}
