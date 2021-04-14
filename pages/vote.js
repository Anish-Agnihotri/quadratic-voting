import axios from "axios"; // Axios for requests
import moment from "moment"; // Moment date parsing
import Link from "next/link"; // Dynamic links
import Loader from "components/loader"; // Placeholder loader
import Layout from "components/layout"; // Layout wrapper
import { useRouter } from "next/router"; // Router for URL params
import { useState, useEffect } from "react"; // State management
import Navigation from "components/navigation"; // Navigation component

function Vote({ query }) {
  const router = useRouter(); // Hook into router
  const [data, setData] = useState(null); // Data retrieved from DB
  const [loading, setLoading] = useState(true); // Global loading state
  const [name, setName] = useState(""); // Voter name
  const [votes, setVotes] = useState(null); // Option votes array
  const [credits, setCredits] = useState(0); // Total available credits
  const [submitLoading, setSubmitLoading] = useState(false); // Component (button) submission loading state

  /**
   * Calculates culmulative number of votes and available credits on load
   * @param {object} rData vote data object
   */
  const calculateVotes = (rData) => {
    // Collect array of all user votes per option
    const votesArr = rData.vote_data.map((item, _) => item.votes);
    // Multiple user votes (Quadratic Voting)
    const votesArrMultiple = votesArr.map((item, _) => item * item);
    // Set votes variable to array
    setVotes(votesArr);
    // Set credits to:
    setCredits(
      // Maximum votes -
      rData.event_data.credits_per_voter -
        // Sum of all QV multiplied votes
        votesArrMultiple.reduce((a, b) => a + b, 0)
    );
  };

  /**
   * Update votes array with QV weighted vote increment/decrement
   * @param {number} index of option to update
   * @param {boolean} increment true === increment, else decrement
   */
  const makeVote = (index, increment) => {
    const tempArr = votes; // Collect all votes
    // Increment or decrement depending on boolean
    increment
      ? (tempArr[index] = tempArr[index] + 1)
      : (tempArr[index] = tempArr[index] - 1);

    setVotes(tempArr); // Set votes array
    // Calculate new sumVotes
    const sumVotes = tempArr
      .map((num, _) => num * num)
      .reduce((a, b) => a + b, 0);
    // Set available credits to maximum credits - sumVotes
    setCredits(data.event_data.credits_per_voter - sumVotes);
  };

  /**
   * componentDidMount
   */
  useEffect(() => {
    // Collect voter information on load
    axios
      .get(`/api/events/find?id=${query.user}`)
      // If voter exists
      .then((response) => {
        // Set response data
        setData(response.data);
        // Set name if exists
        setName(
          response.data.voter_name !== null ? response.data.voter_name : ""
        );
        // Calculate QV votes with data
        calculateVotes(response.data);
        // Toggle global loading state to false
        setLoading(false);
      })
      // If voter does not exist
      .catch(() => {
        // Redirect to /place with error state default
        router.push("/place?error=true");
      });
  }, []);

  /**
   * Calculate render state of -/+ buttons based on possible actions
   * @param {number} current number of option votes
   * @param {boolean} increment -/+ button toggle
   */
  const calculateShow = (current, increment) => {
    const canOccur =
      Math.abs(Math.pow(current, 2) - Math.pow(current + 1, 2)) <= credits;
    // Check for absolute squared value of current - absolute squared valueof current + 1 <= credits

    // If current votes === 0, and available credits === 0
    if (current === 0 && credits === 0) {
      // Immediately return false
      return false;
    }

    // Else, if adding
    if (increment) {
      // Check for state of current
      return current <= 0 ? true : canOccur;
    } else {
      // Or check for inverse state when subtracting
      return (current >= 0 ? true : canOccur) && (current !== 0);
    }
  };

  /**
   * Vote submission POST
   */
  const submitVotes = async () => {
    // Toggle button loading state to true
    setSubmitLoading(true);

    // POST data and collect status
    const { status } = await axios.post("/api/events/vote", {
      id: query.user, // Voter ID
      votes: votes, // Vote data
      name: name, // Voter name
    });

    // If POST is a success
    if (status === 200) {
      // Redirect to success page
      router.push(`success?event=${data.event_id}&user=${query.user}`);
    } else {
      // Else, redirec to failure page
      router.push(`failure?event=${data.event_id}&user=${query.user}`);
    }

    // Toggle button loading state to false
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
        {/* Loading state check */}
        {!loading ? (
          <div className="vote__info">
            {/* General voting header */}
            <div className="vote__info_heading">
              <h1>Place your votes</h1>
              <p>
                You can use up to{" "}
                <strong>{data.event_data.credits_per_voter} credits</strong> to
                vote during this event.
              </p>
            </div>

            {/* Project name and description */}
            <div className="event__details">
              <div className="vote__loading event__summary">
                <h2>{data.event_data.event_title}</h2>
                <p>{data.event_data.event_description}</p>
                {data ? (
                  <>
                  {(moment() > moment(data.event_data.end_event_date)) ? (
                    <>
                    <h3>This event has concluded. Click below to to see the results!</h3>
                    {/* Redirect to event dashboard */}
                    <Link href={`/event?id=${data.event_id}`}>
                      <a>See event dashboard</a>
                    </Link>
                    </>
                  ) : (
                    <>
                    {(moment() < moment(data.event_data.start_event_date)) ? (
                      <h3>This event begins {moment(data.event_data.start_event_date).format('MMMM Do YYYY, h:mm:ss a')}</h3>
                    ) : (
                      <h3>This event closes {moment(data.event_data.end_event_date).format('MMMM Do YYYY, h:mm:ss a')}</h3>
                    )}
                    </>
                  )}
                  </>
                ) : null}
              </div>
            </div>

            {/* Ballot */}
            {data ? (
              <>
              {/* Hide ballot if event hasn't started yet */}
              {(moment() < moment(data.event_data.start_event_date)) ? (
                <></>
              ) : (
                <>
                {/* General information */}
                <div className="event__options">
                  <h2>General Information</h2>
                  <div className="divider" />
                  <div className="event__option_item">
                    <div>
                      <label>Voter Name</label>
                      {data ? (
                        <>
                        {(moment() > moment(data.event_data.end_event_date)) ? (
                          <input
                            disabled
                            type="text"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        ) : (
                          <>
                          <p>Please enter your full name:</p>
                          <input
                            type="text"
                            placeholder="Jane Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          </>
                        )}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Voteable options */}
                <div className="event__options">
                  <h2>Voteable Options</h2>
                  <div className="divider" />
                  <div className="event__options_list">
                    {data.vote_data.map((option, i) => {
                      // Loop through each voteable option
                      return (
                        <div key={i} className="event__option_item">
                          <div>
                            <div>
                              <label>Title</label>
                              <h3>{option.title}</h3>
                            </div>
                            {option.description !== "" ? (
                              // If description exists, show description
                              <div>
                                <label>Description</label>
                                <p className="event__option_item_desc">{option.description}</p>
                              </div>
                            ) : null}
                            {option.url !== "" ? (
                              // If URL exists, show URL
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
                            {data ? (
                              <>
                              {(moment() > moment(data.event_data.end_event_date)) ? (
                                <></>
                              ) : (
                                <span className="item__vote_credits">
                                  Remaining credits: {credits}
                                </span>
                              )}
                              </>
                            ) : null}
                            <input type="number" value={votes[i]} disabled />
                            <div className="item__vote_buttons">
                              {data ? (
                                <>
                                {(moment() > moment(data.event_data.end_event_date)) ? (
                                  <></>
                                ) : (
                                  <>
                                    {/* Toggleable button states based on remaining credits */}
                                    {calculateShow(votes[i], false) ? (
                                      <button name="input-element" onClick={() => makeVote(i, false)}>
                                        -
                                      </button>
                                    ) : (
                                      <button className="button__disabled" disabled>
                                        -
                                      </button>
                                    )}
                                    {calculateShow(votes[i], true) ? (
                                      <button name="input-element" onClick={() => makeVote(i, true)}>+</button>
                                    ) : (
                                      <button className="button__disabled" disabled>
                                        +
                                      </button>
                                    )}
                                  </>
                                )}
                                </>
                              ) : null}
                            </div>
                            {data.voter_name !== "" && data.voter_name !== null ? (
                              // If user has voted before, show historic votes
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

                {data ? (
                  <>
                  {(moment() > moment(data.event_data.end_event_date)) ? (
                    <></>
                  ) : (
                    <>
                      {/* Submission button states */}
                      {name !== "" ? (
                        // Check for name being filled
                        submitLoading ? (
                          // Check for existing button loading state
                          <button className="submit__button" disabled>
                            <Loader />
                          </button>
                        ) : (
                          // Else, enable submission
                          <button name="input-element" onClick={submitVotes} className="submit__button">
                            Submit Votes
                          </button>
                        )
                      ) : (
                        // If name isn't filled, request fulfillment
                        <button className="submit__button button__disabled" disabled>
                          Enter your name to vote
                        </button>
                      )}
                    </>
                  )}
                  </>
                ) : null}
                </>
              )}
              </>
            ) : null}
          </div>
        ) : (
          // If loading, show global loading state
          <div className="vote__loading">
            <h1>Loading...</h1>
            <p>Please give us a moment to retrieve your voting profile.</p>
          </div>
        )}
      </div>

      {/* Component scoped CSS */}
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
          color: #000;
          margin: 0px;
        }

        .event__summary > a {
          max-width: 200px;
          width: calc(100% - 40px);
          margin: 10px 20px;
          padding: 12px 0px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 18px;
          display: inline-block;
          text-decoration: none;
          transition: 100ms ease-in-out;
          background-color: #000;
          color: #edff38;
        }

        .event__summary > a:hover {
          opacity: 0.8;
        }

        .vote__loading {
          max-width: 660px;
          width: 100%;
          border-radius: 10px;
          display: inline-block;
          margin: 50px 20px 0px 20px;
          border: 1px solid #f1f2e5;
          padding: 30px 0px;
        }

        .vote__loading > h1,
        .vote__info_heading > h1 {
          color: #000;
          margin: 0px;
        }

        .event__options {
          margin-top: 60px;
          text-align: left;
        }

        .event__options > h2 {
          color: #000;
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
          color: #80806b;
          margin: 0px;
        }

        .event__option_item {
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #f1f2e5;
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
          color: #000;
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
          border: 1px solid #f1f2e5;
          padding: 10px 5px;
          background-color: #fff;
        }

        .event__option_item_desc {
          white-space: pre;
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
          background-color: #edff38;
          color: #000;
        }

        .item__vote_buttons > button:nth-child(2) {
          margin-left: 1%;
          background-color: #000;
          color: #edff38;
        }

        .item__vote_buttons > button:hover {
          opacity: 0.8;
        }

        .button__disabled {
          background-color: #f1f2e5 !important;
          color: #000 !important;
          cursor: not-allowed !important;
        }

        .item__vote_credits {
          color: #80806b;
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
          background-color: #000;
          color: #edff38;
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

// Collect params from URL
Vote.getInitialProps = ({ query }) => {
  return { query };
};

export default Vote;
