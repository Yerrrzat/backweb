const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.post('/calculate-bmi', (req, res) => {
  const weight = Number(req.body.weight);
  const height = Number(req.body.height);

  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
  return res.send(`
    <div style="
      font-family: Arial;
      background: #f4f4f4;
      padding: 40px;
    ">
      <div style="
        background: white;
        padding: 20px;
        width: 300px;
        border-radius: 8px;
        border-left: 5px solid red;
      ">
        <h2>Error</h2>
        <p style="color:red; font-weight:bold;">
          Weight and height must be positive numbers.
        </p>
        <a href="/">Go back</a>
      </div>
    </div>
  `);
}


  const bmi = weight / (height * height);

  let category;
  let className;

  if (bmi < 18.5) {
    category = "Underweight";
    className = "underweight";
  } else if (bmi < 24.9) {
    category = "Normal weight";
    className = "normal";
  } else if (bmi < 29.9) {
    category = "Overweight";
    className = "overweight";
  } else {
    category = "Obese";
    className = "obese";
  }

  let resultPage = fs.readFileSync(
    path.resolve(__dirname, 'result.html'),
    'utf-8'
  );

  resultPage = resultPage
    .replace('{{bmi}}', bmi.toFixed(2))
    .replace('{{category}}', category)
    .replace('{{className}}', className);

  res.send(resultPage);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
