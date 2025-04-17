/** @type {import('next').NextConfig} */
export const target = process.env.NODE_ENV === 'production' ? 'serverless' : 'server';
