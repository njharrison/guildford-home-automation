const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

function redirect(path) {
  return new Response(null, {
    status: 303,
    headers: { Location: path },
  });
}

function clean(value) {
  return String(value ?? "").trim();
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/contact") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "POST" },
      });
    }

    try {
      const form = await request.formData();

      // Honeypot. Real visitors never see or fill this field.
      if (clean(form.get("company_website"))) {
        return redirect("/contact.html?sent=1");
      }

      const name = clean(form.get("name"));
      const email = clean(form.get("email"));
      const message = clean(form.get("message"));
      const interests = form.getAll("interest").map(clean).filter(Boolean);

      if (
        !name ||
        name.length > MAX_NAME ||
        !email ||
        email.length > MAX_EMAIL ||
        !validEmail(email) ||
        !message ||
        message.length > MAX_MESSAGE
      ) {
        return redirect("/contact.html?error=validation");
      }

      const interestText = interests.length ? interests.join(", ") : "Not specified";
      const receivedAt = new Date().toISOString();
      const subjectName = name.replace(/[\r\n]+/g, " ");

      await env.EMAIL.send({
        to: "njharrison@gmail.com",
        from: {
          email: "hello@guildfordhomeautomation.co.uk",
          name: "Guildford Home Automation",
        },
        replyTo: email,
        subject: `Website enquiry from ${subjectName}`,
        text: [
          "New enquiry from guildfordhomeautomation.co.uk",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Interests: ${interestText}`,
          `Received: ${receivedAt}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      });

      return redirect("/contact.html?sent=1");
    } catch (error) {
      console.error("Contact form failed", error);
      return redirect("/contact.html?error=send");
    }
  },
};
