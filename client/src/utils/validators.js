/**
 * Form validation utilities matching backend rules.
 */

export const validateName = (name) => {
  if (!name || name.trim().length < 20) {
    return 'Name must be at least 20 characters';
  }
  if (name.trim().length > 60) {
    return 'Name must not exceed 60 characters';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Must be a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8 || password.length > 16) {
    return 'Password must be 8-16 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return '';
};

export const validateAddress = (address) => {
  if (!address || address.trim().length === 0) {
    return 'Address is required';
  }
  if (address.trim().length > 400) {
    return 'Address must not exceed 400 characters';
  }
  return '';
};

export const validateRating = (rating) => {
  const num = parseInt(rating);
  if (isNaN(num) || num < 1 || num > 5) {
    return 'Rating must be between 1 and 5';
  }
  return '';
};
