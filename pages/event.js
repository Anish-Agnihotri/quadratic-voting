import Layout from "components/layout"; // Layout wrapper
import Navigation from "components/navigation"; // Navigation
import useSWR from "swr";
import fetch from "unfetch";
import moment from "moment";
import { HorizontalBar } from "react-chartjs-2";

const fetcher = (url) => fetch(url).then((r) => r.json());

function Event({ query }) {
  const { data, loading } = useSWR(
    `/api/events/details?id=${query.id}`,
    fetcher
  );

  return (
    <Layout>
      {/* Navigation header */}
      <Navigation
        history={{
          title:
            query.secret && query.secret !== "" ? "event creation" : "home",
          link: query.secret && query.secret !== "" ? `/create` : "/",
        }}
        title="Event Details"
      />

      <div className="event">
        <h1>Event Details</h1>
        <p>Event statistics dashboard.</p>

        {/* Event public URL */}
        <div className="event__section">
          <label>Event URL</label>
          <p>Statistics dashboard URL</p>
          <input
            className="copyable__input"
            value={`https://localhost:3000/event?id=${query.id}`}
            readOnly
          />
        </div>

        {/* Event public URL */}
        <div className="event__section">
          <label>Event Votes</label>
          <p>Quadratic Voting-weighted voting results</p>
          {!loading && data ? (
            <div className="chart">
              <HorizontalBar data={data.chart} width={90} height={60} />
            </div>
          ) : (
            <div className="loading__chart">
              <h3>Loading Chart...</h3>
              <span>Please give us a moment</span>
            </div>
          )}
        </div>

        <div className="event__section">
          <label>Event Statistics</label>
          <div className="event__sub_section">
            <label>Event Started</label>
            <h3>
              {!loading && data
                ? moment(data.event.start_event_data).fromNow()
                : "Loading..."}
            </h3>
          </div>
          <div className="event__sub_section">
            <label>Event Finished</label>
            <h3>
              {!loading && data
                ? moment(data.event.end_event_data).fromNow()
                : "Loading..."}
            </h3>
          </div>
          <div className="event__sub_section">
            <label>Voting Participants</label>
            <h3>
              {!loading && data
                ? `${data.statistics.numberVoters.toLocaleString()} / ${data.statistics.numberVotersTotal.toLocaleString()}`
                : "Loading..."}
            </h3>
          </div>
          <div className="event__sub_section">
            <label>Votes Placed</label>
            <h3>
              {!loading && data
                ? `${data.statistics.numberVotes.toLocaleString()} / ${data.statistics.numberVotesTotal.toLocaleString()}`
                : "Loading..."}
            </h3>
          </div>
        </div>
      </div>

      <style jsx>{`
        .event {
          max-width: 700px;
          padding: 40px 20px 75px 20px;
          margin: 0px auto;
        }

        .event > h1 {
          font-size: 40px;
          color: #0f0857;
          margin: 0px;
        }

        .event > p {
          font-size: 18px;
          line-height: 150%;
          color: rgb(107, 114, 128);
          margin-block-start: 0px;
        }

        .event__section {
          background-color: #fff;
          background-color: #fff;
          border-radius: 8px;
          border: 1px solid #e7eaf3;
          box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
          padding: 15px;
          width: calc(100% - 30px);
          margin: 25px 0px;
          text-align: left;
        }

        .event__section > label,
        .event__sub_section > label {
          display: block;
          color: #587299;
          font-weight: bold;
          font-size: 18px;
          text-transform: uppercase;
        }

        .event__section > p {
          margin: 0px;
        }

        .event__section > input {
          width: calc(100% - 10px);
          max-width: calc(100% - 10px);
          font-size: 18px;
          border-radius: 5px;
          border: 1px solid #e7eaf3;
          margin-top: 15px;
          padding: 8px 5px;
        }

        .event__sub_section {
          width: calc(50% - 52px);
          display: inline-block;
          margin: 10px;
          padding: 15px;
          border: 1px solid #e7eaf3;
          border-radius: 5px;
          vertical-align: top;
        }

        .event__sub_section > h3 {
          margin: 0px;
        }

        .chart {
          margin-top: 20px;
          width: calc(100% - 20px);
          padding: 10px;
          border: 1px solid #e7eaf3;
          border-radius: 5px;
        }

        @media screen and (max-width: 700px) {
          .event__sub_section {
            width: calc(100% - 52px);
          }
        }
      `}</style>
    </Layout>
  );
}

Event.getInitialProps = ({ query }) => {
  return { query };
};

export default Event;
