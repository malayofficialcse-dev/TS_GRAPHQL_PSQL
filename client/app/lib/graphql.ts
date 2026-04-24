export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:5000/graphql";

export type GraphQLVariables = Record<string, unknown>;

export async function fetchGraphQL<T = any>(query: string, variables?: GraphQLVariables): Promise<T> {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((error: any) => error.message).join(" | ") || "GraphQL error");
  }

  return json.data;
}
