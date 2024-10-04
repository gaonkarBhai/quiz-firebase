import jsPDF from "jspdf";

const genQuizTemp = (quiz, questions) => {
  const doc = new jsPDF();
  doc.setFontSize(18);

  // Calculate the center position for the title
  const titleWidth =
    (doc.getStringUnitWidth(quiz.title) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  const pageWidth = doc.internal.pageSize.width;
  const xPosition = (pageWidth - titleWidth) / 2;

  doc.text(xPosition, 20, `Quiz Title: ${quiz.title}`);
  doc.setFontSize(12);

  const description = `Description: ${quiz.description}`;
  const descriptionLines = doc.splitTextToSize(description, pageWidth - 20);
  let yPos = 30;

  // Display description
  for (const line of descriptionLines) {
    doc.text(10, yPos, line);
    yPos += 10;
  }

  const infoStartY = yPos + 10;

  questions = questions.filter((question) => question.ID === quiz.ID);
  yPos = infoStartY;
  let currentPage = 1;

  // Display quiz information
  for (const key in quiz) {
    if (
      quiz.hasOwnProperty(key) &&
      key !== "ID" &&
      key !== "title" &&
      key !== "description"
    ) {
      doc.text(10, yPos, `${key}: ${quiz[key]}`);
      yPos += 10;
    }
  }

  questions.forEach((question, index) => {
    if (yPos >= 280) {
      // Add a new page
      doc.addPage();
      yPos = 20;
      currentPage++;
    }

    // Include question
    const questionText = `Question ${index + 1}: ${question.question}`;
    const questionLines = doc.splitTextToSize(questionText, pageWidth - 20);

    // Display question
    for (const line of questionLines) {
      doc.text(10, yPos, line);
      yPos += 10;
    }

    // Include options if available
    if (question.optionA) {
      const optionAText = `Option A: ${question.optionA}`;
      const optionALines = doc.splitTextToSize(optionAText, pageWidth - 20);

      // Display option A
      for (const line of optionALines) {
        doc.text(20, yPos, line);
        yPos += 10;
      }
    }

    if (question.optionB) {
      const optionBText = `Option B: ${question.optionB}`;
      const optionBLines = doc.splitTextToSize(optionBText, pageWidth - 20);

      // Display option B
      for (const line of optionBLines) {
        doc.text(20, yPos, line);
        yPos += 10;
      }
    }

    if (question.optionC) {
      const optionCText = `Option C: ${question.optionC}`;
      const optionCLines = doc.splitTextToSize(optionCText, pageWidth - 20);

      // Display option C
      for (const line of optionCLines) {
        doc.text(20, yPos, line);
        yPos += 10;
      }
    }

    if (question.optionD) {
      const optionDText = `Option D: ${question.optionD}`;
      const optionDLines = doc.splitTextToSize(optionDText, pageWidth - 20);

      // Display option D
      for (const line of optionDLines) {
        doc.text(20, yPos, line);
        yPos += 10;
      }
    }

    // Include correct answer
    const correctAnswer = `Correct Answer: ${question.correctAnswer}`;
    doc.text(10, yPos, correctAnswer);
    yPos += 10;

    // Include image link if available
    if (question.imgUrl) {
      doc.text(10, yPos, `Image Link: ${question.imgUrl}`);
      yPos += 10;
    }

    // Add space between questions
    yPos += 10;
  });

  doc.save(`Quiz_Template_${quiz.title}_Page_${currentPage}.pdf`);
};

export default genQuizTemp;
