/**
 * Company Information Settings Types
 */

export interface CompanyIdentity {
  companyName: string;
  logo: string | null; // Base64 or file URL
  logoFileName?: string;
}

export interface ContactInformation {
  address: string;
  phoneNumber: string;
  emailAddress: string;
}

export interface BusinessRegistration {
  businessRegistrationNumber: string;
  vatTaxId: string;
  additionalStatutoryIds?: string;
}

export interface BankingInformation {
  bankName: string;
  accountNumber: string;
  ifscSwift: string;
  branchName: string;
}

export interface SocialMediaLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube';
  url: string;
}

export interface BusinessHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  openingTime: string; // HH:MM format
  closingTime: string; // HH:MM format
  isClosed: boolean;
}

export interface CompanyDescription {
  aboutText: string;
}

export interface LanguageContent {
  language: string;
  companyName: string;
  aboutText: string;
  description: string;
}

export interface CompanyInformationData {
  identity: CompanyIdentity;
  contact: ContactInformation;
  businessRegistration: BusinessRegistration;
  banking: BankingInformation;
  socialMedia: SocialMediaLink[];
  businessHours: BusinessHour[];
  description: CompanyDescription;
  languageContent: LanguageContent[];
  updatedAt?: string;
  updatedBy?: string;
}

export interface LogoUploadModal {
  isOpen: boolean;
  preview: string | null;
  file: File | null;
}
