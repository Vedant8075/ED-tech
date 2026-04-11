const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender"); 
const { otpTemplate } = require("../mail/emailVerification");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, 
  },
});


async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otpTemplate(otp),
    );
    console.log("Email sent successfully:", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending mail:", error);
    throw error;
  }
}

otpSchema.pre("save", async function () {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
});

module.exports = mongoose.model("OTP", otpSchema);

