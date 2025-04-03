"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const subscribeSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1),
  name: z.string().optional(),
});

type FormValues = z.infer<typeof subscribeSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to subscribe");
      }

      toast.success("Thank you for subscribing to our newsletter!");
      form.reset();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-12">Get Involved</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Donation Section */}
        <div className="space-y-6">
          <h2
            className="text-2xl font-medium border-l-4 pl-4"
            style={{ borderColor: "#d89e0f" }}
          >
            Support Our Mission
          </h2>

          <p className="text-gray-700">
            Help us translate the Bible into every language in audio and text.
            Your donation makes the Gospel accessible to everyone in their
            native language.
          </p>

          <div className="aspect-video bg-gray-50 border border-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src="/src/assets/pages/homepage/team.JPG"
              alt="Translation project"
              className="max-h-full rounded-lg"
            />
          </div>

          <Button
            className="w-full py-6 text-black hover:text-white"
            style={{ backgroundColor: "#d89e0f", borderColor: "#d89e0f" }}
            asChild
          >
            <a
              href="https://wegive.com/holos"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              Donate Now <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Newsletter Section */}
        <div className="space-y-6">
          <h2
            className="text-2xl font-medium border-l-4 pl-4"
            style={{ borderColor: "#d89e0f" }}
          >
            Stay Connected
          </h2>

          <p className="text-gray-700">
            Subscribe to our newsletter to receive updates on our translation
            projects and ways you can get involved in our mission.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                {...form.register("name")}
                className="border-gray-300 focus:border-[#d89e0f] focus:ring-[#d89e0f]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...form.register("email")}
                required
                className="border-gray-300 focus:border-[#d89e0f] focus:ring-[#d89e0f]"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-black hover:text-white"
              style={{ backgroundColor: "#d89e0f", borderColor: "#d89e0f" }}
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting || !form.watch("email")}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>

      <Separator
        className="my-12"
        style={{ backgroundColor: "#d89e0f", height: "1px", opacity: 0.3 }}
      />

      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm text-gray-600">
          The Every Language Gospel Translation Project is dedicated to making
          God's word accessible to all people in their native languages.
        </p>
      </div>
    </div>
  );
}
