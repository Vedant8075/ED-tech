const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const mailSender = async (email, title, body) => {
  try {
    const host = process.env.MAIL_HOST;
    const port = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587;
    const secure = process.env.MAIL_SECURE === "true"; // set to 'true' for port 465

    // Try to resolve an IPv4 address for the host to avoid IPv6 routing issues
    let hostToUse = host;
    if (host) {
      try {
        const lookup = await dns.lookup(host, { family: 4 });
        if (lookup && lookup.address) hostToUse = lookup.address;
      } catch (err) {
        console.warn("IPv4 lookup failed for host, falling back to hostname:", host, err && err.code);
      }
    }

    const transporter = nodemailer.createTransport({
      host: hostToUse,
      port,
      secure,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // timeouts to fail faster and return clearer errors
      connectionTimeout: process.env.MAIL_CONNECTION_TIMEOUT ? Number(process.env.MAIL_CONNECTION_TIMEOUT) : 20000,
      greetingTimeout: process.env.MAIL_GREETING_TIMEOUT ? Number(process.env.MAIL_GREETING_TIMEOUT) : 20000,
      socketTimeout: process.env.MAIL_SOCKET_TIMEOUT ? Number(process.env.MAIL_SOCKET_TIMEOUT) : 20000,
      logger: process.env.MAIL_DEBUG === "true",
      debug: process.env.MAIL_DEBUG === "true",
      tls: {
        // allow turning off cert verification in some environments (not recommended for production)
        rejectUnauthorized: process.env.MAIL_TLS_REJECT_UNAUTHORIZED !== "false",
      },
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully:", info && info.response ? info.response : info);
    return info;
  } catch (error) {
    // return structured info for easier debugging
    console.error("Error sending email:", error);
    return { message: error && error.message, code: error && error.code, stack: error && error.stack };
  }
};

module.exports = mailSender;
