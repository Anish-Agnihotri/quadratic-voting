const { PrismaClient } = require("@prisma/client"); // Import prisma client

// Setup prisma client
const prisma = new PrismaClient();

// --> /api/events/vote
export default async (req, res) => {
  const vote = req.body; // Collect vote data from POST

  // Look for current JSON data
  const { vote_data } = await prisma.voters.findOne({
    // Using individual, secret vote ID passed from request body
    where: { id: vote.id },
    // And select only existing JSON data
    select: { vote_data: true },
  });

  // Loop through vote_data in DB
  for (let i = 0; i < vote_data.length; i++) {
    // Update with new votes from request body
    vote_data[i].votes = vote.votes[i];
  }

  // Update voter object
  await prisma.voters.update({
    // Using individual, secret vote ID passed from request body
    where: { id: vote.id },
    // With updated votes from request body + preexisting vote_data from DB
    data: { vote_data: vote_data },
  });

  // Upon success, respond with 200
  res.status(200).send("Successful update");
};
