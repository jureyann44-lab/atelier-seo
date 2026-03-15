import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "943vcjkn",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});
