"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function EditPatientPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchPatient();
  }, []);

  const fetchPatient = async () => {
    try {
      const res = await fetch(`/api/patient?id=${id}`);
      const data = await res.json();

      setForm({
        id: data.id,
        fullName: data.full_name,
        medicalRecord: data.medical_record,
        nik: data.nik,
        motherName: data.mother_name,
        birthPlace: data.birth_place,
        birthDate: data.birth_date,
        gender: data.gender,
        religion: data.religion,
        phone: data.phone,
        clinic: data.clinic,
      });

      setLoading(false);
    } catch {
      alert("Failed to load data");
    }
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nik" || name === "phone") {
      if (!/^\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/patient", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to update data");
      setIsSubmitting(false);
      return;
    }

    alert("Data updated successfully");
    router.push("/dashboard");
  };

  if (loading || !form) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  /* ================= RENDER ================= */

  return (
    <>
      <Navbar hideTitle />

      <div style={page}>
        <div style={card}>
          <div style={cardHeader}>
            <h1 style={cardTitle}>Edit Patient Data</h1>
          </div>

          <form onSubmit={handleSubmit} style={formGrid}>
            <Input label="Full Name *" name="fullName" value={form.fullName} onChange={handleChange} />
            <Input label="Medical Records Number" name="medicalRecord" value={form.medicalRecord} disabled />

            <Input label="NIK *" name="nik" maxLength={16} value={form.nik} onChange={handleChange} />
            <Input label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} />

            <Input label="Birth Place *" name="birthPlace" value={form.birthPlace} onChange={handleChange} />
            <Input label="Date of Birth *" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />

            <Select label="Gender *" name="gender" value={form.gender} options={["Male", "Female"]} onChange={handleChange} />
            <Select label="Religion *" name="religion" value={form.religion} options={["Islam", "Christian", "Catholic", "Hinduism", "Buddha", "Khonghucu"]} onChange={handleChange} />

            <Input label="Telephone Number *" name="phone" value={form.phone} onChange={handleChange} />
            <Select label="Specialist Clinic *" name="clinic" value={form.clinic} options={["General", "Dental", "Pediatric", "Neurologist", "Orthopedic", "Urologist", "Cardiologist", "Dermatologist", "Obstetrician"]} onChange={handleChange} />

            {/* ACTION BUTTON */}
            <div style={actionRow}>
              <div style={leftActions}>
                <button
                  type="button"
                  style={btnSecondary}
                  onClick={() => router.back()}
                >
                  Back
                </button>
              </div>

              <button type="submit" style={btnPrimary} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function Input({ label, name, value, onChange, disabled, ...props }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...inputStyle,
          backgroundColor: disabled ? "#f3f4f6" : "#fff",
          cursor: disabled ? "not-allowed" : "text",
        }}
        {...props}
      />
    </div>
  );
}


function Select({ label, name, value, options, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select name={name} value={value || ""} onChange={onChange} style={inputStyle}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: 24,
};

const card = {
  background: "#fff",
  maxWidth: 1100,
  margin: "0 auto",
  borderRadius: 10,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const cardHeader = {
  background: "#3f5f3f",
  padding: "16px 24px",
};

const cardTitle = {
  color: "#fff",
  fontSize: 20,
  fontWeight: 600,
};

const formGrid = {
  padding: 24,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const actionRow = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "space-between",
  marginTop: 24,
};

const leftActions = {
  display: "flex",
  gap: 12,
};

const btnPrimary = {
  background: "#3f5f3f",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
};

const btnSecondary = {
  background: "#6b7280",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
};
