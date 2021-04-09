const { PrismaClient } = require("@prisma/client"); // Import prisma client

let prisma;

// Setup prisma client
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  // if running in dev mode, make sure hot reloads don't open a new connection
  if (!global.prisma) {
    console.log("creating new prisma client")
    global.prisma = new PrismaClient()
  }

  prisma = global.prisma
}


// Export prisma client
export default prisma;
