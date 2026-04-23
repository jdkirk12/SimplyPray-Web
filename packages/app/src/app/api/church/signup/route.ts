import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Supabase admin client (service role) to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { churchId, userId } = await request.json();

    if (!churchId || !userId) {
      return NextResponse.json(
        { error: "churchId and userId are required" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const { data: existing } = await supabaseAdmin
      .from("church_members")
      .select("id, status")
      .eq("church_id", churchId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json(
          { success: true, message: "Already a member" },
          { status: 200 }
        );
      }
      // Reactivate if previously inactive
      await supabaseAdmin
        .from("church_members")
        .update({ status: "active", joined_at: new Date().toISOString() })
        .eq("id", existing.id);

      return NextResponse.json({ success: true });
    }

    // Look up church max_seats
    const { data: church, error: churchError } = await supabaseAdmin
      .from("churches")
      .select("max_seats")
      .eq("id", churchId)
      .single();

    if (churchError || !church) {
      return NextResponse.json(
        { error: "Church not found" },
        { status: 404 }
      );
    }

    // Check current active member count
    const { count } = await supabaseAdmin
      .from("church_members")
      .select("*", { count: "exact", head: true })
      .eq("church_id", churchId)
      .eq("status", "active");

    if (count !== null && count >= church.max_seats) {
      return NextResponse.json(
        { error: "This church has reached its member limit" },
        { status: 409 }
      );
    }

    // Insert new member
    const { error: insertError } = await supabaseAdmin
      .from("church_members")
      .insert({
        church_id: churchId,
        user_id: userId,
        role: "member",
        status: "active",
        joined_at: new Date().toISOString(),
      });

    if (insertError) {
      // Handle unique constraint violation (race condition)
      if (insertError.code === "23505") {
        return NextResponse.json(
          { success: true, message: "Already a member" },
          { status: 200 }
        );
      }
      console.error("Church signup insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to join church" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Church signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
