"use client";

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import jsPDF from "jspdf";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";


/* ================= INITIAL STATE ================= */

const initialForm = {
  fullName: "",
  medicalRecord: "",
  nik: "",
  motherName: "",
  birthPlace: "",
  birthDate: "",
  gender: "",
  religion: "",
  phone: "",
  clinic: "",
};

/* ================= PAGE ================= */

export default function NewPatientPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNextMedicalRecord = async () => {
  try {
    const res = await fetch("/api/patient/next-record");
    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      medicalRecord: data.medicalRecord,
    }));
  } catch {
    console.error("Failed to fetch medical record");
  }
  };

  useEffect(() => {
    fetchNextMedicalRecord();
  }, []);


  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nik" || name === "phone") {
      if (!/^\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    let err = {};

    if (!form.fullName) err.fullName = "Full name is required";
    if (!form.birthPlace) err.birthPlace = "Birth place is required";
    if (!form.birthDate) err.birthDate = "Birth date is required";
    if (!form.gender) err.gender = "Gender is required";
    if (!form.religion) err.religion = "Religion is required";
    if (!form.clinic) err.clinic = "Clinic is required";

    if (form.nik.length !== 16) err.nik = "NIK must be 16 digits";
    if (form.phone.length < 10) err.phone = "Invalid phone number";

    return err;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationError = validate();
    setError(validationError);

    if (Object.keys(validationError).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const { medicalRecord, ...payload } = form;
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // ⬅️ KIRIM SEMUA TERMASUK medicalRecord
      });

      if (!res.ok) throw new Error("Failed to save data");

      setShowModal(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= PDF ================= */

  const handlePrintPDF = (patient) => {
    const doc = new jsPDF("p", "mm", "a4");

    const centerX = 105;
    let y = 25;

  // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Hospital X South Africa", centerX, y, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 7;
    doc.text(
      "76 Maude Street, Corner West Street, Sandton, 2196, Johannesburg",
      centerX,
      y,
      { align: "center" }
    );

    y += 6;
    doc.text("Phone +27 21 XXX XXXX", centerX, y, { align: "center" });

    // Line
    y += 6;
    doc.line(30, y, 180, y);

    // ===== TITLE =====
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("E-Ticket Registration", centerX, y, { align: "center" });

    // ===== CONTENT =====
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const labelX = 45;
    const colonX = 95;
    const valueX = 100;

    const row = (label, value) => {
      doc.text(label, labelX, y);
      doc.text(":", colonX, y);
      doc.text(String(value ?? "-"), valueX, y);
      y += 8;
    };

    row("Registration Number", patient.registration_number);
    row("Patient Name", patient.full_name);
    row("Identification Number", patient.nik);
    row("Medical Record Number", patient.medical_record);
    row("Gender", patient.gender);
    row("Mother Name", patient.mother_name);
    row("Date of Birth", patient.birth_date);
    row("Phone Number", patient.phone);
    row(
      "Date of Entry",
      new Date(patient.created_at).toLocaleDateString("en-GB")
    );
    row("Specialist", patient.clinic);

    // ===== FOOTER =====
    y += 10;
    doc.line(30, y, 180, y);

    y += 10;
    doc.setFontSize(10);
    doc.text(
      "Registered at Hospital X, according to the data above",
      centerX,
      y,
      { align: "center" }
    );

  // ===== SAVE =====
  doc.save(`E-Ticket-${patient.registration_number}.pdf`);
};


  const resetAll = () => {
    setForm(initialForm);
    setError({});
    setShowModal(false);
  };

  /* ================= RENDER ================= */

  return (
    <>
      <Navbar />

      <div style={page}>
        <div style={card}>
          <div style={cardHeader}>
            <h1 style={cardTitle}>New Patient Registration</h1>
          </div>

          <form onSubmit={handleSubmit} style={formGrid}>
            <Input label="Full Name *" name="fullName" value={form.fullName} onChange={handleChange} error={error.fullName} />
            <Input label="Medical Records Number" name="medicalRecord" value={form.medicalRecord} disabled />

            <Input label="NIK *" name="nik" maxLength={16} value={form.nik} onChange={handleChange} error={error.nik} />
            <Input label="Mother's Name" name="motherName" value={form.motherName} onChange={handleChange} />

            <Input label="Birth Place *" name="birthPlace" value={form.birthPlace} onChange={handleChange} error={error.birthPlace} />
            <Input label="Date of Birth *" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} error={error.birthDate} />

            <Select label="Gender *" name="gender" value={form.gender} options={["Male", "Female"]} onChange={handleChange} error={error.gender} />
            <Select label="Religion *" name="religion" value={form.religion} options={["Islam", "Christian", "Catholic", "Hinduism", "Buddha", "Khonghucu"]} onChange={handleChange} error={error.religion} />

            <Input label="Telephone Number *" name="phone" value={form.phone} onChange={handleChange} error={error.phone} />
            <Select label="Specialist Clinic *" name="clinic" value={form.clinic} options={["General", "Dental", "Pediatric", "Neurologist", "Orthopedic", "Urologist", "Cardiologist", "Dermatologist", "Obstetrician"]} onChange={handleChange} error={error.clinic} />

            <div style={actionRow}>
              <button type="button" style={btnSecondary} onClick={() => router.push("/dashboard")}>
                Back
              </button>

              <button type="button" style={btnDanger} onClick={resetAll}>
                Reset
              </button>

              <button type="submit" style={btnPrimary} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showModal &&
        createPortal(
          <div style={overlay}>
            <div style={modal}>
              <div style={successIcon}>✓</div>
              <p style={{ marginBottom: 20 }}>Data saved successfully</p>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button style={btnSecondary} onClick={() => router.push("/dashboard")}>Back</button>
                <button style={btnPrimary} onClick={async () => {resetAll(); await fetchNextMedicalRecord(); }}>Next</button>

              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

/* ================= COMPONENTS ================= */





function Input({ label, name, value, onChange, error, disabled, ...props }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        style={{
          ...inputStyle,
          backgroundColor: disabled ? "#f3f4f6" : "#fff",
          cursor: disabled ? "not-allowed" : "text",
        }}
        {...props}
      />
      {error && <p style={errorText}>{error}</p>}
    </div>
  );
}

function Select({ label, name, value, options, onChange, error }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <select name={name} value={value} onChange={onChange} style={inputStyle}>
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {error && <p style={errorText}>{error}</p>}
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

const errorText = {
  fontSize: 12,
  color: "red",
};

const actionRow = {
  gridColumn: "1 / -1",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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

const btnDanger = {
  background: "#dc2626",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 6,
  border: "none",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 10,
  width: 340,
  textAlign: "center",
};

const successIcon = {
  fontSize: 42,
  color: "#22c55e",
  marginBottom: 12,
};
