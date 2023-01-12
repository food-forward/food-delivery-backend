import { config } from "@/config";

export const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  let otp_expity = new Date();
  otp_expity.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, otp_expity };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = config.TWILIO_ACCOUNT_SID;
  const authToken = config.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  const response = await client.message.create({
    body: `Your OTP is ${otp}`,
    from: `${config.TWILIO_ASSIGNED_PHONENO}`,
    to: `${config.TWILIO_COUNTRY_CODE}${toPhoneNumber}`, // recipient phone number // Add country before the number
  });

  return response;
};
