import crypto from 'crypto';
import argon2 from 'argon2';

import { env } from '../../config/env.js';
import { AppError } from '../../utils/app-error.js';
import {
  createPlatformUser,
  findPlatformUserByEmail,
  findRootPlatformUser,
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

function generateRandomPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*';
  const bytes = crypto.randomBytes(18);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

function validatePlatformUserIdentityPayload(payload) {
  const email = String(payload.email ?? '').trim().toLowerCase();
  const fullName = String(payload.fullName ?? '').trim();

  if (!email) {
    throw new AppError('Email is required.', 400);
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError('Email format is invalid.', 400);
  }

  if (!fullName) {
    throw new AppError('Full name is required.', 400);
  }

  return {
    email,
    fullName,
  };
}

function validateRootPlatformUserPayload(payload) {
  const validatedIdentity = validatePlatformUserIdentityPayload(payload);
  const password = String(payload.password ?? '');

  if (password.length < 8) {
    throw new AppError('Root password must be at least 8 characters.', 400);
  }

  return {
    ...validatedIdentity,
    password,
  };
}

export async function createPlatformUserService(payload) {
  const validatedPayload = validatePlatformUserIdentityPayload(payload);

  const existingUser = await findPlatformUserByEmail(validatedPayload.email);

  if (existingUser) {
    throw new AppError('Email already exists.', 409);
  }

  const latestUserCode = await getLatestUserCode();
  const userCode = generateNextUserCode(latestUserCode);
  const generatedPassword = generateRandomPassword();
  const passwordHash = await argon2.hash(generatedPassword, {
    type: argon2.argon2id,
  });

  const user = await createPlatformUser({
    userCode,
    email: validatedPayload.email,
    fullName: validatedPayload.fullName,
    passwordHash,
  });

  return {
    ...user,
    generatedPassword,
  };
}

export async function seedRootPlatformUser() {
  const existingRootUser = await findRootPlatformUser();

  if (existingRootUser) {
    console.log(`Root platform user already exists: ${existingRootUser.Email}`);
    return existingRootUser;
  }

  const rootPayload = {
    email: env.root.email,
    fullName: env.root.fullName,
    password: env.root.password,
  };

  const validatedPayload = validateRootPlatformUserPayload(rootPayload);
  const existingEmailUser = await findPlatformUserByEmail(validatedPayload.email);

  if (existingEmailUser) {
    throw new AppError('Root email already exists but is not marked as root.', 409);
  }

  const latestUserCode = await getLatestUserCode();
  const userCode = generateNextUserCode(latestUserCode);
  const passwordHash = await argon2.hash(validatedPayload.password, {
    type: argon2.argon2id,
  });

  const rootUser = await createPlatformUser({
    userCode,
    email: validatedPayload.email,
    fullName: validatedPayload.fullName,
    passwordHash,
    isRoot: true,
  });

  console.log(`Root platform user created: ${rootUser.Email}`);
  return rootUser;
}
