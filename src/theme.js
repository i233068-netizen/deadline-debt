// Shared colours so every screen looks consistent.
export const colors = {
  primary: '#4F46E5',
  background: '#F4F5FB',
  card: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  critical: '#DC2626',
  approaching: '#F59E0B',
  later: '#16A34A',
};

// Urgency bucket -> colour
export const urgencyColors = {
  Critical: colors.critical,
  Approaching: colors.approaching,
  Later: colors.later,
};
