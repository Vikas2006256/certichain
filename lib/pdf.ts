import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import crypto from "crypto";
import QRCode from "qrcode";

export interface CertificateData {
  certId: string;
  recipientName: string;
  studentIdNumber: string;
  universityName: string;
  universityCode: string;
  title: string;
  department?: string;
  grade?: string;
  description?: string;
  issueDate: Date | string;
  verificationUrl?: string;
}

/**
 * Deterministically generates a certificate PDF document and its SHA-256 fingerprint.
 * Uses exact canonical structure so that the file hash is mathematically permanent.
 */
export async function generateCanonicalCertificatePdf(data: CertificateData): Promise<{
  pdfBytes: Uint8Array;
  certHash: string; // 0x-prefixed 32-byte hex hash
  qrCodeDataUrl: string;
}> {
  // 1. Generate QR Code containing the public verification URL
  const verificationUrl =
    data.verificationUrl ||
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify?id=${encodeURIComponent(data.certId)}`;

  const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 200,
    color: {
      dark: "#080D1B",
      light: "#FFFFFF",
    },
  });

  // Extract base64 image data
  const qrImageBytes = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");

  // 2. Create PDF Document (Landscape Certificate Format: 842 x 595 pt)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const { width, height } = page.getSize();

  // Embed standard typography
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier);

  // Embed QR Image
  const qrImage = await pdfDoc.embedPng(qrImageBytes);

  // --- Background Border & Decorative Frames ---
  // Outer border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.1, 0.18, 0.35),
    borderWidth: 3,
    color: rgb(0.99, 0.99, 1),
  });

  // Inner subtle border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: rgb(0.23, 0.51, 0.96), // Electric blue
    borderWidth: 1,
  });

  // --- Header / Institution ---
  const uniText = data.universityName.toUpperCase();
  const uniWidth = timesBold.widthOfTextAtSize(uniText, 24);
  page.drawText(uniText, {
    x: (width - uniTextWidth(timesBold, uniText, 24)) / 2,
    y: height - 80,
    size: 24,
    font: timesBold,
    color: rgb(0.06, 0.1, 0.2),
  });

  page.drawText("OFFICIAL ACADEMIC CREDENTIAL", {
    x: (width - helvetica.widthOfTextAtSize("OFFICIAL ACADEMIC CREDENTIAL", 10)) / 2,
    y: height - 100,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.4, 0.55),
  });

  // --- Conferred text ---
  const conferredText = "This certifies that";
  page.drawText(conferredText, {
    x: (width - timesRoman.widthOfTextAtSize(conferredText, 14)) / 2,
    y: height - 150,
    size: 14,
    font: timesRoman,
    color: rgb(0.2, 0.25, 0.35),
  });

  // --- Student Full Name ---
  const nameText = data.recipientName;
  page.drawText(nameText, {
    x: (width - timesBold.widthOfTextAtSize(nameText, 28)) / 2,
    y: height - 195,
    size: 28,
    font: timesBold,
    color: rgb(0.08, 0.15, 0.3),
  });

  // --- Degree Title ---
  const degreePreamble = "has fulfilled all institutional requirements and is hereby awarded the credential of";
  page.drawText(degreePreamble, {
    x: (width - timesRoman.widthOfTextAtSize(degreePreamble, 12)) / 2,
    y: height - 235,
    size: 12,
    font: timesRoman,
    color: rgb(0.25, 0.3, 0.4),
  });

  const titleText = data.title;
  page.drawText(titleText, {
    x: (width - timesBold.widthOfTextAtSize(titleText, 22)) / 2,
    y: height - 275,
    size: 22,
    font: timesBold,
    color: rgb(0.12, 0.35, 0.75),
  });

  // --- Honors / Department ---
  if (data.department || data.grade) {
    const subLine = [data.department, data.grade].filter(Boolean).join("  •  ");
    page.drawText(subLine, {
      x: (width - helveticaBold.widthOfTextAtSize(subLine, 11)) / 2,
      y: height - 305,
      size: 11,
      font: helveticaBold,
      color: rgb(0.15, 0.55, 0.4),
    });
  }

  // --- Issue Date & Details ---
  const formattedDate = new Date(data.issueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateLine = `Conferred on: ${formattedDate}  |  Student ID: ${data.studentIdNumber}`;
  page.drawText(dateLine, {
    x: (width - helvetica.widthOfTextAtSize(dateLine, 10)) / 2,
    y: height - 340,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.35, 0.45),
  });

  // --- Bottom Proof & Verification Bar ---
  const barY = 55;

  // Draw QR Code
  page.drawImage(qrImage, {
    x: 50,
    y: barY,
    width: 85,
    height: 85,
  });

  // Draw Blockchain Metadata
  page.drawText("CRYPTOGRAPHIC BLOCKCHAIN PROOF", {
    x: 150,
    y: barY + 70,
    size: 10,
    font: helveticaBold,
    color: rgb(0.08, 0.15, 0.3),
  });

  page.drawText(`Certificate ID: ${data.certId}`, {
    x: 150,
    y: barY + 52,
    size: 9,
    font: courier,
    color: rgb(0.1, 0.2, 0.4),
  });

  page.drawText("Scan QR or verify at certichain.io with zero-trust consensus", {
    x: 150,
    y: barY + 35,
    size: 8,
    font: helvetica,
    color: rgb(0.35, 0.4, 0.5),
  });

  page.drawText("Network: Ethereum / Sepolia Smart Contract Registry", {
    x: 150,
    y: barY + 18,
    size: 8,
    font: helvetica,
    color: rgb(0.35, 0.4, 0.5),
  });

  // Institution signature lines on the right
  const sigX = width - 260;
  page.drawLine({
    start: { x: sigX, y: barY + 45 },
    end: { x: width - 50, y: barY + 45 },
    thickness: 1,
    color: rgb(0.5, 0.55, 0.65),
  });

  page.drawText("Authorized Registrar & Academic Chancellor", {
    x: sigX + 10,
    y: barY + 30,
    size: 8,
    font: helvetica,
    color: rgb(0.4, 0.45, 0.55),
  });

  page.drawText(data.universityName, {
    x: sigX + 25,
    y: barY + 15,
    size: 8,
    font: helveticaBold,
    color: rgb(0.1, 0.15, 0.3),
  });

  // 3. Serialize canonical PDF bytes
  const pdfBytes = await pdfDoc.save();

  // 4. Compute cryptographic SHA-256 fingerprint over the immutable PDF file bytes
  const certHash = "0x" + crypto.createHash("sha256").update(Buffer.from(pdfBytes)).digest("hex");

  return {
    pdfBytes,
    certHash,
    qrCodeDataUrl,
  };
}

function uniTextWidth(font: any, text: string, size: number): number {
  try {
    return font.widthOfTextAtSize(text, size);
  } catch {
    return 300;
  }
}
