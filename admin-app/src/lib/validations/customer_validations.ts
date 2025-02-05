import { z } from "zod";
import { PhoneNumberUtil } from "google-libphonenumber";

// Initialize PhoneNumberUtil instance
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch {
    return false;
  }
};

export const customerFormSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .nonempty("Name is required"),
  phone_number: z
    .string()
    .nonempty({
      message: "Please enter a phone number.",
    })
    .refine((phone) => isPhoneValid(phone), {
      message: "Please enter a valid phone number.",
    }),
});
