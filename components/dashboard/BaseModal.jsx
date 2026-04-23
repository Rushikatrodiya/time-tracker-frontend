"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function BaseModal({
  fields,
  onSubmit,
  open,
  onOpenChange,
  ...props
}) {
  const [formData, setFormData] = useState({});

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData); // 🔥 send all values
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-[12px] h-8">
          {props.triggerIcon && (
            <span className="mr-1">{props.triggerIcon}</span>
          )}
          {props.triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid gap-2">
              <Label>{field.label}</Label>
              <Input
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="text-[13px]"
                required={field.required}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>{props.submitText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
