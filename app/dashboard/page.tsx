"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPatients(data || []);
  }

  async function handleDelete(id) {
    const confirmDelete = confirm("Delete this patient?");
    if (!confirmDelete) return;

    await supabase.from("patients").delete().eq("id", id);
    fetchPatients();
  }

  function handlePrint(patient) {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text("HOSPITAL MANAGEMENT SYSTEM", 20, 20);

    pdf.setFontSize(12);
    pdf.text("Patient Registration Data", 20, 30);

    pdf.text(`Name: ${patient.full_name}`, 20, 50);
    pdf.text(`Medical Record No: ${patient.medical_record}`, 20, 60);
    pdf.text(`NIK: ${patient.nik}`, 20, 70);
    pdf.text(`Mother's Name: ${patient.mother_name}`, 20, 80);
    pdf.text(`Birth Place: ${patient.birth_place}`, 20, 90);
    pdf.text(`Date of Birth: ${patient.birth_date}`, 20, 100);
    pdf.text(`Gender: ${patient.gender}`, 20, 110);
    pdf.text(`Religion: ${patient.religion}`, 20, 120);
    pdf.text(`Telephone: ${patient.phone}`, 20, 130);
    pdf.text(`Clinic: ${patient.clinic}`, 20, 140);

    pdf.save(`patient-${patient.id}.pdf`);
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
            onClick={() => router.push("/login")}
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
          <input className="search" placeholder="Search Patient" />

          {/* TABLE */}
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>No MR</th>
                <th>Patient Name</th>
                <th>Gender</th>
                <th>Birth Date</th>

                <th>Specialist Clinic</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {patients.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty">
                    No data available
                  </td>
                </tr>
              )}

              {patients.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
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
