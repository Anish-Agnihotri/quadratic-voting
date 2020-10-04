import Link from "next/link"; // Dynamic links
import Layout from "components/layout"; // Layout wrapper
import Navigation from "components/navigation"; // Navigation component

function Failure({ query }) {
  return (
    <Layout>
      {/* Navigation header */}
      <Navigation
        history={{
          title: "Voting",
          link: `/vote?user=${query.user}`,
        }}
        title="Vote Failure"
      />

      {/* Failure dialog */}
      <div className="failure">
        <h1>Oops! Your vote failed.</h1>
        <p>This shouldn't happen—please try again later!</p>

        {/* Return to voting */}
        <Link href={`/vote?user=${query.user}`}>
          <a>Try voting again</a>
        </Link>

        {/* Redirect to event dashboard */}
        <Link href={`/event?id=${query.event}`}>
          <a>See event dashboard</a>
        </Link>
      </div>

      {/* Scoped styling */}
      <style jsx>{`
        .failure {
          max-width: 700px;
          width: calc(100% - 40px);
          padding: 50px 20px 0px 20px;
          margin: 0px auto;
        }

        .failure > h1 {
          font-size: 40px;
          color: #0f0857;
          margin: 0px;
        }

        .failure > p {
          font-size: 18px;
          line-height: 150%;
          color: rgb(107, 114, 128);
          margin-block-start: 0px;
        }

        .failure > a {
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
        }

        .failure > a:hover {
          opacity: 0.8;
        }

        .failure > a:nth-of-type(1) {
          background-color: #dde1ee;
          color: #0f0857;
        }

        .failure > a:nth-of-type(2) {
          background-color: #0f0857;
          color: #fff;
        }
      `}</style>
    </Layout>
  );
}

// On initial page load:
Failure.getInitialProps = ({ query }) => {
  // Collect URL params
  return { query };
};

export default Failure;
