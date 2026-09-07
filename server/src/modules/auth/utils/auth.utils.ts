import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";
import type { AuthUserDto } from "../types/auth.types.js";

const SESSION_HASH_ROUNDS = 10;

export const hashPassword = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SESSION_HASH_ROUNDS);
  return bcrypt.hash(plain, salt);
};

export const comparePassword = async (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

export const signToken = (payload: AuthUserDto, expiresIn: string = env.JWT_EXPIRES_IN): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn } as jwt.SignOptions);

export const signRefreshToken = (payload: AuthUserDto, expiresIn: string = env.JWT_REFRESH_EXPIRES_IN): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn } as jwt.SignOptions);

export const verifyToken = (token: string): jwt.JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;

export const verifyRefreshToken = (token: string): jwt.JwtPayload =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;

export const generateSessionToken = (): string => crypto.randomBytes(32).toString("hex");

/**
 * Hash a session token using SHA-256 for deterministic DB lookup.
 * Session tokens are high-entropy random strings — the hash prevents
 * token misuse if the DB is compromised.
 */
export const hashSessionToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const compareSessionToken = (token: string, hash: string): boolean =>
  hashSessionToken(token) === hash;

export const generateTokenPair = (user: AuthUserDto) => {
  const token = signToken(user);
  const refreshToken = signRefreshToken(user);
  return { token, refreshToken };
};
