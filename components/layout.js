import Head from "next/head"; // Header settings
import Link from "next/link"; // Dynamic links

export default function Layout(props) {
  return (
    // Global layout setup
    <div className="layout">
      {/* Header */}
      <Head>        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon/favicon-rxc.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-rxc.png"
        />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/favicon/favicon-rxc.png"
        />
        <meta name="theme-color" content="#ffffff" />

        <title>RxC QV</title>
        <meta name="title" content="RxC QV" />
        <meta
          name="description"
          content="An easy tool to host a quadratic vote"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://quadraticvote.radicalxchange.org/" />
        <meta property="og:title" content="RxC QV" />
        <meta
          property="og:description"
          content="An easy tool to host a quadratic vote"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://quadraticvote.radicalxchange.org/" />
        <meta
          property="twitter:title"
          content="RxC QV"
        />
        <meta
          property="twitter:description"
          content="An easy tool to host a quadratic vote"
        />
{/*
        {props.event ? null : (
          <>
            <meta
              property="og:image"
              content="https://quadraticvote.co/meta.png"
            />
            <meta
              property="twitter:image"
              content="https://quadraticvote.co/meta.png"
            />
          </>
        )}

        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
*/}
      </Head>

      {/* Page global header */}
      <div className="layout__header">
        <Link href="/">
          <a>
            <img
              src="/logo.svg"
              alt="RadicalxChange logo"
            />
          </a>
        </Link>
      </div>

      {/* Page content */}
      <div className="layout__content">{props.children}</div>

      {/* Page footer */}
      <div className="layout__footer">
        <div>
          <a
            href="https://www.radicalxchange.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/logo-yellow.svg"
              alt="RadicalxChange logo"
            />
          </a>
          <div>
            <a
              href="https://github.com/RadicalxChange/quadratic-voting"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/github.png" alt="Github logo" />
            </a>
            <a
              href="https://twitter.com/RadxChange"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/twitter.png" alt="Twitter logo" />
            </a>
          </div>
        </div>
      </div>

      {/* Global styling */}
      <style jsx global>{`
        body {
          padding: 0px;
          margin: 0px;
          font-family: suisse_intlbook;
          background-color: #000;
        }
      `}</style>

      {/* Scoped layout styling */}
      <style jsx>{`
        .layout__header {
          height: 65px;
          box-shadow: 0px 2px 10px rgba(151, 164, 175, 0.1);
          padding: 0px 20px;
          width: calc(100% - 40px);
          background-position: center top;
          background-color: #fefff3;
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
          min-height: calc(100vh - 125px);
          padding-bottom: 60px;
          background-color: #fefff3;
          text-align: center;
        }
        .layout__footer {
          background-position: center top;
          width: calc(100% - 40px);
          padding: 37.5px 20px;
          text-align: center;
          color: #edff38;
          border-top: 3px solid #edff38;
        }
        .layout__footer > p {
          margin: 10px auto;
          line-height: 30px;
        }
        .layout__footer > p > a {
          color: #edff38;
          padding: 1px 3px;
          background-color: #edff38;
          border-radius: 2px;
          font-weight: 500;
          text-decoration: none;
          transition: 100ms ease-in-out;
        }
        .layout__footer > p > a:hover {
          opacity: 0.75;
        }
        .layout__footer > div > a,
        .layout__footer > div > div > a {
          text-decoration: none;
          transition: 100ms ease-in-out;
        }
        .layout__footer > div > a:hover,
        .layout__footer > div > div > a:hover {
          opacity: 0.75;
        }
        .layout__footer > div > a > img {
          height: 50px;
          margin: 10px 0px;
        }
        .layout__footer > div > div > a > img {
          height: 35px;
          filter: invert(100%);
          margin-top: 15px;
          margin-left: 15px;
          margin-right: 15px;
        }

        @font-face {
            font-family: 'suisse_intlbook_italic';
            src: url('./fonts/suisseintl-bookitalic-webfont.woff2') format('woff2'),
                 url('./fonts/suisseintl-bookitalic-webfont.woff') format('woff');
            font-weight: normal;
            font-style: normal;

        }

        @font-face {
            font-family: 'suisse_intlbook';
            src: url('./fonts/suisseintl-book-webfont.woff2') format('woff2'),
                 url('./fonts/suisseintl-book-webfont.woff') format('woff');
            font-weight: normal;
            font-style: normal;

        }

        @font-face {
            font-family: 'messerv2.1condensed';
            src: url('./fonts/messerv2.1-condensed-webfont.woff2') format('woff2'),
                 url('./fonts/messerv2.1-condensed-webfont.woff') format('woff');
            font-weight: normal;
            font-style: normal;

        }
      `}</style>
    </div>
  );
}
