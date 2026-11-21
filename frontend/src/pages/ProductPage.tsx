import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { getProductById, submitEnquiry, type Product } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { validateEnquiry } from "../utils/enquiryValidation";

export default function ProductPage() {
  const { id = "" } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const load = () => {
    setLoading(true);
    setError("");

    getProductById(Number(id))
      .then(setProduct)
      .catch(() => setError("Product could not be found."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setValidationErrors((current) => ({ ...current, [e.target.name]: "" }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value.replace(/[^0-9+\s()-]/g, "");

    setForm((current) => ({ ...current, phone }));
    setValidationErrors((current) => ({ ...current, phone: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    const errors = validateEnquiry(form);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    setSubmitting(true);
    setSubmitError("");
    setSuccess("");

    try {
      await submitEnquiry({
        productId: product.id,
        productName: product.title,
        name,
        email,
        phone: form.phone.trim(),
        message,
      });

      setSuccess("Your enquiry has been submitted successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setValidationErrors({});
    } catch {
      setSubmitError("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <main className="mx-auto min-h-[55vh] w-[calc(100%-32px)] max-w-[1160px] py-10">
        <Loading />
      </main>
    );

  if (error || !product)
    return (
      <main className="mx-auto min-h-[55vh] w-[calc(100%-32px)] max-w-[1160px] py-10">
        <ErrorMessage message={error || "Product could not be found."} onRetry={load} />
      </main>
    );

  return (
    <main className="mx-auto min-h-[55vh] w-[calc(100%-32px)] max-w-[1160px] pb-16 pt-8 sm:pt-11">
      <Link
        to="/"
        className="mb-7 inline-flex items-center gap-2 text-sm text-[#77796f] transition hover:text-[#405542]"
      >
        <ArrowLeft size={16} />
        Back to catalogue
      </Link>

      <div className="grid items-start gap-7 md:grid-cols-2 md:gap-16">
        {/* Product image */}
        <div className="grid min-h-[300px] place-items-center rounded-xl border border-[#e8e8e2] bg-white p-9 sm:min-h-[450px] sm:p-14">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-[240px] max-w-full object-contain sm:max-h-[360px]"
          />
        </div>

        {/* Product details */}
        <div className="pt-1 sm:pt-4">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[.13em] text-[#5c715e]">
            {product.category}
          </p>

          <h1 className="mb-4 mt-3 text-[27px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
            {product.title}
          </h1>

          <div className="flex items-center gap-1.5 text-sm text-[#b47b27]">
            <Star size={16} fill="currentColor" />
            {product.rating.rate.toFixed(1)}
            <span className="text-[#77796f]">
              ({product.rating.count} reviews)
            </span>
          </div>

          <p className="my-5 text-[28px] font-extrabold">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-sm leading-7 text-[#66685f]">
            {product.description}
          </p>

          <div className="my-7 h-px bg-[#e8e8e2]" />

          <p className="text-sm font-semibold">
            Interested in this product?
          </p>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 rounded-lg bg-[#5c715e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#465a48]"
            >
              Enquire about this product
            </button>
          )}

          {/* Enquiry form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-4 rounded-xl border border-[#e8e8e2] bg-white p-5"
            >
              <h2 className="text-lg font-bold">Product Enquiry</h2>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Name*
                </label>
                <input
                  name="name"
                  maxLength={80}
                  value={form.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={Boolean(validationErrors.name)}
                  aria-describedby={validationErrors.name ? "name-error" : undefined}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-[#deded7] px-3 py-2.5 text-sm outline-none focus:border-[#5c715e]"
                />
                {validationErrors.name && <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">{validationErrors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Email*
                </label>
                <input
                  name="email"
                  maxLength={254}
                  type="text"
                  inputMode="email"
                  aria-required="true"
                  aria-invalid={Boolean(validationErrors.email)}
                  aria-describedby={validationErrors.email ? "email-error" : undefined}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-[#deded7] px-3 py-2.5 text-sm outline-none focus:border-[#5c715e]"
                />
                {validationErrors.email && <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">{validationErrors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone*
                </label>
                <input
                  name="phone"
                  maxLength={10}
                  type="tel"
                  inputMode="tel"
                  aria-required="true"
                  aria-invalid={Boolean(validationErrors.phone)}
                  aria-describedby={validationErrors.phone ? "phone-error" : undefined}
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-[#deded7] px-3 py-2.5 text-sm outline-none focus:border-[#5c715e]"
                />
                {validationErrors.phone && <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">{validationErrors.phone}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Message*
                </label>
                <textarea
                  name="message"
                  maxLength={1000}
                  value={form.message}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={Boolean(validationErrors.message)}
                  aria-describedby={validationErrors.message ? "message-error" : undefined}
                  rows={4}
                  placeholder="Tell us what you'd like to know..."
                  className="w-full resize-none rounded-lg border border-[#deded7] px-3 py-2.5 text-sm outline-none focus:border-[#5c715e]"
                />
                {validationErrors.message && <p id="message-error" role="alert" className="mt-1 text-xs text-red-600">{validationErrors.message}</p>}
              </div>

              {success && (
                <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {success}
                </p>
              )}

              {submitError && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-[#5c715e] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#465a48] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#deded7] px-4 py-3 text-sm font-medium transition hover:bg-[#f5f5f2]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}