import { PrismaClient } from '@prisma/client';

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test the database connection
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

// Initialize the database when the application starts
initializeDatabase();

export { prisma };
