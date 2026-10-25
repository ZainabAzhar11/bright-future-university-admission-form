
const SHEET_NAME = "Admissions";

function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("index")
    .setTitle("Bright Future University Admissions");
}

function submitAdmission(data) {

  // Get the connected Google Spreadsheet
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error(
      "Google Sheet connection not found. Please connect your spreadsheet."
    );
  }

  // Find or create Admissions sheet
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  // Add headings only if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submission Date",
      "Full Name",
      "Email",
      "Phone",
      "Date of Birth",
      "Gender",
      "City",
      "Qualification",
      "Marks Percentage",
      "Department",
      "Address"
    ]);
  }

  // Validate required fields
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "dob",
    "gender",
    "city",
    "qualification",
    "marks",
    "department",
    "address"
  ];

  requiredFields.forEach(function(field) {
    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {
      throw new Error("Please fill all required fields.");
    }
  });

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(String(data.email).trim())) {
    throw new Error("Please enter a valid email address.");
  }

  // Validate marks percentage
  const marks = Number(data.marks);

  if (
    !Number.isFinite(marks) ||
    marks < 0 ||
    marks > 100
  ) {
    throw new Error("Marks must be between 0 and 100.");
  }

  // Prevent spreadsheet formula injection
  function safe(value) {
    const text = String(value).trim();

    if (/^[=+\-@]/.test(text)) {
      return "'" + text;
    }

    return text;
  }

  // Save student application
  sheet.appendRow([
    new Date(),
    safe(data.fullName),
    safe(data.email),
    safe(data.phone),
    safe(data.dob),
    safe(data.gender),
    safe(data.city),
    safe(data.qualification),
    marks,
    safe(data.department),
    safe(data.address)
  ]);

  return "Application Submitted Successfully!";
}
