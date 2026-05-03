import { query } from '../../database/pool.js';

export async function findPlatformUserByEmail(email) {
  const result = await query(
    `
      SELECT
        "UserID",
        "UserCode",
        "Email",
        "FullName",
        "Status",
        "IsRoot",
        "CreatedAt"
      FROM public."PlatformUsers"
      WHERE lower("Email") = lower($1)
      LIMIT 1;
    `,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function getLatestUserCode() {
  const result = await query(
    `
      SELECT "UserCode"
      FROM public."PlatformUsers"
      ORDER BY "UserCode" DESC
      LIMIT 1;
    `
  );

  return result.rows[0]?.UserCode ?? null;
}

export async function createPlatformUser({
  userCode,
  email,
  fullName,
  passwordHash,
  status = 'ACTIVE',
  isRoot = false,
  createdByUserId = null,
}) {
  const result = await query(
    `
      INSERT INTO public."PlatformUsers"
      (
        "UserCode",
        "Email",
        "FullName",
        "PasswordHash",
        "Status",
        "IsRoot",
        "PasswordChangedAt",
        "CreatedByUserID"
      )
      VALUES ($1, $2, $3, $4, $5, $6, now(), $7)
      RETURNING
        "UserID",
        "UserCode",
        "Email",
        "FullName",
        "Status",
        "IsRoot",
        "CreatedAt";
    `,
    [userCode, email, fullName, passwordHash, status, isRoot, createdByUserId]
  );

  return result.rows[0];
}
