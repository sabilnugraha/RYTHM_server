import argon2 from 'argon2';

import { AppError } from '../../utils/app-error.js';
import {
  createPlatformUser,
  findPlatformUserByEmail,
  getLatestUserCode,
} from './platform-user.repository.js';

function generateNextUserCode(latestUserCode) {
  if (!latestUserCode) {
    return '0000000001';
  }

  const nextNumber = Number(latestUserCode) + 1;

  if (!Number.isSafeInteger(nextNumber) || nextNumber <= 0) {
    throw new AppError('Invalid latest user code.', 500);
  }

  if (nextNumber > 9999999999) {
    throw new AppError('User code limit has been reached.', 500);
  }

  return String(nextNumber).padStart(10, '0');
}

function validateCreatePlatformUserPayload(payload) {
  const email = String(payload.email ?? '').trim().toLowerCase();
  const fullName = String(payload.fullName ?? '').trim();
  const password = String(payload.password ?? '');

  if (!email) {
    throw new AppError('Email is required.', 400);
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError('Email format is invalid.', 400);
  }

  if (!fullName) {
    throw new AppError('Full name is required.', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters.', 400);
  }

  return {
    email,
    fullName,
    password,
  };
}

export async function createPlatformUserService(payload) {
  const validatedPayload = validateCreatePlatformUserPayload(payload);

  const existingUser = await findPlatformUserByEmail(validatedPayload.email);

  if (existingUser) {
    throw new AppError('Email already exists.', 409);
  }

  const latestUserCode = await getLatestUserCode();
  const userCode = generateNextUserCode(latestUserCode);
  const passwordHash = await argon2.hash(validatedPayload.password, {
    type: argon2.argon2id,
  });

  return createPlatformUser({
    userCode,
    email: validatedPayload.email,
    fullName: validatedPayload.fullName,
    passwordHash,
  });
}
