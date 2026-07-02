import { z } from 'zod';

export const emailSchema = z.string().trim().email('Please enter a valid email address.');
export const fullNameSchema = z.string().trim().min(2, 'Please enter your full name.');
export const indianMobileSchema = z.string().trim().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.');
export const otpSchema = z.string().trim().regex(/^\d{6}$/, 'Please enter the 6-digit OTP.');
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters.');

export const registrationPersonalSchema = z.object({
  fullName: fullNameSchema,
  mobile: z.string().trim().min(8, 'Please enter your mobile number.'),
  email: emailSchema,
  dob: z.string().trim().min(1, 'Please enter your date of birth.'),
});

export const registrationAddressSchema = z.object({
  city: z.string().trim().min(1, 'Please enter your city.'),
  pincode: z.string().trim().min(4, 'Please enter a valid pincode.'),
  address: z.string().trim().min(5, 'Please enter your full address.'),
  nomineeName: z.string().trim().min(2, 'Please enter nominee name.'),
  nomineeRelation: z.string().trim().min(1, 'Please enter nominee relation.'),
});

export function getValidationMessage(error: unknown, fallback = 'Please check the highlighted details.') {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || fallback;
  }
  return fallback;
}
