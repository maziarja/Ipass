"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  setupMasterSchema,
  type SetupMasterFormData,
} from "@/lib/schemas/authSchemas";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setupMaster } from "@/lib/auth";
import { deriveKey, encrypt } from "@/lib/crypto";

export default function SetupMasterPage() {
  const router = useRouter();

  const form = useForm<SetupMasterFormData>({
    resolver: zodResolver(setupMasterSchema),
    defaultValues: { masterPassword: "", confirmMasterPassword: "" },
  });

  async function onSubmit(data: SetupMasterFormData) {
    try {
      // 1. Generate a random 16-byte salt
      const saltArray = crypto.getRandomValues(new Uint8Array(16));

      // 2. Derive AES key from master password + salt
      const key = await deriveKey(
        data.masterPassword,
        saltArray.buffer as ArrayBuffer,
      );

      // 3. Encrypt the known plaintext "ipass-verify" — stored for future verification
      const masterVerify = await encrypt("ipass-verify", key);

      // 4. Base64-encode the salt for storage
      const masterSalt = btoa(String.fromCharCode(...saltArray));

      const result = await setupMaster(masterSalt, masterVerify);

      if (result?.status === "success") router.push("/vault");
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Set your master password</CardTitle>
          <CardDescription>
            This password encrypts your vault. It is never sent to the server
            and <strong>cannot be recovered</strong> if forgotten.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="masterPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Master password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmMasterPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm master password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
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
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="animate-spin" />
                )}
                {form.formState.isSubmitting
                  ? "Setting up…"
                  : "Set master password"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-center text-xs text-muted-foreground">
            Store this password somewhere safe — losing it means losing access
            to all vault entries.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
