import type { PricingBreakdown, VerificationStatus } from './types';

export const currency = (amount: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(Number.isFinite(amount) ? amount : 0);

export const number = (amount: number) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0);

export function minimumPrice(pricing: PricingBreakdown) {
  return pricing.materialCost + pricing.artisanHours * pricing.hourlyRate + pricing.helperPayments + pricing.packaging + pricing.shipping + pricing.overhead;
}

export function recommendedPrice(pricing: PricingBreakdown) {
  return minimumPrice(pricing) * (1 + pricing.marginPercent / 100);
}

export function evidenceCount(stages: { status: 'supported' | 'missing' }[]) {
  return stages.filter((stage) => stage.status === 'supported').length;
}

export function statusLabel(status: VerificationStatus) {
  const labels: Record<VerificationStatus, string> = {
    pending: 'Awaiting review',
    approved: 'Community reviewed',
    'needs-evidence': 'More evidence needed',
    rejected: 'Not approved',
  };
  return labels[status];
}

export function formatDate(dateString: string) {
  if (!dateString) return 'Date not set';
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}
