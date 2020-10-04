const { PrismaClient } = require("@prisma/client"); // Import prisma client

// Setup prisma client
const prisma = new PrismaClient();

// Export prisma client
export default prisma;
