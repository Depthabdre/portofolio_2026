"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { loginAdmin } from "@/app/admin/actions";
import { Field } from "./AdminUI";

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="studio-button studio-button-primary mt-7 w-full"
    >
      {pending ? "Signing in…" : "Enter your workspace"}
      <FiArrowRight aria-hidden="true" />
    </button>
  );
}

export function LoginForm({ configured }: { configured: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <form action={loginAdmin}>
      <Field label="Password" name="password">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={!configured}
            className="!py-3.5 !pr-12"
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 text-[var(--j-muted)]"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow(!show)}
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </Field>
      {configured ? (
        <SignInButton />
      ) : (
        <p className="mt-6 text-xs leading-relaxed text-[var(--j-muted)]">
          Admin access is not configured. Set ADMIN_PASSWORD on the server to
          continue.
        </p>
      )}
    </form>
  );
}
