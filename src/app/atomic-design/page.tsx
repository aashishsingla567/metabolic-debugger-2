// Server Component for static data
export const dynamic = "force-static"; // Enable static optimization

import AtomicDesignClient from "./AtomicDesignClient";

// Server Component - handles static content and caching
export default function AtomicDesignPage() {
  return <AtomicDesignClient />;
}
