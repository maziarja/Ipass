"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  addPasswordSchema,
  type AddPasswordFormData,
  CATEGORIES,
} from "@/lib/schemas/passwordSchemas";
import { encrypt } from "@/lib/crypto";
import { createPassword, type PasswordEntry } from "@/lib/passwords";
import { useVaultKey } from "@/lib/vaultKey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

type Props = {
  onSuccess: (entry: PasswordEntry) => void;
};

export function AddPasswordForm({ onSuccess }: Props) {
  const { key } = useVaultKey();

  const form = useForm<AddPasswordFormData>({
    resolver: zodResolver(addPasswordSchema),
    defaultValues: { title: "", url: "", category: "", password: "" },
  });

  const watchedPassword = form.watch("password");

  async function onSubmit(data: AddPasswordFormData) {
    if (!key) return;
    try {
      const encrypted = await encrypt(data.password, key);

      const entry = await createPassword({
        title: data.title,
        url: data.url || undefined,
        category: data.category,
        encrypted,
      });

      form.reset();
      onSuccess(entry);
      toast.success("Password saved");
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. GitHub" autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                URL{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://github.com"
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <p className="text-sm leading-none font-medium">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={field.value === cat ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => field.onChange(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <PasswordStrengthMeter password={watchedPassword} />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !key}
          className="w-full"
        >
          {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
          {form.formState.isSubmitting ? "Saving…" : "Save password"}
        </Button>
      </form>
    </Form>
  );
}
