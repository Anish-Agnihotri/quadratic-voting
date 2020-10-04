import BeatLoader from "react-spinners/BeatLoader"; // Import BeatLoader

export default function Loader() {
  // Return BeatLoader component for buttons
  return (
    <BeatLoader
      // Transform BeatLoader to be better centered in buttons
      css={{ transform: "translateY(2.5px)" }}
      color="#fff"
      size={10}
      // loading === true as component is functionally rendered
      loading={true}
    />
  );
}
