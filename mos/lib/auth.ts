import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const baseURL = process.env.NEXT_PUBLIC_API_URL;
export const authUser = async (req: NextRequest) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  console.log(data);

  if (!error) {
    if (data) {
      console.log("authed here", data);

      //user authed
      //TODO: take the req.cookies.token and decode it with JWT then compare the calims from the token with the data from supabase claims
      return NextResponse.next();
    } else {
      console.log("not authed here", data);

      return NextResponse.redirect(`${baseURL}/login`);
    }
  } else {
    return NextResponse.redirect(`${baseURL}/error-page`);
  }
};
