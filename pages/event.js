import Layout from "components/layout"; // Layout wrapper
import Navigation from "components/navigation"; // Navigation

function Event({ query }) {
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
        <p>Real-time event statistics dashboard.</p>

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
      </div>

      <style jsx>{`
        .event {
          max-width: 700px;
          padding: 40px 20px 0px 20px;
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

        .event__section > label {
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
      `}</style>
    </Layout>
  );
}

Event.getInitialProps = ({ query }) => {
  return { query };
};

export default Event;
