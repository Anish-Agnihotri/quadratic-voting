import prisma from "db"; // Import prisma

// --> /api/events/exists
export default async (req, res) => {
  // Collect voter ID from request object
  const {
    query: { id },
  } = req;

  await prisma.voters
    .findMany({
      where: {
        id: id,
      },
    })
    .then((array) => {
      if (array.length > 0) {
        res.status(200).send("Found voter");
      } else {
        res.status(502).send("Unable to find voter");
      }
    })
    .catch(() => res.status(500).send("Unable to find voter"));
};
