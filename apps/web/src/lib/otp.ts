// lib/otp.ts - OTP management service

import { EmailService } from './email';

interface OTPEntry {
  code: string;
  email: string;
  type: 'registration' | 'password-reset' | 'verification';
  createdAt: number;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
  used: boolean;
}

interface OTPGenerationResult {
  success: boolean;
  message: string;
  expiresIn?: number;
}

interface OTPVerificationResult {
  success: boolean;
  message: string;
  data?: any;
}

export class OTPService {
  private static instance: OTPService;
  private otpStorage = new Map<string, OTPEntry>();
  private emailService: EmailService;

  // Configuration
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_ATTEMPTS = 3;
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 3;

  // Rate limiting storage
  private rateLimitStorage = new Map<string, { count: number; resetAt: number }>();

  private constructor() {
    this.emailService = EmailService.getInstance();
    // Clean up expired OTPs every 5 minutes
    setInterval(() => this.cleanupExpiredOTPs(), 5 * 60 * 1000);
  }

  public static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
    }
    return OTPService.instance;
  }

  /**
   * Generate and send OTP to email
   */
  public async generateAndSendOTP(
    email: string,
    name: string,
    type: 'registration' | 'password-reset' | 'verification'
  ): Promise<OTPGenerationResult> {
    try {
      // Check rate limiting
      if (!this.checkRateLimit(email)) {
        return {
          success: false,
          message: 'Too many requests. Please wait before requesting another OTP.'
        };
      }

      // Invalidate any existing OTP for this email and type
      this.invalidateExistingOTP(email, type);

      // Generate new OTP
      const otpCode = this.emailService.generateOTP();
      const now = Date.now();
      const expiresAt = now + (this.OTP_EXPIRY_MINUTES * 60 * 1000);

      // Store OTP
      const otpKey = this.getOTPKey(email, type);
      this.otpStorage.set(otpKey, {
        code: otpCode,
        email,
        type,
        createdAt: now,
        expiresAt,
        attempts: 0,
        maxAttempts: this.MAX_ATTEMPTS,
        used: false
      });

      // Send email
      const emailSent = await this.emailService.sendOTPEmail({
        email,
        name,
        otp: otpCode,
        type
      });

      if (!emailSent) {
        this.otpStorage.delete(otpKey);
        return {
          success: false,
          message: 'Failed to send OTP email. Please try again.'
        };
      }

      console.log(`🔐 OTP Generated for ${email} (${type}): ${otpCode} - Expires in ${this.OTP_EXPIRY_MINUTES} minutes`);

      return {
        success: true,
        message: `OTP sent to ${email}. Please check your inbox.`,
        expiresIn: this.OTP_EXPIRY_MINUTES * 60 // seconds
      };

    } catch (error) {
      console.error('Error generating OTP:', error);
      return {
        success: false,
        message: 'Failed to generate OTP. Please try again.'
      };
    }
  }

  /**
   * Verify OTP code
   */
  public async verifyOTP(
    email: string,
    code: string,
    type: 'registration' | 'password-reset' | 'verification'
  ): Promise<OTPVerificationResult> {
    try {
      const otpKey = this.getOTPKey(email, type);
      const otpEntry = this.otpStorage.get(otpKey);

      if (!otpEntry) {
        return {
          success: false,
          message: 'Invalid or expired OTP. Please request a new one.'
        };
      }

      // Check if already used
      if (otpEntry.used) {
        return {
          success: false,
          message: 'OTP has already been used. Please request a new one.'
        };
      }

      // Check expiry
      if (Date.now() > otpEntry.expiresAt) {
        this.otpStorage.delete(otpKey);
        return {
          success: false,
          message: 'OTP has expired. Please request a new one.'
        };
      }

      // Check max attempts
      if (otpEntry.attempts >= otpEntry.maxAttempts) {
        this.otpStorage.delete(otpKey);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        };
      }

      // Verify code
      if (otpEntry.code !== code) {
        otpEntry.attempts++;
        const remainingAttempts = otpEntry.maxAttempts - otpEntry.attempts;

        if (remainingAttempts <= 0) {
          this.otpStorage.delete(otpKey);
          return {
            success: false,
            message: 'Invalid OTP. Too many failed attempts. Please request a new OTP.'
          };
        }

        return {
          success: false,
          message: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
        };
      }

      // Success! Mark as used
      otpEntry.used = true;

      console.log(`✅ OTP Verified successfully for ${email} (${type})`);

      return {
        success: true,
        message: 'OTP verified successfully.',
        data: {
          email: otpEntry.email,
          type: otpEntry.type,
          verifiedAt: Date.now()
        }
      };

    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again.'
      };
    }
  }

  /**
   * Check if user can request OTP (rate limiting)
   */
  private checkRateLimit(email: string): boolean {
    const now = Date.now();
    const rateLimitKey = `rate_${email}`;
    const rateLimit = this.rateLimitStorage.get(rateLimitKey);

    if (!rateLimit || now > rateLimit.resetAt) {
      // Create new rate limit window
      this.rateLimitStorage.set(rateLimitKey, {
        count: 1,
        resetAt: now + this.RATE_LIMIT_WINDOW
      });
      return true;
    }

    if (rateLimit.count >= this.MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    // Increment counter
    rateLimit.count++;
    return true;
  }

  /**
   * Invalidate existing OTP for email and type
   */
  private invalidateExistingOTP(email: string, type: string): void {
    const otpKey = this.getOTPKey(email, type);
    this.otpStorage.delete(otpKey);
  }

  /**
   * Generate unique key for OTP storage
   */
  private getOTPKey(email: string, type: string): string {
    return `${email}:${type}`;
  }

  /**
   * Clean up expired OTPs from storage
   */
  private cleanupExpiredOTPs(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, otp] of this.otpStorage.entries()) {
      if (now > otp.expiresAt || otp.used) {
        this.otpStorage.delete(key);
        cleanedCount++;
      }
    }

    // Clean up expired rate limits
    for (const [key, rateLimit] of this.rateLimitStorage.entries()) {
      if (now > rateLimit.resetAt) {
        this.rateLimitStorage.delete(key);
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired OTPs`);
    }
  }

  /**
   * Get OTP status for debugging
   */
  public getOTPStatus(email: string, type: string): any {
    const otpKey = this.getOTPKey(email, type);
    const otp = this.otpStorage.get(otpKey);

    if (!otp) {
      return { exists: false };
    }

    return {
      exists: true,
      type: otp.type,
      createdAt: new Date(otp.createdAt).toISOString(),
      expiresAt: new Date(otp.expiresAt).toISOString(),
      attempts: otp.attempts,
      maxAttempts: otp.maxAttempts,
      used: otp.used,
      isExpired: Date.now() > otp.expiresAt
    };
  }

  /**
   * Force cleanup (useful for testing)
   */
  public forceCleanup(): void {
    this.cleanupExpiredOTPs();
  }
}