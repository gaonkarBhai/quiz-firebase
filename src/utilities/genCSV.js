import Papa from "papaparse";

// Function to generate a CSV file from the data
const generateCSV = (data,event_name) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
  const fileName = `${event_name}-${currentDate}.csv`;

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  // Create a download link for the CSV file with the updated file name
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default generateCSV;
