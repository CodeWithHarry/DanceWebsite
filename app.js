const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/contactDance";
const port = process.env.PORT || 8000;
let dbReady = false;
const fallbackContacts = [];

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
})
  .then(() => {
    console.log("Connected to MongoDB");
    dbReady = true;
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message || err);
    dbReady = false;
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  dbReady = false;
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
  dbReady = false;
});

const contactSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    address: String,
    desc: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.status(200).render("home", { title: "Abhishek Dance Academy" });
});

app.get("/about", (req, res) => {
  res.status(200).render("about", { title: "About Us" });
});

app.get("/services", (req, res) => {
  res.status(200).render("services", { title: "Services" });
});

app.get("/classes", (req, res) => {
  res.status(200).render("classes", { title: "Class Info" });
});

app.get("/contact", (req, res) => {
  res.status(200).render("contact", {
    title: "Contact Us",
    formData: {},
    errors: {},
    message: null,
    status: null,
  });
});

app.post("/contact", async (req, res) => {
  const { name, phone, email, address, desc } = req.body;
  const formData = { name, phone, email, address, desc };
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }

  if (!phone || phone.trim().length < 7) {
    errors.phone = "Please enter your phone number.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!address || address.trim().length < 5) {
    errors.address = "Please enter your address.";
  }

  if (!desc || desc.trim().length < 10) {
    errors.desc = "Please describe your concern in more detail.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).render("contact", {
      title: "Contact Us",
      formData,
      errors,
      message: "Please fix the form errors before submitting.",
      status: "error",
    });
  }

  try {
    if (dbReady) {
      const myData = new Contact(formData);
      await myData.save();
    } else {
      fallbackContacts.push({ ...formData, createdAt: new Date() });
      console.warn("Saved contact to fallback memory because MongoDB is unavailable.");
    }

    return res.redirect("/thank-you");
  } catch (error) {
    console.error("Contact save error:", error);
    res.status(500).render("contact", {
      title: "Contact Us",
      formData,
      errors: {},
      message: "Something went wrong while saving your message. Please try again later.",
      status: "error",
    });
  }
});

app.get("/thank-you", (req, res) => {
  res.status(200).render("thankyou", {
    title: "Thank You",
  });
});

app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});