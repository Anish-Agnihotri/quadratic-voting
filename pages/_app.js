import "react-datetime/css/react-datetime.css"; // React datetime styling
import "react-accessible-accordion/dist/fancy-example.css"; // React accordion styling

// Default application setup
export default function App({ Component, pageProps }) {
  // Return page component with props
  return <Component {...pageProps} />;
}
