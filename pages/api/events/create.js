const { PrismaClient } = require("@prisma/client"); // Import prisma client

// Setup prisma client
const prisma = new PrismaClient();

// --> /api/events/create
export default async (req, res) => {
  // Collect event details from request body
  const event = req.body;
  const vote_data = [];

  // Loop through all subjects
  for (const subject of event.subjects) {
    // Assign 0 votes to each subject
    vote_data.push({
      ...subject,
      votes: 0,
    });
  }

  // Fill array with voter data based on num_voters in request body
  const voters = new Array(event.num_voters).fill({
    vote_data: vote_data, // Placeholder zeroed vote_data
  });

  // Create new event
  const createdEvent = await prisma.events.create({
    data: {
      num_voters: event.num_voters,
      credits_per_voter: event.credits_per_voter,
      start_event_date: event.start_event_date,
      end_event_date: event.end_event_date,
      // Stringify voteable subject data
      event_data: JSON.stringify(event.subjects),
      // Create voters from filled array
      Voters: { create: voters },
    },
    select: {
      id: true,
      secret_key: true,
    },
  });

  // Send back created event
  res.send(createdEvent);
};
