const { PrismaClient } = require("@prisma/client"); // Import prisma client

// Setup prisma client
const prisma = new PrismaClient();

// --> /api/events/details
export default async (req, res) => {
  // Collect event ID and secret key (if it exists) from request
  const {
    query: { id, secret_key },
  } = req;

  // Collect event information from event ID
  const event = await prisma.events.findOne({
    where: { id: id },
  });

  // Collect voter information using event ID
  const voters = await prisma.voters.findMany({
    where: { event_uuid: id },
  });

  // Check for administrator access based on passed secret_key
  const isAdmin = event.secret_key === secret_key ? true : false;
  // After checking for administrator access, delete secret_key from event object
  delete event.secret_key;

  // Collect voting stastistics
  const statistics = generateStasistics(
    // Number of voteable subjects
    JSON.parse(event.event_data).length,
    // Number of max voters
    event.num_voters,
    // Number of credits per voter
    event.credits_per_voter,
    // Array of voter preferences
    voters
  );

  // If private_key enables administrator access
  if (isAdmin) {
    // Pass individual voter row details to endpoint
    event.voters = voters;
  }

  // Parse event_data
  event.event_data = JSON.parse(event.event_data);

  // Generate chart data for chartJS
  const chart = generateChart(event.event_data, statistics.qv);

  // Return event data, computed statistics, and chart
  res.send({
    event,
    statistics,
    chart,
  });
};

/**
 * Generate QV Statistics and weights
 * @param {number} subjects number of subjects
 * @param {number} num_voters number of max voters
 * @param {number} credits_per_voter number of credits per voter
 * @param {voter[]} voters array of voter preferences
 * @return {object} containing QV statistics and calculated weights
 */
function generateStasistics(subjects, num_voters, credits_per_voter, voters) {
  let numberVoters = 0, // Placeholder for number of participating voters
    numberVotes = 0, // Placeholder for number of placed votes
    qvRaw = new Array(subjects).fill([]); // Empty raw array to hold individual votes

  // For each voter
  for (const voter of voters) {
    // Collect voter preferences
    const voter_data = voter.vote_data;

    // Sum voter preferences to check if user has placed at least 1 vote
    const sumVotes = voter_data
      .map((subject) => subject.votes)
      .reduce((prev, curr) => prev + curr, 0);

    // If user has placed a vote:
    if (sumVotes > 0) {
      numberVoters++; // Increment number of participating voters
      numberVotes += sumVotes; // Increment number of placed votes

      // For each of a users votes:
      for (let i = 0; i < voter_data.length; i++) {
        // Increment raw voting array for each subject
        qvRaw[i] = [...qvRaw[i], voter_data[i].votes];
      }
    }
  }

  // Calculate QV weights from raw votes
  const qv = calculateQV(qvRaw);

  // Return computed statistics
  return {
    totalVoters: voters.length,
    numberVotersTotal: num_voters,
    numberVoters,
    numberVotesTotal: credits_per_voter * num_voters,
    numberVotes,
    voterParticiptation: (voters.length / numberVoters) * 100,
    qvRaw,
    qv,
  };
}

/**
 * Calculates and returns sujects weights based on QV forumla
 * @param {integer[][]} qvRaw
 * @returns {integer[]} containing QV weights
 */
function calculateQV(qvRaw) {
  let mapped = [],
    sumWeight = 0;

  // *** Quadratic Voting Calculation ***
  // For individual subjects in qvRaw
  for (const subjectVotes of qvRaw) {
    let summedVotes = 0; // Summed weight

    // For individual votes for each subject
    for (const individualVotes of subjectVotes) {
      // Calculate vote sqrt
      summedVotes += Math.sqrt(individualVotes);
    }

    // Square summed weight
    summedVotes *= summedVotes;

    // Add per-subject weights to sumWeight
    sumWeight += summedVotes;

    // Push subject weights to mapped array
    mapped.push(summedVotes);
  }

  let weights = []; // Final weights array

  // For each culmulative QV weight
  for (const calculatedVotes of mapped) {
    // Calculate individual weight (out of 100%) by dividing by sumWeight
    weights.push(calculatedVotes / sumWeight);
  }

  // Return per-subject array of QV weights
  return weights;
}

/**
 * Returns chartJS chart data
 * @param {subjects[]} subjects qv subjects
 * @param {integer[]} weights qv subject weights
 */
function generateChart(subjects, weights) {
  let labels = []; // Placeholder labels
  let data = []; // Placeholder series weight array

  // For each subject
  for (let i = 0; i < subjects.length; i++) {
    // Collect title for xaxis
    labels.push(subjects[i].title);
    // Collect weight for series
    data.push(weights[i] * 100);
  }

  // Return data in chartJS format
  return {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(15, 8, 87, 1)",
        label: "Vote Percentage",
        data,
      },
    ],
  };
}
