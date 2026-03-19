"use client"

import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { PageSetup } from "@/components/PageSetup"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function SectionCard({
  title,
  children,
  footer,
}: {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="border-b border-zinc-100 px-5 py-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {title}
        </span>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
      {footer && (
        <div className="border-t border-zinc-100 px-5 py-3 flex justify-end">
          {footer}
        </div>
      )}
    </div>
  )
}

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
      <label className="text-xs font-medium text-zinc-600">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-zinc-400">{hint}</p>}
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

  const { avatarUrl, setAvatarUrl }        = useUser()
  const [profileSaved,  setProfileSaved]  = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    setAvatarUrl(URL.createObjectURL(file))
    // Reset input so the same file can be re-selected after removal
    e.target.value = ""
  }, [avatarUrl])

  const handleAvatarRemove = useCallback(() => {
    if (avatarUrl) URL.revokeObjectURL(avatarUrl)
    setAvatarUrl(null)
  }, [avatarUrl])

  function handleSaveProfile() {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2000)
  }

  function handleSavePassword() {
    setPasswordSaved(true)
    setPasswords({ current: "", next: "", confirm: "" })
    setTimeout(() => setPasswordSaved(false), 2000)
  }

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase()

  return (
    <>
      <PageSetup title="Profile" icon={UserIcon} />

      <div className="p-8 max-w-2xl space-y-6">

        {/* Hidden file input — accepts common image formats */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Personal information + avatar */}
        <SectionCard
          title="Profile"
          footer={
            <Button
              variant={profileSaved ? "outline" : "brand"}
              size="lg"
              onClick={handleSaveProfile}
              className={cn(profileSaved && "text-green-600 border-green-200")}
            >
              {profileSaved ? "Saved!" : "Save changes"}
            </Button>
          }
        >
          {/* Avatar row */}
          <div className="flex items-center gap-4 pb-2 border-b border-zinc-100">
            <div className="relative shrink-0">
              <Avatar key={avatarUrl} className="size-14">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile photo" />}
                <AvatarFallback className="bg-zinc-200 text-zinc-700 font-semibold text-base">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Change photo"
                className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-white bg-zinc-800 text-white hover:bg-zinc-600 transition-colors"
              >
                <HugeiconsIcon icon={Camera01Icon} size={10} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5 capitalize">{profile.role} · {profile.email}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="md" onClick={() => fileInputRef.current?.click()}>
                <HugeiconsIcon icon={Camera01Icon} size={13} />
                {avatarUrl ? "Change photo" : "Upload photo"}
              </Button>
              {avatarUrl && (
                <Button variant="destructive" size="md" onClick={handleAvatarRemove}>
                  <HugeiconsIcon icon={ImageRemove01Icon} size={13} />
                  Remove photo
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="First name">
              <div className="relative">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  className="h-9 border-zinc-200 bg-white pl-8 text-sm text-zinc-900"
                />
              </div>
            </Field>

            <Field label="Last name">
              <Input
                value={profile.lastName}
                onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                className="h-9 border-zinc-200 bg-white text-sm text-zinc-900"
              />
            </Field>
          </div>

          <Field label="Email address" hint="Used for notifications and sign-in.">
            <div className="relative">
              <HugeiconsIcon
                icon={Mail01Icon}
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="h-9 border-zinc-200 bg-white pl-8 text-sm text-zinc-900"
              />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" hint="Include country code, e.g. +48.">
              <div className="relative">
                <HugeiconsIcon
                  icon={SmartPhone01Icon}
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="h-9 border-zinc-200 bg-white pl-8 text-sm text-zinc-900"
                />
              </div>
            </Field>

            <Field label="Role">
              <Select
                value={profile.role}
                onValueChange={(v) => setProfile((p) => ({ ...p, role: v as "owner" | "admin" | "user" }))}
              >
                <SelectTrigger size="lg" className="w-full border-zinc-200 bg-white text-zinc-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="border border-zinc-200"
                  style={{
                    "--popover": "oklch(1 0 0)",
                    "--popover-foreground": "oklch(0.145 0 0)",
                    "--accent": "oklch(0.97 0 0)",
                    "--accent-foreground": "oklch(0.205 0 0)",
                    "--border": "oklch(0.922 0 0)",
                  } as React.CSSProperties}
                >
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Company name">
            <div className="relative">
              <HugeiconsIcon
                icon={Building01Icon}
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <Input
                value={profile.company}
                onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                className="h-9 border-zinc-200 bg-white pl-8 text-sm text-zinc-900"
              />
            </div>
          </Field>
        </SectionCard>

        {/* Security */}
        <SectionCard
          title="Security"
          footer={
            <Button
              variant={passwordSaved ? "outline" : "brand"}
              size="lg"
              onClick={handleSavePassword}
              className={cn(passwordSaved && "text-green-600 border-green-200")}
              disabled={!passwords.current || !passwords.next || passwords.next !== passwords.confirm}
            >
              {passwordSaved ? "Password updated!" : "Update password"}
            </Button>
          }
        >
          <Field label="Current password">
            <div className="relative">
              <HugeiconsIcon
                icon={LockPasswordIcon}
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                className="h-9 border-zinc-200 bg-white pl-8 text-sm text-zinc-900"
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
                className="h-9 border-zinc-200 bg-white text-sm text-zinc-900"
              />
            </Field>

            <Field
              label="Confirm password"
              hint={
                passwords.confirm && passwords.next !== passwords.confirm
                  ? <span className="text-red-500">Passwords do not match.</span>
                  : undefined
              }
            >
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                className={cn(
                  "h-9 bg-white text-sm text-zinc-900",
                  passwords.confirm && passwords.next !== passwords.confirm
                    ? "border-red-400"
                    : "border-zinc-200"
                )}
              />
            </Field>
          </div>
        </SectionCard>

        {/* Danger zone */}
        <SectionCard title="Danger Zone">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-zinc-900">Delete account</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="md" className="shrink-0">
              <HugeiconsIcon icon={Delete01Icon} size={13} />
              Delete account
            </Button>
          </div>
        </SectionCard>

      </div>
    </>
  )
}
