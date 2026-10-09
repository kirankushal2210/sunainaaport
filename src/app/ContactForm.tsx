'use client';

import { useState } from 'react';
import { submitContactForm } from './actions/contact';

interface FormState {
  name: string;
  email: string;
  serviceRequested: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  serviceRequested?: string;
  budget?: string;
  message?: string;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  email: '',
  serviceRequested: 'Branding',
  budget: '< $1k',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverStatus, setServerStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Validate form fields on the client before network dispatch
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.serviceRequested.trim()) {
      newErrors.serviceRequested = 'Please select a service.';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Please select a budget range.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide project details.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Project details must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear individual field error as user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Reset status banner if user starts modifying form
    if (serverStatus.type) {
      setServerStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerStatus({ type: null, message: '' });

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setServerStatus({
          type: 'success',
          message: result.message || 'Inquiry sent successfully! Thank you for reaching out.',
        });
        // Clear form inputs upon successful dispatch
        setFormData(INITIAL_FORM_STATE);
        setErrors({});
      } else {
        setServerStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setServerStatus({
        type: 'error',
        message: 'A network error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Success Notification Banner */}
      {serverStatus.type === 'success' && (
        <div
          role="alert"
          className="mb-8 p-6 bg-[#1a1a1a] border border-[#c8956c] text-[#f2ede4] rounded-lg shadow-xl animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#c8956c]/20 border border-[#c8956c] flex items-center justify-center text-[#c8956c] font-bold text-sm shrink-0">
              ✓
            </div>
            <div>
              <p className="font-semibold text-base font-sans tracking-wide text-white">
                Inquiry Dispatched Successfully
              </p>
              <p className="text-xs text-[#f2ede4]/80 mt-0.5 font-mono">
                {serverStatus.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setServerStatus({ type: null, message: '' })}
            className="text-[10px] font-mono uppercase tracking-widest text-[#c8956c] hover:text-white transition-colors underline whitespace-nowrap self-end md:self-center"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Notification Banner */}
      {serverStatus.type === 'error' && (
        <div
          role="alert"
          className="mb-8 p-4 bg-red-950/40 border border-red-500/50 text-red-200 rounded-lg font-mono text-xs flex items-center justify-between gap-3 animate-fade-in"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-red-400 font-bold text-sm">⚠</span>
            <span>{serverStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setServerStatus({ type: null, message: '' })}
            className="text-red-400 hover:text-red-200 uppercase tracking-wider text-[10px]"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 text-left">
            <label
              htmlFor="contact-name"
              className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] flex justify-between"
            >
              <span>Name</span>
              <span className="text-[#c8956c]">*</span>
            </label>
            <input
              type="text"
              id="contact-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="John Doe"
              className={`bg-transparent border-b py-3 outline-none text-[var(--color-ink)] transition-colors ${
                errors.name
                  ? 'border-red-500/80 focus:border-red-500'
                  : 'border-[var(--color-ink-faint)]/30 focus:border-[#c8956c]'
              } disabled:opacity-50`}
            />
            {errors.name && (
              <span className="text-[11px] font-mono text-red-500 mt-0.5">
                {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label
              htmlFor="contact-email"
              className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] flex justify-between"
            >
              <span>Email</span>
              <span className="text-[#c8956c]">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="john@example.com"
              className={`bg-transparent border-b py-3 outline-none text-[var(--color-ink)] transition-colors ${
                errors.email
                  ? 'border-red-500/80 focus:border-red-500'
                  : 'border-[var(--color-ink-faint)]/30 focus:border-[#c8956c]'
              } disabled:opacity-50`}
            />
            {errors.email && (
              <span className="text-[11px] font-mono text-red-500 mt-0.5">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Service & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 text-left">
            <label
              htmlFor="contact-service"
              className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] flex justify-between"
            >
              <span>Service</span>
              <span className="text-[#c8956c]">*</span>
            </label>
            <select
              id="contact-service"
              name="serviceRequested"
              value={formData.serviceRequested}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`bg-transparent border-b py-3 outline-none text-[var(--color-ink)] appearance-none cursor-pointer rounded-none transition-colors ${
                errors.serviceRequested
                  ? 'border-red-500/80 focus:border-red-500'
                  : 'border-[var(--color-ink-faint)]/30 focus:border-[#c8956c]'
              } disabled:opacity-50`}
            >
              <option value="Branding" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                Branding & Visual Identity
              </option>
              <option value="Packaging" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                Packaging & Label Design
              </option>
              <option value="Social Media" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                Social Media Creatives
              </option>
              <option value="Print Design" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                Print & Editorial Design
              </option>
              <option value="Digital Marketing" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                Digital Marketing Assets
              </option>
              <option value="Other" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                Other Inquiry
              </option>
            </select>
            {errors.serviceRequested && (
              <span className="text-[11px] font-mono text-red-500 mt-0.5">
                {errors.serviceRequested}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label
              htmlFor="contact-budget"
              className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] flex justify-between"
            >
              <span>Budget</span>
              <span className="text-[#c8956c]">*</span>
            </label>
            <select
              id="contact-budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`bg-transparent border-b py-3 outline-none text-[var(--color-ink)] appearance-none cursor-pointer rounded-none transition-colors ${
                errors.budget
                  ? 'border-red-500/80 focus:border-red-500'
                  : 'border-[var(--color-ink-faint)]/30 focus:border-[#c8956c]'
              } disabled:opacity-50`}
            >
              <option value="< $1k" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                &lt; $1,000
              </option>
              <option value="$1k - $5k" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                $1,000 – $5,000
              </option>
              <option value="$5k - $10k" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                $5,000 – $10,000
              </option>
              <option value="$10k+" className="bg-[var(--color-paper)] text-[var(--color-ink)]">
                $10,000+
              </option>
            </select>
            {errors.budget && (
              <span className="text-[11px] font-mono text-red-500 mt-0.5">
                {errors.budget}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Project Details */}
        <div className="flex flex-col gap-2 text-left mt-2">
          <label
            htmlFor="contact-message"
            className="text-xs font-mono uppercase tracking-widest text-[var(--color-ink-faint)] flex justify-between"
          >
            <span>Project Details</span>
            <span className="text-[#c8956c]">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Tell me about your brand, project goals, timeline, and key requirements..."
            className={`bg-transparent border-b py-3 outline-none text-[var(--color-ink)] resize-none transition-colors ${
              errors.message
                ? 'border-red-500/80 focus:border-red-500'
                : 'border-[var(--color-ink-faint)]/30 focus:border-[#c8956c]'
            } disabled:opacity-50`}
          />
          {errors.message && (
            <span className="text-[11px] font-mono text-red-500 mt-0.5">
              {errors.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="contact-submit-btn"
          disabled={isSubmitting}
          className="mt-6 px-10 py-4 bg-[var(--color-ink)] text-[var(--color-paper)] font-mono text-xs tracking-[0.25em] uppercase hover:bg-[#c8956c] hover:text-[var(--color-ink)] transition-all duration-300 w-full md:w-auto self-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-[var(--color-paper)] border-t-transparent rounded-full animate-spin" />
              <span>SENDING...</span>
            </>
          ) : (
            <span>SEND INQUIRY</span>
          )}
        </button>
      </form>
    </div>
  );
}
