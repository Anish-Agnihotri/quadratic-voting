const { PrismaClient } = require("@prisma/client"); // Import prisma client

// Setup prisma client
const prisma = new PrismaClient();

// --> /api/events/find
export default async (req, res) => {
  const {
    query: { id },
  } = req; // Collect voter ID from request body

  // If GET request passes ID param
  if (id) {
    const response = {
      exists: false,
      event_id: "",
      vote_data: "",
      credits_per_voter: 0,
    }; // Setup response object

    // Collect voter information
    const user = await prisma.voters.findOne({
      // With ID from request body
      where: {
        id: id,
      },
    });

    // If voter exists in database
    if (user) {
      // Toggle response object exist field
      response.exists = true;
      // Set response event_id field to value retrived from DB
      response.event_id = user.event_uuid;
      // Set response object vote_data field to value retrieved from DB
      response.vote_data = user.vote_data;

      // Collect number of vote credits allower per voter
      const credits_per_voter = await prisma.events.findOne({
        // By searching for the Event ID from table of Events
        where: {
          id: user.event_uuid,
        },
        // And selecting the credits_per_voter field
        select: {
          credits_per_voter: true,
        },
      });

      // Set response object credits_per_votier field to value retrieved from DB
      response.credits_per_voter = credits_per_voter.credits_per_voter;
    }

    // Send edited/unedited response object
    res.send(response);
  } else {
    // Else, without ID param, return 500
    res.status(500).send("No ID Provided");
  }
};
