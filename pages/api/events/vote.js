import prisma from "db"; // Import prisma
import moment from "moment"; // Time formatting

// --> /api/events/vote
export default async (req, res) => {
  const vote = req.body; // Collect vote data from POST

  // Look for current JSON data
  const { vote_data } = await prisma.voters.findUnique({
    // Using individual, secret vote ID passed from request body
    where: { id: vote.id },
    // And select only existing JSON data
    select: { vote_data: true },
  });

  // Collect voter information
  const user = await prisma.voters.findUnique({
    // With ID from request body
    where: {
      id: vote.id,
    },
  });

  // If voter exists in database
  if (user) {
    // Collect event data
    const event_data = await prisma.events.findUnique({
      // By searching for the Event ID from table of Events
      where: {
        id: user.event_uuid,
      },
      // And selecting the appropriate fields
      select: {
        start_event_date: true,
        end_event_date: true,
      },
    });
    if ((moment() > moment(event_data.start_event_date)) &&
      (moment() < moment(event_data.end_event_date))) {
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
        data: {
          voter_name: vote.name !== "" ? vote.name : "",
          vote_data: vote_data,
        },
      });
      // Upon success, respond with 200
      res.status(200).send("Successful update");
    } else {
      // If voting is closed, respond with 400
      res.status(400).send("Voting is closed for this event")
    }
  } else {
    // If user does not exist, respond with 400
    res.status(400).send("Invalid voter link")
  }
};
