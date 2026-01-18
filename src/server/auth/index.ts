/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-redundant-type-constituents */
import NextAuth from "next-auth";
import { authOptions } from "./config";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const getServerAuthSession = () =>
  Promise.resolve<Awaited<ReturnType<typeof NextAuth>> | null>(null);
