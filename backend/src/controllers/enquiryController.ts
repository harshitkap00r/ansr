import { Request, Response } from "express";
import { sendEnquiryEmail } from "../services/emailService";

export const submitEnquiry = async (req: Request, res: Response) => {
  const { productId, productName, name, email, phone, message } = req.body;

  const nameValue = typeof name === "string" ? name.trim() : "";
  const emailValue = typeof email === "string" ? email.trim() : "";
  const phoneValue = typeof phone === "string" ? phone.trim() : "";
  const messageValue = typeof message === "string" ? message.trim() : "";
  const phoneDigits = phoneValue.replace(/\D/g, "");

  const invalid =
    !Number.isInteger(Number(productId)) || Number(productId) <= 0 ||
    typeof productName !== "string" || !productName.trim() ||
    nameValue.length < 2 || nameValue.length > 80 ||
    emailValue.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) ||
    !/^[+()\-\s\d]+$/.test(phoneValue) || phoneDigits.length < 7 || phoneDigits.length > 15 ||
    messageValue.length < 10 || messageValue.length > 1000;

  if (invalid) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid enquiry details.",
    });
  }

  try {
    await sendEnquiryEmail({
      productId: Number(productId),
      productName: productName.trim(),
      name: nameValue,
      email: emailValue,
      phone: phoneValue,
      message: messageValue,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your enquiry has been submitted successfully.",
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit your enquiry. Please try again.",
    });
  }
};