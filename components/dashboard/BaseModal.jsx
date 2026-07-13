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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function BaseModal({
  fields,
  onSubmit,
  open,
  onOpenChange,
  onValidate,
  initialData,
  ...props
}) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  // Reset form when initialData changes or modal opens
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, open]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const handleSubmit = () => {
    if (onValidate) {
      const validationErrors = onValidate(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    onSubmit(formData); // 🔥 send all values
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!props.hideTrigger && (
        <DialogTrigger asChild>
          <Button size="sm" className="text-[12px] h-8">
            {props.triggerIcon && (
              <span className="mr-1">{props.triggerIcon}</span>
            )}
            {props.triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid gap-2">
              <Label>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="text-[13px]"
                  required={field.required}
                  value={formData[field.id] || ""}
                  rows={3}
                />
              ) : field.type === "select" ? (
                <Select
                  value={formData[field.id] || ""}
                  onValueChange={(value) => handleChange(field.id, value)}
                  required={field.required}
                >
                  <SelectTrigger className="text-[13px] w-full">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.inputType || "text"}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="text-[13px]"
                  required={field.required}
                  value={formData[field.id] || ""}
                />
              )}
              {field.helperText && (
                <p className="text-xs text-gray-500">{field.helperText}</p>
              )}
              {errors[field.id] && (
                <p className="text-xs text-red-500">{errors[field.id]}</p>
              )}
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
