import { createClient } from "@sanity/client";
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: import.meta.env.PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  token: import.meta.env.PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});
