"use client"

import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserIcon,
  Camera01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  LockPasswordIcon,
  Building01Icon,
  Delete01Icon,
  ImageRemove01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useUser } from "@/components/UserContext"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "Jan",
    lastName:  "Kowalski",
    email:     "jan@wirmet.pl",
    phone:     "+48 600 123 456",
    role:      "owner" as "owner" | "admin" | "user",
    company:   "Wirmet Sp. z o.o.",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    next:    "",
    confirm: "",
  })

  const { avatarUrl, setAvatarUrl }       = useUser()
  const [profileSaved,  setProfileSaved]  = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    setAvatarUrl(URL.createObjectURL(file))
    e.target.value = ""
  }, [avatarUrl])

  const handleAvatarRemove = useCallback(() => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    setAvatarUrl(null)
  }, [avatarUrl])

  function handleSaveProfile() {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
    toast.success("Zmiany w profilu zostały zapisane.")
  }

  function handleSavePassword() {
    setPasswordSaved(true)
    setPasswords({ current: "", next: "", confirm: "" })
    setTimeout(() => setPasswordSaved(false), 2000)
    toast.success("Hasło zostało zmienione.")
  }

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()

  return (
    <>
      <PageSetup title="Profile" icon={UserIcon} />

      <div className="p-8 max-w-2xl flex flex-col gap-6">

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Personal information */}
        <Card>
          <CardHeader className="border-b border-border px-5 py-1">
            <CardTitle className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 px-5 py-2">

            {/* Avatar row */}
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <Avatar key={avatarUrl} className="size-14 shrink-0">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile photo" />}
                <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-base">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {profile.role} · {profile.email}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
                  <HugeiconsIcon icon={Camera01Icon} data-icon="inline-start" />
                  {avatarUrl ? "Change photo" : "Upload photo"}
                </Button>
                {avatarUrl && (
                  <Button variant="destructive" size="lg" onClick={handleAvatarRemove}>
                    <HugeiconsIcon icon={ImageRemove01Icon} data-icon="inline-start" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name">
                <div className="relative">
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                    className="h-9 pl-8 text-sm"
                  />
                </div>
              </Field>

              <Field label="Last name">
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  className="h-9 text-sm"
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email address" hint="Used for notifications and sign-in.">
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="h-9 pl-8 text-sm"
                />
              </div>
            </Field>

            {/* Phone + Role */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone" hint="Include country code, e.g. +48.">
                <div className="relative">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="h-9 pl-8 text-sm"
                  />
                </div>
              </Field>

              <Field label="Role">
                <Select
                  value={profile.role}
                  onValueChange={(v) => setProfile((p) => ({ ...p, role: v as "owner" | "admin" | "user" }))}
                >
                  <SelectTrigger size="lg" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Company */}
            <Field label="Company name">
              <div className="relative">
                <HugeiconsIcon
                  icon={Building01Icon}
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  value={profile.company}
                  onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                  className="h-9 pl-8 text-sm"
                />
              </div>
            </Field>

          </CardContent>

          <CardFooter className="border-t border-border px-5 py-1 justify-end">
            <Button
              variant={profileSaved ? "outline" : "default"}
              size="lg"
              onClick={handleSaveProfile}
              className={cn(profileSaved && "text-emerald-600 border-emerald-500/30")}
            >
              {profileSaved ? "Saved!" : "Save changes"}
            </Button>
          </CardFooter>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="border-b border-border px-5 py-1">
            <CardTitle className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Security
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 px-5 py-2">

            <Field label="Current password">
              <div className="relative">
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className="h-9 pl-8 text-sm"
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="New password" hint="Minimum 8 characters.">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                  className="h-9 text-sm"
                />
              </Field>

              <Field
                label="Confirm password"
                hint={
                  passwords.confirm && passwords.next !== passwords.confirm
                    ? <span className="text-destructive">Passwords do not match.</span>
                    : undefined
                }
              >
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  aria-invalid={!!(passwords.confirm && passwords.next !== passwords.confirm)}
                  className="h-9 text-sm"
                />
              </Field>
            </div>

          </CardContent>

          <CardFooter className="border-t border-border px-5 py-1 justify-end">
            <Button
              variant={passwordSaved ? "outline" : "default"}
              size="lg"
              onClick={handleSavePassword}
              className={cn(passwordSaved && "text-emerald-600 border-emerald-500/30")}
              disabled={!passwords.current || !passwords.next || passwords.next !== passwords.confirm}
            >
              {passwordSaved ? "Password updated!" : "Update password"}
            </Button>
          </CardFooter>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHeader className="border-b border-border px-5 py-1">
            <CardTitle className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Danger Zone
            </CardTitle>
          </CardHeader>

          <CardContent className="px-5 py-2">
            <div className="flex items-center justify-between gap-6">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">Delete account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="lg" className="shrink-0">
                    <HugeiconsIcon icon={Delete01Icon} data-icon="inline-start" />
                    Delete account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                      <HugeiconsIcon icon={Delete01Icon} />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Usunąć konto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Ta operacja jest nieodwracalna. Twoje konto oraz wszystkie powiązane dane zostaną trwale usunięte.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel variant="ghost">Anuluj</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">Usuń konto</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  )
}
