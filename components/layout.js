import Head from "next/head"; // Header settings
import Link from "next/link"; // Dynamic links

export default function Layout(props) {
  return (
    // Global layout setup
    <div className="layout">
      {/* Header */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Page global header */}
      <div className="layout__header">
        <Link href="/">
          <a>
            <img
              src="https://s.gitcoin.co/static/v2/images/logo_med_hover.c2969168bf04.gif"
              alt="Gitcoin logo"
            />
          </a>
        </Link>
      </div>

      {/* Page content */}
      <div className="layout__content">{props.children}</div>

      {/* Global styling */}
      <style jsx global>{`
        body {
          padding: 0px;
          margin: 0px;
          font-family: "Roboto", sans-serif;
        }
      `}</style>

      {/* Scoped layout styling */}
      <style jsx>{`
        .layout__header {
          height: 65px;
          box-shadow: 0px 2px 10px rgba(151, 164, 175, 0.1);
          padding: 0px 20px;
          width: calc(100% - 40px);
          background-image: url("/header-bg.png");
          background-position: center top;
        }

        .layout__header > a {
          text-decoration: none;
          transition: 100ms ease-in-out;
        }

        .layout__header > a:hover {
          opacity: 0.8;
        }

        .layout__header > a > img {
          height: 45px;
          margin-top: 6.5px;
        }

        .layout__content {
          min-height: calc(100vh - 65px);
          background-color: #f6f9fc;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
