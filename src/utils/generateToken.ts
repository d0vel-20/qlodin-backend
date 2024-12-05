import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  role: string;
}

export const generateToken = (id: string, role: string): string => {
  const threeMonthsInSeconds = 90 * 24 * 60 * 60; // 90 days
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: threeMonthsInSeconds });
};

// Utility to decode token
export const decodeToken = (token: string): DecodedToken => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
};


export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '7d', // Refresh token expires in 7 days
  });
};