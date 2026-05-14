// src/lib/export-pdf.ts
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportPayrollPdf = (payrollData: any) => {
  const doc = new jsPDF();

  // Branding & Header
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text("PAYROLL SLIP", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, {
    align: "center",
  });

  // Employee Details
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Employee Name: ${payrollData.employee?.name || "N/A"}`, 20, 50);
  doc.text(`Employee ID: ${payrollData.employee?.employeeId || "N/A"}`, 20, 58);
  doc.text(`Period: ${payrollData.month}/${payrollData.year}`, 20, 66);

  // Financial Table
  (doc as any).autoTable({
    startY: 80,
    head: [["Description", "Amount"]],
    body: [
      ["Basic Salary", `$${payrollData.basicSalary || 0}`],
      ["Allowances", `$${payrollData.allowances || 0}`],
      ["Deductions", `-$${payrollData.deductions || 0}`],
      [
        { content: "Net Salary", styles: { fontStyle: "bold" } },
        {
          content: `$${payrollData.netSalary || 0}`,
          styles: { fontStyle: "bold" },
        },
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: [0, 0, 0] },
  });

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("This is a computer-generated document.", 105, finalY + 20, {
    align: "center",
  });

  // Save the PDF
  doc.save(
    `Payroll_${payrollData.employee?.name || "Employee"}_${payrollData.month}.pdf`,
  );
};
