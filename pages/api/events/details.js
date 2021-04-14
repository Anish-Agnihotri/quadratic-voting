import prisma from "db"; // Import prisma
import moment from "moment"; // Time formatting

// --> /api/events/details
export default async (req, res) => {
  // Collect event ID and secret key (if it exists) from request
  const {
    query: { id, secret_key },
  } = req;

  // Collect event information from event ID
  const event = await prisma.events.findUnique({
    where: { id: id },
  });

  // Collect voter information using event ID
  const voters = await prisma.voters.findMany({
    where: { event_uuid: id },
  });

  // Check for administrator access based on passed secret_key
  const isAdmin =
    event.secret_key && event.secret_key === secret_key ? true : false;
  // After checking for administrator access, delete secret_key from event object
  delete event.secret_key;

  // If private_key enables administrator access
  if (isAdmin) {
    // Pass individual voter row details to endpoint
    event.voters = voters;
  }

  var statistics = null;
  var chart = null;

  // If event is concluded or private_key enables administrator access
  if (isAdmin || (moment() > moment(event.end_event_date))) {
    // Pass voting statistics to endpoint
    statistics = generateStatistics(
      // Number of voteable subjects
      JSON.parse(event.event_data).length,
      // Number of max voters
      event.num_voters,
      // Number of credits per voter
      event.credits_per_voter,
      // Array of voter preferences
      voters
    );
  }

  // Parse event_data
  event.event_data = JSON.parse(event.event_data);

  // If event is concluded or private_key enables administrator access
  if (isAdmin || (moment() > moment(event.end_event_date))) {
    // Generate chart data for chartJS
    chart = generateChart(
      event.event_data,
      statistics.linear,
      statistics.qv
    );
  }

  // If private_key enables administrator access
  if (isAdmin && event.voters) {
    // remove voter name and vote data to keep anonymous from election admins
    const voterIds = event.voters;
    voterIds.forEach((voter, _) => {
      delete voter.voter_name;
      delete voter.vote_data;
    });
    event.voters = voterIds;
  }

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
function generateStatistics(subjects, num_voters, credits_per_voter, voters) {
  let numberVoters = 0, // Placeholder for number of participating voters
    numberVotes = 0, // Placeholder for number of placed votes
    qvRaw = new Array(subjects).fill([]); // Empty raw array to hold individual votes

  // For each voter
  for (const voter of voters) {
    // Collect voter preferences
    const voter_data = voter.vote_data;

    // Sum voter preferences to check if user has placed at least 1 vote
    const sumVotes = voter_data
      .map((subject) => Math.pow(subject.votes, 2))
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

  // Calculate linear weights from raw votes
  const linear = calculateLinear(qvRaw);

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
    linear,
    qv,
  };
}

/**
 * Calculates and returnes subject weights based on linear addition
 * @param {integer[][]} qvRaw
 * @returns {integer[]} containing linear weights
 */
function calculateLinear(qvRaw) {
  let mapped = [],
    sumWeights = 0;

  // For individual subjects in qvRaw
  for (const subjectVotes of qvRaw) {
    // Calculate sum of votes
    const numCredits = subjectVotes.map((item, _) => Math.pow(item, 2));
    const subjectSum = numCredits.reduce((a, b) => a + b, 0);

    // Add sum of votes to sumWeights
    sumWeights += subjectSum;

    // Push linear sum to mapped
    mapped.push(subjectSum);
  }

  let weights = []; // Final weights array

  // For each sum vote in mapped
  for (const sumVotes of mapped) {
    // Divide by total summed # of votes to calculate weight
    weights.push(sumVotes / sumWeights);
  }

  // Return linear weights
  return weights;
}

/**
 * Calculates and returns QV summed votes
 * @param {integer[][]} qvRaw
 * @returns {integer[]} containing QV votes
 */
function calculateQV(qvRaw) {
  let votes = [];

  // For individual subjects in qvRaw
  for (const subjectVotes of qvRaw) {
    // Push subject weights to mapped array which contains summed votes
    votes.push(subjectVotes.reduce((a, b) => a + b, 0));
  }

  // Return votes array
  return votes;
}

/**
 * Returns chartJS chart data
 * @param {subjects[]} subjects voteable subjects
 * @param {integer[]} linearWeights linear subject weights
 * @param {integer[]} weights qv subject weights
 */
function generateChart(subjects, linearWeights, weights) {
  let labels = [], // Placeholder labels
    linearData = [], // Placeholder series linear weight array
    data = []; // Placeholder series weight array

  // For each subject
  for (let i = 0; i < subjects.length; i++) {
    // Collect title for xaxis
    labels.push(subjects[i].title);
    // Collect linear weight for series
    linearData.push((linearWeights[i] * 100).toFixed(2));
    // Collect weight for series
    data.push(weights[i]);
  }

  // Return data in chartJS format
  return {
    labels,
    datasets: [
      {
        backgroundColor: "#000",
        label: "Effective Votes",
        data,
      },
      {
        backgroundColor: "#edff38",
        label: "% Credits",
        data: linearData,
      },
    ],
  };
}
