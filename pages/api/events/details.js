const { PrismaClient } = require("@prisma/client"); // Import prisma client

// Setup prisma client
const prisma = new PrismaClient();

// --> /api/events/details
export default async (req, res) => {
  // Collect event ID and secret key (if it exists) from request
  const {
    query: { id, secret_key },
  } = req;

  const event = await prisma.events.findOne({
    where: { id: id },
  });

  const voters = await prisma.voters.findMany({
    where: { event_uuid: id },
  });

  console.log(voters);

  // const private = event.secret_key === secret_key ? true : false;

  const statistics = generateStasistics(
    JSON.parse(event.event_data).length,
    event.num_voters,
    event.credits_per_voter,
    voters
  );

  delete event.secret_key;

  res.send({
    event,
    statistics,
  });
};

function generateStasistics(subjects, num_voters, credits_per_voter, voters) {
  let numberVoters = 0,
    numberVotes = 0,
    qvRaw = new Array(subjects).fill([]);

  for (const voter of voters) {
    const voter_data = voter.vote_data;
    const sumVotes = voter_data
      .map((subject) => subject.votes)
      .reduce((prev, curr) => prev + curr, 0);

    if (sumVotes > 0) {
      numberVoters++;
      numberVotes += sumVotes;

      for (let i = 0; i < voter_data.length; i++) {
        qvRaw[i] = [...qvRaw[i], voter_data[i].votes];
      }
    }
  }

  const qv = calculateQV(qvRaw);

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

function calculateQV(qvRaw) {
  let mapped = [];
  let totalVotes = 0;

  for (const subjectVotes of qvRaw) {
    let summedVotes = 0;

    for (const individualVotes of subjectVotes) {
      summedVotes += Math.sqrt(individualVotes);
    }

    summedVotes *= summedVotes;
    totalVotes += summedVotes;
    mapped.push(summedVotes);
  }

  let weights = [];

  for (const calculatedVotes of mapped) {
    weights.push(calculatedVotes / totalVotes);
  }

  return weights;
}
