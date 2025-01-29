import DOMPurify from 'dompurify';

export const containsXSSPatterns = (input: string): boolean => {
  return input !== DOMPurify.sanitize(input);
};

export const validateRequiredInput = (value: string): boolean => {
  return value !== '' && !containsXSSPatterns(value);
};

export const validateNotRequiredInput = (value: string): boolean => {
  return !containsXSSPatterns(value);
};

export const validateEmail = (email: string): boolean => {
  if (!validateRequiredInput(email)) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email !== '' ? regex.test(email) : false;
};

export class PasswordErrors {
  missingRequiredLengthError = false;
  missingUppercaseLetterError = false;
  missingSpecialCharactersError = false;

  constructor(allInvalid?: boolean) {
    if (allInvalid) {
      this.missingRequiredLengthError = true;
      this.missingUppercaseLetterError = true;
      this.missingSpecialCharactersError = true;
    }
  }
}

export const validatePassword = (password: string): { isValid: boolean; errors: PasswordErrors } => {
  if (!password) return { isValid: false, errors: new PasswordErrors(true) };
  const errors = new PasswordErrors();
  let hasErrors = containsXSSPatterns(password);

  if (password.length < 10 || password.length > 128) {
    errors.missingRequiredLengthError = true;
    hasErrors = true;
  }
  if (!/[A-Z]/.test(password)) {
    errors.missingUppercaseLetterError = true;
    hasErrors = true;
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,./?]+/.test(password)) {
    errors.missingSpecialCharactersError = true;
    hasErrors = true;
  }

  return {
    isValid: !hasErrors,
    errors,
  };
};
