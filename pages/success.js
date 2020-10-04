import Layout from "components/layout";
import Navigation from "components/navigation";
import Link from "next/link";

function Success({ query }) {
  return (
    <Layout>
      {/* Navigation header */}
      <Navigation
        history={{
          title: "Voting",
          link: `/vote?user=${query.user}`,
        }}
        title="Vote Success"
      />

      <div className="success">
        <h1>Your vote is in!</h1>
        <p>You have successfully placed your votes.</p>
        <Link href={`/vote?user=${query.user}`}>
          <a>Change your votes</a>
        </Link>
        <Link href={`/event?id=${query.event}`}>
          <a>See event dashboard</a>
        </Link>
      </div>

      <style jsx>{`
        .success {
          max-width: 700px;
          width: calc(100% - 40px);
          padding: 50px 20px 0px 20px;
          margin: 0px auto;
        }

        .success > h1 {
          font-size: 40px;
          color: #0f0857;
          margin: 0px;
        }

        .success > p {
          font-size: 18px;
          line-height: 150%;
          color: rgb(107, 114, 128);
          margin-block-start: 0px;
        }

        .success > a {
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

        .success > a:hover {
          opacity: 0.8;
        }

        .success > a:nth-of-type(1) {
          background-color: #dde1ee;
          color: #0f0857;
        }

        .success > a:nth-of-type(2) {
          background-color: #0f0857;
          color: #fff;
        }
      `}</style>
    </Layout>
  );
}

Success.getInitialProps = ({ query }) => {
  return { query };
};

export default Success;
