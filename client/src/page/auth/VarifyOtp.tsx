"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Navigate, useParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { verifyOtp } from "@/services/authService"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
// import Cookies from "js-cookie"

import { loginSuccess } from "@/store/slices/authSlice"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function VerifyOtp() {
  const dispatch = useAppDispatch()
  const { loading, user } = useAppSelector((state) => state.auth)
  const params = useParams()
  const navigate = useNavigate()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<HTMLInputElement[]>([])
  const { mutate, isPending } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success(res.data.message);

        const session = res.data.session;
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);
        localStorage.setItem("expires_at", session.expires_at);

        dispatch(loginSuccess({ email: params.email ?? "" }));
        navigate(`/dashboard`);
      }

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

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof params.email === "string") {
      mutate({ email: params.email, token: otp.join("") })
    } else {
      toast.error("Email parameter is missing or invalid.")
    }
  }


  if (loading) return <>Loading...</>
  if (user) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-backround px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl z-50">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* OTP Inputs */}
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el
                  }}
                  disabled={isPending}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                  className={cn(
                    "h-12 w-12 text-center text-lg font-bold tracking-widest",
                    "focus:ring-2 focus:ring-primary"
                  )}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              Verify
            </Button>


          </form>
        </CardContent>
      </Card>
      <ShootingStars minSpeed={5} minDelay={2200} />
      <StarsBackground />
    </div>
  )
}
