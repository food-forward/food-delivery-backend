export const generateOtp = () => {
  const otp = Math.floor(10000 + Math.random() * 900000);
  let otp_expity = new Date();
  otp_expity.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, otp_expity };
};
