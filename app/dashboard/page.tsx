"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    fetchPatients();
  }, []);


  async function fetchPatients() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("medical_record", { ascending: true });

    if (!error) setPatients(data || []);
  }

  const filteredPatients = patients.filter((patient) => {
    const keyword = search.toLowerCase();

    return (
      patient.full_name?.toLowerCase().includes(keyword) ||
      patient.medical_record?.toLowerCase().includes(keyword) ||
      patient.clinic?.toLowerCase().includes(keyword)
    );
  });


  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this patient?");
    if (!confirmDelete) return;

    await supabase.from("patients").delete().eq("id", id);
    fetchPatients();
  }

  function handlePrint(patient) {
  const pdf = new jsPDF("p", "mm", "a4");

  const centerX = 105;
  let y = 25;

  // ===== HEADER =====
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("Hospital X South Africa", centerX, y, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  y += 7;
  pdf.text(
    "76 Maude Street, Corner West Street, Sandton, 2196, Johannesburg",
    centerX,
    y,
    { align: "center" }
  );

  y += 6;
  pdf.text("Phone +27 21 XXX XXXX", centerX, y, { align: "center" });

  // Line
  y += 6;
  pdf.line(30, y, 180, y);

  // ===== TITLE =====
  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text("E-Ticket Registration", centerX, y, { align: "center" });

  // ===== CONTENT =====
  y += 14;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);

  const labelX = 45;
  const colonX = 95;
  const valueX = 100;

  const row = (label, value) => {
    pdf.text(label, labelX, y);
    pdf.text(":", colonX, y);
    pdf.text(String(value ?? "-"), valueX, y);
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
  row("Date of Entry", new Date(patient.created_at).toLocaleDateString());
  row("Specialist", patient.clinic);

  // ===== FOOTER =====
  y += 10;
  pdf.line(30, y, 180, y);

  y += 10;
  pdf.setFontSize(10);
  pdf.text(
    "Registered at Hospital X, according to the data above",
    centerX,
    y,
    { align: "center" }
  );

  // ===== SAVE =====
  pdf.save(`E-Ticket-${patient.registration_number}.pdf`);
}


  return (
    <div className="dashboard">
      {/* BACKGROUND */}
      <div className="bg-layer" />

      {/* HEADER */}
      <header className="header">
        <div className="left">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>

        <div className="right">
          <span className="user">Nandytha Z Putri</span>
          <button
            className="logout"
              onClick={() => {
              localStorage.removeItem("isLoggedIn");
              router.push("/login");
            }}
          >
            Logout
          </button>

        </div>
      </header>

      {/* NAV MENU */}
      <nav className="menu">
        <button className="active">Registration</button>
        <button>Medical Record</button>
        <button>Pharmacy</button>
        <button>Cashier/Payment</button>
      </nav>

      {/* CONTENT */}
      <main className="content">
        <div className="card">
          {/* TOP ACTION */}
          <div className="top-action">
            <button
              className="new-patient"
              onClick={() => router.push("/patient/new")}
            >
              New Patient +
            </button>
          </div>

          {/* SEARCH */}
          <input
            className="search"
            placeholder="Search Patient"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />


          {/* TABLE */}
          <table>
            <thead>
              <tr>
                <th>No Registration</th>
                <th>No MR</th>
                <th>Patient Name</th>
                <th>Gender</th>
                <th>Birth Date</th>
                <th>Specialist Clinic</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    No data available
                  </td>
                </tr>
              )}

              {filteredPatients.map((p, i) => (
                <tr key={p.id}>
                  <td>{p.registration_number}</td>
                  <td>{p.medical_record}</td>
                  <td>{p.full_name}</td>
                  <td>{p.gender || "-"}</td>
                  <td>{p.birth_date || "-"}</td>

                  <td>{p.clinic || "-"}</td>

                  <td style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <button
                      onClick={() => router.push(`/patient/edit/${p.id}`)}
                      style={{
                        background: "#405940",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        background: "#D40A0A",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>

                    <button
                      onClick={() => handlePrint(p)}
                      style={{
                        background: "#656565",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </main>

      {/* STYLE (TIDAK DIUBAH) */}
      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          position: relative;
          font-family: Arial, sans-serif;
        }

        .bg-layer {
          position: fixed;
          inset: 0;
          background: url("/bg-hospital.png") center / cover no-repeat;
          z-index: 0;
          pointer-events: none;
        }

        .header {
          height: 70px;
          background: #405940;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          color: white;
          position: relative;
          z-index: 10;
        }

        .logo {
          height: 42px;
        }

        .right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logout {
          background: #405940;
          border: 1px solid white;
          color: white;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
        }

        .menu {
          background: white;
          display: flex;
          gap: 24px;
          padding: 12px 24px;
          position: relative;
          z-index: 10;
        }

        .menu button {
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
          padding-bottom: 6px;
        }

        .menu .active {
          border-bottom: 3px solid #405940;
          color: #405940;
        }

        .content {
          padding: 24px;
          position: relative;
          z-index: 10;
        }

        .card {
          background: white;
          border-radius: 14px;
          padding: 20px;
        }

        .top-action {
          margin-bottom: 12px;
        }

        .new-patient {
          background: #405940;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        .search {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-bottom: 16px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #405940;
          color: white;
        }

        th,
        td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .empty {
          padding: 40px;
          color: #656565;
        }
      `}</style>
    </div>
  );
}
