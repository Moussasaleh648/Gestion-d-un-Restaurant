export const formatOrderId = (value) => {
  if (value === null || value === undefined || value === '') {
    return '#0000';
  }

  const digits = String(value).replace(/\D/g, '');

  if (!digits) {
    return '#0000';
  }

  return `#${digits.slice(-4).padStart(4, '0')}`;
};
