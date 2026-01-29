import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("medical_record")
      .order("medical_record", { ascending: false })
      .limit(1);

    let nextNumber = 1;

    if (data && data.length > 0 && data[0].medical_record) {
      nextNumber = parseInt(data[0].medical_record, 10) + 1;
    }

    const formatted = String(nextNumber).padStart(6, "0");

    return NextResponse.json({ medicalRecord: formatted });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to generate medical record" },
      { status: 500 }
    );
  }
}
