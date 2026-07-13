"use client";

import { FormEvent, useState } from "react";
import {
  BadgeCheck,
  FileText,
  Globe,
  ImageIcon,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function CreateBrandPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);

    setSlug(
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
    );
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        logo,
        website,
        description,
        isActive,
      };

      const response = await fetch("/api/brands/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setName("");
      setSlug("");
      setLogo("");
      setWebsite("");
      setDescription("");
      setIsActive(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      <Card className="mx-auto max-w-3xl shadow-lg">
        <CardContent className="space-y-6 p-8">
          <div>
            <h1 className="text-3xl font-bold">
              Create Brand
            </h1>

            <p className="mt-2 text-muted-foreground">
              Add a new brand to your marketplace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Brand Name */}
            <div>
              <Label>Brand Name</Label>

              <div className="relative mt-2">
                <BadgeCheck className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  placeholder="Apple"
                  value={name}
                  onChange={(e) =>
                    handleNameChange(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <Label>Slug</Label>

              <div className="relative mt-2">
                <Tag className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* Logo */}
            <div>
              <Label>Logo URL</Label>

              <div className="relative mt-2">
                <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  placeholder="https://..."
                  value={logo}
                  onChange={(e) =>
                    setLogo(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <Label>Website (Optional)</Label>

              <div className="relative mt-2">
                <Globe className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-10"
                  placeholder="https://apple.com"
                  value={website}
                  onChange={(e) =>
                    setWebsite(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>

              <div className="relative mt-2">
                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

                <Textarea
                  className="min-h-32 pl-10 pt-3"
                  placeholder="Write brand description..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label>Active</Label>

                <p className="text-sm text-muted-foreground">
                  Show this brand to customers.
                </p>
              </div>

              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Brand"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}