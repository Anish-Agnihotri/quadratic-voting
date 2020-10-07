import axios from "axios";
import { useRouter } from "next/router";
import Layout from "components/layout";
import Navigation from "components/navigation";
import { useState, useEffect } from "react";
import Loader from "components/loader";

function Vote({ query }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [votes, setVotes] = useState(null);
  const [credits, setCredits] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  const calculateVotes = (rData) => {
    const votesArr = rData.vote_data.map((item, i) => item.votes);
    const votesArrMultiple = votesArr.map((item, i) => item * item);
    setVotes(votesArr);
    setCredits(
      rData.event_data.credits_per_voter -
        votesArrMultiple.reduce((a, b) => a + b, 0)
    );
  };

  const makeVote = (index, increment) => {
    const tempArr = votes;
    increment
      ? (tempArr[index] = tempArr[index] + 1)
      : (tempArr[index] = tempArr[index] - 1);

    setVotes(tempArr);
    const sumVotes = tempArr
      .map((num, _) => num * num)
      .reduce((a, b) => a + b, 0);
    setCredits(data.event_data.credits_per_voter - sumVotes);
  };

  useEffect(() => {
    axios
      .get(`/api/events/find?id=${query.user}`)
      .then((response) => {
        setData(response.data);
        setName(
          response.data.voter_name !== null ? response.data.voter_name : ""
        );
        calculateVotes(response.data);
        setLoading(false);
      })
      .catch(() => {
        console.log("error");
        router.push("/place?error=true");
      });
  }, []);

  const calculateShow = (current, increment) => {
    const canOccur =
      Math.abs(Math.pow(current, 2) - Math.pow(current + 1, 2)) <= credits;

    if (current === 0 && credits === 0) {
      return false;
    }

    // Add
    if (increment) {
      return current <= 0 ? true : canOccur;
      // Subtract
    } else {
      return current >= 0 ? true : canOccur;
    }
  };

  const submitVotes = async () => {
    setSubmitLoading(true);

    const { status } = await axios.post("/api/events/vote", {
      id: query.user,
      votes: votes,
      name: name,
    });

    if (status === 200) {
      router.push(`success?event=${data.event_id}&user=${query.user}`);
    } else {
      router.push(`failure?event=${data.event_id}&user=${query.user}`);
    }

    setSubmitLoading(false);
  };

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
        {!loading ? (
          <div className="vote__info">
            <div className="vote__info_heading">
              <h1>Place your votes</h1>
              <p>
                You can use up to{" "}
                <strong>{data.event_data.credits_per_voter} credits</strong> to
                vote during this event.
              </p>
            </div>

            <div className="event__details">
              <div className="vote__loading event__summary">
                <h2>{data.event_data.event_title}</h2>
                <p>{data.event_data.event_description}</p>
              </div>
            </div>

            <div className="event__options">
              <h2>General Information</h2>
              <div className="divider" />
              <div className="event__option_item">
                <div>
                  <label>Voter Name</label>
                  <p>Please enter your full name:</p>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="event__options">
              <h2>Voteable Options</h2>
              <div className="divider" />
              <div className="event__options_list">
                {data.vote_data.map((option, i) => {
                  return (
                    <div key={i} className="event__option_item">
                      <div>
                        <div>
                          <label>Title</label>
                          <h3>{option.title}</h3>
                        </div>
                        {option.description !== "" ? (
                          <div>
                            <label>Description</label>
                            <p>{option.description}</p>
                          </div>
                        ) : null}
                        {option.url !== "" ? (
                          <div>
                            <label>Link</label>
                            <a
                              href={option.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {option.url}
                            </a>
                          </div>
                        ) : null}
                      </div>
                      <div className="event__option_item_vote">
                        <label>Votes</label>
                        <span className="item__vote_credits">
                          Remaining credits: {credits}
                        </span>
                        <input type="number" value={votes[i]} disabled />
                        <div className="item__vote_buttons">
                          {calculateShow(votes[i], false) ? (
                            <button onClick={() => makeVote(i, false)}>
                              -
                            </button>
                          ) : (
                            <button className="button__disabled" disabled>
                              -
                            </button>
                          )}
                          {calculateShow(votes[i], true) ? (
                            <button onClick={() => makeVote(i, true)}>+</button>
                          ) : (
                            <button className="button__disabled" disabled>
                              +
                            </button>
                          )}
                        </div>
                        {data.voter_name !== "" && data.voter_name !== null ? (
                          <div className="existing__votes">
                            <span>
                              You last allocated{" "}
                              <strong>{data.vote_data[i].votes} votes </strong>
                              to this option.
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {name !== "" ? (
              submitLoading ? (
                <button className="submit__button" disabled>
                  <Loader />
                </button>
              ) : (
                <button onClick={submitVotes} className="submit__button">
                  Submit Votes
                </button>
              )
            ) : (
              <button className="submit__button button__disabled" disabled>
                Enter your name to vote
              </button>
            )}
          </div>
        ) : (
          <div className="vote__loading">
            <h1>Loading...</h1>
            <p>Please give us a moment to retrieve your voting profile.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .vote {
          text-align: center;
        }

        .vote__info {
          max-width: 660px;
          width: calc(100% - 40px);
          margin: 50px 0px;
          padding: 0px 20px;
          display: inline-block;
          position: relative;
        }

        .event__summary {
          display: inline-block;
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          background-color: #fff;
          margin: 20px 0px !important;
        }

        .event__summary > h2 {
          color: #00d182;
          margin: 0px;
        }

        .vote__loading {
          max-width: 660px;
          width: 100%;
          border-radius: 10px;
          display: inline-block;
          margin: 50px 20px 0px 20px;
          border: 1px solid #e7eaf3;
          padding: 30px 0px;
        }

        .vote__loading > h1,
        .vote__info_heading > h1 {
          color: #0f0857;
          margin: 0px;
        }

        .event__options {
          margin-top: 60px;
          text-align: left;
        }

        .event__options > h2 {
          color: #0f0857;
          margin-block-end: 0px;
        }

        .divider {
          border-top: 1px solid #e7eaf3;
          margin-top: 5px;
        }

        .vote__loading > p,
        .vote__info_heading > p {
          font-size: 18px;
          line-height: 150%;
          color: rgb(107, 114, 128);
          margin: 0px;
        }

        .event__option_item {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #e7eaf3;
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          max-width: 700px;
          width: 100%;
          margin: 25px 0px;
          text-align: left;
        }

        .event__option_item > div:nth-child(1) {
          padding: 15px;
        }

        .event__option_item label {
          display: block;
          color: #587299;
          font-weight: bold;
          font-size: 18px;
          text-transform: uppercase;
        }

        .event__option_item > div > div {
          margin: 25px 0px;
        }
        
        .event__option_item > div > div:nth-child(1) {
          margin-top: 5px;
        }

        .event__option_item > div > div:nth-last-child(1) {
          margin-bottom: 5px;
        }

        .event__option_item h3 {
          margin: 2px 0px;
        }

        .event__option_item p {
          margin-top 5px;
        }

        .event__option_item a {
          text-decoration: none;
        }

        .event__option_item input {
          width: calc(100% - 10px);
          font-size: 18px;
          border-radius: 5px;
          border: 1px solid #e7eaf3;
          padding: 10px 5px;
          background-color: #fff;
        }

        .event__option_item_vote {
          border-top: 2px solid #e7eaf3;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          padding: 15px;
        }

        .event__option_item_vote input {
          text-align: center;
          font-weight: bold;
        }

        .item__vote_buttons {
          margin: 10px 0px 0px 0px !important;
        }

        .item__vote_buttons > button {
          width: 49%;
          font-size: 22px;
          font-weight: bold;
          border-radius: 5px;
          border: none;
          transition: 50ms ease-in-out;
          padding: 5px 0px;
          cursor: pointer;
          color: #fff;
        }

        .item__vote_buttons > button:nth-child(1) {
          margin-right: 1%;
          background-color: #0f0557;
        }

        .item__vote_buttons > button:nth-child(2) {
          margin-left: 1%;
          background-color: #00cc7e;
        }

        .item__vote_buttons > button:hover {
          opacity: 0.8;
        }
        
        .button__disabled {
          background-color: #e7eaf3 !important;
          color: #000 !important;
          cursor: not-allowed !important;
        }

        .item__vote_credits {
          color: rgb(107, 114, 128);
          font-size: 14px;
          text-align: right;
          display: block;
          transform: translateY(-7.5px);
        }

        .submit__button {
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
          margin-top: 50px;
        }

        .submit__button:hover {
          opacity: 0.8;
        }

        .existing__votes {
          background-color: #ffffe0;
          padding: 7.5px 10px;
          width: calc(100% - 22px);
          border-radius: 5px;
          text-align: center;
          border: 1px solid #fada5e;
        }
      `}</style>
    </Layout>
  );
}

Vote.getInitialProps = ({ query }) => {
  return { query };
};

export default Vote;
