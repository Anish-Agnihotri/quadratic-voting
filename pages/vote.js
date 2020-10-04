import useSWR from "swr"; // State-while-revalidate
import axios from "axios"; // Axios for requests
import fetch from "unfetch"; // Fetch for requests
import Loader from "components/loader"; // Preloader
import Layout from "components/layout"; // Layout Wrapper
import { useRouter } from "next/router"; // Route management
import { useState, useEffect } from "react"; // State hooks
import Navigation from "components/navigation"; // Navigation component

const fetcher = (url) => fetch(url).then((r) => r.json());

function Vote({ query }) {
  const router = useRouter();
  const [user, setUser] = useState(query.user ? query.user : "");
  const [noUser, setNoUser] = useState("");
  const { data, error } = useSWR(`/api/events/find?id=${user}`, fetcher);
  const [votes, setVotes] = useState(0);
  const [sumVotes, setSumVotes] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const loginUser = () => {
    router.push(`/vote?user=${noUser}`);
    setUser(noUser);
  };

  const increaseVote = (i, increase) => {
    const oldSubjects = subjects;

    if (increase) {
      oldSubjects[i].votes++;
    } else {
      oldSubjects[i].votes--;
    }

    const currentVoteCount = oldSubjects
      .map((subject) => subject.votes)
      .reduce((prev, curr) => prev + curr, 0);
    setSumVotes(currentVoteCount);

    setVotes(
      data.credits_per_voter - (currentVoteCount < 0 ? 0 : currentVoteCount)
    );
    setSubjects(oldSubjects);
  };

  const submitVotes = async () => {
    setLoading(true);

    const { status } = await axios.post("/api/events/vote", {
      id: user,
      votes: subjects.map((subject) => subject.votes),
    });

    if (status === 200) {
      router.push(`success?event=${data.event_id}&user=${user}`);
    } else {
      router.push(`failure?event=${data.event_id}&user=${user}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (data) {
      setSubjects(data.vote_data);
      const currentVoteCount = data.vote_data
        .map((subject) => subject.votes)
        .reduce((prev, curr) => prev + curr, 0);
      setSumVotes(currentVoteCount);
      setVotes(
        data.credits_per_voter - (currentVoteCount < 0 ? 0 : currentVoteCount)
      );
    }
  }, [data]);

  return (
    <Layout>
      {/* Navigation header */}
      <Navigation
        history={{
          title: "Home",
          link: "/",
        }}
        title="Place Votes"
      />

      <div className="vote">
        {!error ? (
          data && data.exists ? (
            <div className="user__vote">
              <h1>Place your votes</h1>
              <p>
                Welcome to the Quadratic Voting dashboard. You can use up to{" "}
                <strong>{data.credits_per_voter} credits</strong> to vote across
                the following voteable subjects.
              </p>

              <div className="remaining__votes">
                <label htmlFor="remaining_credits">
                  Remaining vote credits
                </label>
                <input
                  type="number"
                  id="remaining_credits"
                  value={votes}
                  readOnly
                />
              </div>

              <div className="voteable__subjects">
                <h2>Voteable subjects</h2>
                <div className="voteable__subjects_divider" />
                {subjects.map((subject, i) => {
                  return (
                    <div key={i} className="voteable__subject_item">
                      <div>
                        <label>Title</label>
                        <p>{subject.title}</p>
                      </div>
                      {subject.description ? (
                        <div>
                          <label>Description</label>
                          <p>{subject.description}</p>
                        </div>
                      ) : null}
                      {subject.url ? (
                        <div>
                          <label>Link</label>
                          <a href={subject.url}>{subject.url}</a>
                        </div>
                      ) : null}
                      <div>
                        <br />
                        <label>Your votes</label>
                        <input value={subject.votes} readOnly />
                        {(sumVotes === data.credits_per_voter &&
                          subject.votes === 0) ||
                        subject.votes === 0 ? (
                          <button className="disabled__vote_button" disabled>
                            -
                          </button>
                        ) : (
                          <button onClick={() => increaseVote(i, false)}>
                            -
                          </button>
                        )}
                        {votes === 0 ? (
                          <button className="disabled__vote_button" disabled>
                            +
                          </button>
                        ) : (
                          <button onClick={() => increaseVote(i, true)}>
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button className="submitButton" onClick={submitVotes}>
                  {loading ? <Loader /> : "Submit votes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="no__user">
              <h2>Enter your voting code</h2>
              <p>You enterred an invalid voting code. Try again.</p>
              <input
                value={noUser}
                onChange={(e) => setNoUser(e.target.value)}
                placeholder="0918cd22-a487-4cd0-8e29-8144b9580b80"
              />
              <button onClick={loginUser}>Submit</button>
            </div>
          )
        ) : (
          <div className="no__user">
            <h2>Enter your voting code</h2>
            <p>
              This should be a long code with multiple characters and dashes.
            </p>
            <input
              value={noUser}
              onChange={(e) => setNoUser(e.target.value)}
              placeholder="0918cd22-a487-4cd0-8e29-8144b9580b80"
            />
            <button onClick={loginUser}>Submit</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .user__vote {
          max-width: 700px;
          width: calc(100% - 40px);
          padding: 50px 20px 80px 20px;
          margin: 0 auto;
        }

        .user__vote > h1 {
          font-size: 40px;
          color: #0f0857;
          margin: 0px;
        }

        .user__vote > p {
          font-size: 18px;
          line-height: 150%;
          color: rgb(107, 114, 128);
          margin-block-start: 0px;
        }

        .remaining__votes {
          margin-top: 40px !important;
        }

        .remaining__votes,
        .voteable__subject_item {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #e7eaf3;
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          padding: 15px;
          max-width: 700px;
          width: calc(100% - 30px);
          margin: 25px 0px;
          text-align: left;
        }

        .remaining__votes > label,
        .voteable__subject_item > div > label {
          display: block;
          color: #587299;
          font-weight: bold;
          font-size: 18px;
          text-transform: uppercase;
        }

        .remaining__votes > input {
          font-size: 30px !important;
          padding: 5px 5px !important;
        }

        .voteable__subjects {
          margin-top: 60px;
          color: #0f0857;
        }

        .voteable__subjects > h2 {
          margin-block-end: 0px;
        }

        .voteable__subjects_divider {
          padding-top: 15px;
          border-bottom: 1px solid #dde1ee;
        }

        .voteable__subject_item > div > p,
        .voteable__subject_item > div > a {
          font-size: 18px;
          text-decoration: none;
          margin-block-start: 5px;
        }

        .voteable__subject_item > div > button {
          width: calc(50% - 10px);
          font-size: 30px;
          font-weight: bold;
          margin-top: 20px;
          border-radius: 5px;
          border: none;
          transition: 50ms ease-in-out;
          cursor: pointer;
        }

        .disabled__vote_button {
          background-color: #e7eaf3 !important;
          color: #000 !important;
          cursor: not-allowed !important;
        }

        .voteable__subject_item > div > button:nth-of-type(1) {
          margin-right: 10px;
          background-color: #00cc7e;
          color: #000;
        }

        .voteable__subject_item > div > button:nth-of-type(2) {
          margin-left: 10px;
          background-color: #0f0557;
          color: #fff;
        }

        .voteable__subject_item > div > button:hover {
          opacity: 0.8;
        }

        .no__user {
          display: inline-block;
          max-width: 270px;
          width: 100%;
          background-color: #fff;
          margin: 20px;
          border-radius: 8px;
          border: 1px solid #e7eaf3;
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          padding: 15px;
          vertical-align: top;
          height: 255px;
          margin-top: calc((100vh - 390px) / 2);
        }

        .no__user > h2 {
          color: #0f0857;
          margin-block-end: 0px;
        }

        .no__user > p {
          color: #587299;
          margin-block-start: 5px;
          margin-block-end: 40px;
          line-height: 150%;
        }

        .no__user > input,
        .remaining__votes > input,
        .voteable__subject_item > div > input {
          width: calc(100% - 10px);
          font-size: 18px;
          border-radius: 5px;
          border: 1px solid #e7eaf3;
          margin-top: 15px;
          padding: 10px 5px;
        }

        .no__user > button,
        .submitButton {
          padding: 12px 0px;
          width: 100%;
          display: inline-block;
          border-radius: 5px;
          background-color: #0f0857;
          color: #fff;
          font-size: 16px;
          transition: 100ms ease-in-out;
          border: none;
          cursor: pointer;
          margin-top: 10px;
        }

        .submitButton {
          margin-top: 50px;
        }

        .no__user > button:hover,
        .submitButton:hover {
          opacity: 0.8;
        }
      `}</style>
    </Layout>
  );
}

Vote.getInitialProps = ({ query }) => {
  return { query };
};

export default Vote;
