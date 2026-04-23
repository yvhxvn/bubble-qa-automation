import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? '',
  prName: process.env.PR_NAME ?? '',
  user: {
    email: process.env.USER_EMAIL ?? '',
    password: process.env.USER_PASSWORD ?? '',
    fullName: process.env.USER_FULLNAME ?? '',
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? '',
    password: process.env.ADMIN_PASSWORD ?? '',
  },
  dp: {
    email: process.env.DP_EMAIL ?? '',
    name: process.env.DP_NAME ?? '',
    password: process.env.DP_PASSWORD ?? '',
    fullName: process.env.DP_FULLNAME ?? '',
  },
};