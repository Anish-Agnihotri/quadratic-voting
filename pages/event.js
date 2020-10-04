import { useRouter } from "next/router"; // Router hooks
import Layout from "components/layout"; // Layout wrapper

export default function Event() {
  const router = useRouter(); // Router object

  return (
    <Layout>
      <div className="event">
        <span>Event details</span>
      </div>
    </Layout>
  );
}
