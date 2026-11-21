export type EnquiryFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type EnquiryValidationErrors = Partial<Record<keyof EnquiryFormValues, string>>;

export function validateEnquiry(values: EnquiryFormValues): EnquiryValidationErrors {
  const errors: EnquiryValidationErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const phoneDigits = phone.replace(/\D/g, "");
  const message = values.message.trim();

  if (name.length < 2) errors.name = "Please enter a name with at least 2 characters.";
  else if (name.length > 80) errors.name = "Name must be 80 characters or fewer.";

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!/^[+()\-\s\d]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Please enter a valid phone number (7–15 digits).";
  }

  if (message.length < 10) errors.message = "Message must be at least 10 characters.";
  else if (message.length > 1000) errors.message = "Message must be 1000 characters or fewer.";

  return errors;
}
