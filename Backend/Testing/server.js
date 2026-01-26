const express = require("express");
const path = require("path");

const app = express();

// ✅ Serve current folder as static
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
