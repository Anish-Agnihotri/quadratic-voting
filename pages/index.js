import Link from "next/link"; // Dynamic links
import Layout from "components/layout"; // Layout wrapper

export default function Home() {
  return (
    // Home page
    <Layout>
      <div className="home">
        {/* Home heading */}
        <div className="home__content">
          <h1>Quadratic Voting</h1>
          <h2>Real-time dashboard</h2>
          <p>
            Quadratic Voting is the mathematically optimal way to vote in a
            democratic community. Vote through collective decision-making, by
            allocating votes that express the <i>degree</i> of your preferences,
            not just <i>direction</i>.
          </p>
        </div>

        {/* Home buttons */}
        <div className="home__cta">
          <div className="home__cta_button">
            <img src="/vectors/create_event.svg" alt="Create event" />
            <h2>Create an event</h2>
            <p>Setup Quadratic Voting for your event.</p>
            <Link href="/create">
              <a>Setup Event</a>
            </Link>
          </div>
          <div className="home__cta_button">
            <img src="/vectors/place_vote.svg" alt="Place vote" />
            <h2>Place your vote</h2>
            <p>Use your secret code to place votes.</p>
            <Link href="/vote">
              <a>Place Votes</a>
            </Link>
          </div>
        </div>

        {/* Scoped styling */}
        <style jsx>{`
          .home__content {
            max-width: 700px;
            padding: 50px 20px 0px 20px;
            margin: 0px auto;
          }

          .home__content > h1 {
            font-size: 40px;
            color: #0f0857;
            margin: 0px;
          }

          .home__content > h2 {
            color: #00d182;
            margin-block-start: 0px;
          }

          .home__content > p {
            font-size: 18px;
            line-height: 150%;
            color: rgb(107, 114, 128);
          }

          .home__cta {
            padding-top: 20px;
          }

          .home__cta_button {
            display: inline-block;
            max-width: 270px;
            width: calc(100% - 70px);
            background-color: #fff;
            margin: 20px;
            border-radius: 8px;
            border: 1px solid #e7eaf3;
            box-shadow: 0 0 35px rgba(127, 150, 174, 0.125);
            padding: 15px;
            vertical-align: top;
          }

          .home__cta_button > img {
            height: 90px;
            margin-top: 15px;
          }

          .home__cta_button > h2 {
            color: #0f0857;
            margin-block-end: 0px;
          }

          .home__cta_button > p {
            color: #587299;
            margin-block-start: 5px;
            margin-block-end: 40px;
          }

          .home__cta_button > a {
            text-decoration: none;
            padding: 12px 0px;
            width: 100%;
            display: inline-block;
            border-radius: 5px;
            background-color: #0f0857;
            color: #fff;
            font-size: 18px;
            transition: 100ms ease-in-out;
          }

          .home__cta_button > a:hover {
            opacity: 0.8;
          }
        `}</style>
      </div>
    </Layout>
  );
}
