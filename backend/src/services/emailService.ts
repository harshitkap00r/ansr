import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const escapeHtml = (value: string): string =>
    value.replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });

interface EnquiryEmailData {
    productId: number;
    productName: string;
    name: string;
    email: string;
    phone: string;
    message: string;
}

export const sendEnquiryEmail = async (enquiry: EnquiryEmailData) => {
    await transporter.sendMail({
        from: `"Product Catalogue" <${process.env.SMTP_USER}>`,
        to: process.env.SALES_EMAIL,
        replyTo: enquiry.email,
        subject: `New Product Enquiry - ${enquiry.productName}`,
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f7f7f5;font-family:Arial,Helvetica,sans-serif;color:#292a26;">

  <div style="padding:32px 16px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e8e8e4;border-radius:12px;overflow:hidden;">

      <!-- Header -->
      <div style="padding:24px 28px;border-bottom:1px solid #eeeeeb;">
        <div style="display:flex;align-items:center;">
          <span style="display:inline-block;background:#5f7562;color:#ffffff;padding:8px;border-radius:6px;font-weight:bold;">A</span>
          <span style="margin-left:10px;font-size:13px;font-weight:bold;letter-spacing:2px;">ANSR</span>
        </div>
      </div>

      <!-- Hero -->
      <div style="padding:28px;background:#e8ede6;">
        <p style="font-size:10px;letter-spacing:2px;color:#5f7562;font-weight:bold;margin:0 0 12px;">
          NEW CUSTOMER ENQUIRY
        </p>

        <h1 style="font-size:24px;margin:0;color:#292a26;">
          Someone is interested<br/>in your product.
        </h1>

        <p style="font-size:14px;color:#667064;margin:12px 0 0;">
          A new enquiry has been submitted through your catalogue.
        </p>
      </div>

      <!-- Customer details -->
      <div style="padding:28px;">
        <h2 style="font-size:16px;margin:0 0 18px;">Customer details</h2>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:10px 0;color:#777;width:100px;">Name</td>
            <td style="padding:10px 0;font-weight:600;">${escapeHtml(enquiry.name)}</td>
          </tr>

          <tr>
            <td style="padding:10px 0;color:#777;">Email</td>
            <td style="padding:10px 0;">
              <a href="mailto:${escapeHtml(enquiry.email)}" style="color:#5f7562;text-decoration:none;">
                ${escapeHtml(enquiry.email)}
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 0;color:#777;">Phone</td>
            <td style="padding:10px 0;">${escapeHtml(enquiry.phone)}</td>
          </tr>
        </table>

        <!-- Product -->
        <div style="margin-top:28px;padding:20px;background:#f7f7f5;border:1px solid #eeeeeb;border-radius:8px;">
          <p style="font-size:10px;letter-spacing:1.5px;color:#5f7562;font-weight:bold;margin:0 0 10px;">
            PRODUCT
          </p>

          <h3 style="font-size:16px;margin:0 0 8px;">
            ${escapeHtml(enquiry.productName)}
          </h3>

          <p style="font-size:12px;color:#777;margin:0;">
            Product ID: ${enquiry.productId}
          </p>
        </div>

        <!-- Message -->
        <h2 style="font-size:16px;margin:28px 0 12px;">Customer message</h2>

        <div style="padding:18px;background:#ffffff;border:1px solid #e8e8e4;border-radius:8px;font-size:14px;line-height:1.7;color:#555;">
          ${escapeHtml(enquiry.message).replace(/\n/g, "<br/>")}
        </div>

        <!-- CTA -->
        <div style="margin-top:28px;">
          <a href="mailto:${escapeHtml(enquiry.email)}"
             style="display:inline-block;background:#5f7562;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-size:13px;font-weight:bold;">
            Reply to customer
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:20px 28px;background:#f7f7f5;border-top:1px solid #eeeeeb;">
        <p style="font-size:11px;color:#888;margin:0;text-align:center;">
          ANSR · Product Catalogue
        </p>
        <p style="font-size:10px;color:#aaa;margin:8px 0 0;text-align:center;">
          This email was automatically generated from a customer enquiry.
        </p>
      </div>

    </div>
  </div>

</body>
</html>
`,
    });
};