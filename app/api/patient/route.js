import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

/* CREATE */
export async function POST(req) {
  const body = await req.json();

  const { error } = await supabase.from("patients").insert([
    {
      full_name: body.fullName,
      medical_record: body.medicalRecord,
      nik: body.nik,
      mother_name: body.motherName,
      birth_place: body.birthPlace,
      birth_date: body.birthDate,
      gender: body.gender,
      religion: body.religion,
      phone: body.phone,
      clinic: body.clinic,
    },
  ]);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "success" });
}

/* READ ALL */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // GET BY ID
  if (id) {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  // GET ALL
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/* UPDATE */
export async function PUT(req) {
  const body = await req.json();

  const { error } = await supabase
    .from("patients")
    .update({
      full_name: body.fullName,
      medical_record: body.medicalRecord,
      nik: body.nik,
      mother_name: body.motherName,
      birth_place: body.birthPlace,
      birth_date: body.birthDate,
      gender: body.gender,
      religion: body.religion,
      phone: body.phone,
      clinic: body.clinic,
    })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "updated" });
}

/* DELETE */
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { error } = await supabase
    .from("patients")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "deleted" });
}
