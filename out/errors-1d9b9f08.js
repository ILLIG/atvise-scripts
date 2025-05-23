'use strict';

class AppError extends Error {
  static from(originalError, message, options) {
    return Object.assign(new this(message), {
      originalError,
      ...options
    });
  }
  originalError;
  tips = [];
  constructor(message, {
    originalError,
    tips
  } = {}) {
    super(message);
    if (originalError) this.originalError = originalError;
    if (tips) this.tips = tips;
  }
}
class UsageError extends AppError {}

exports.AppError = AppError;
exports.UsageError = UsageError;
