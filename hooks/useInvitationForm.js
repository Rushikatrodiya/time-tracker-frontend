import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM = {
  email: "",
  role: "USER",
};

export const useInvitationForm = ({ onSubmit } = {}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const reset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event?.preventDefault?.();

    if (!validate()) return;

    onSubmit?.({ ...form, email: form.email.trim() });
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
    reset,
  };
};
