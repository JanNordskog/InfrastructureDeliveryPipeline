import express from "express";

const app = express();
app.use(express.json());

// Basic security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API 2.1! 🌟 Here's what you can do:",
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "View this welcome message and a list of available endpoints",
      },
      {
        method: "GET",
        path: "/user/:id",
        description: "Fetch details of a user by their ID",
        example: "/user/123",
      },
      {
        method: "POST",
        path: "/user",
        description: "Create a new user (requires 'name' and 'email' in the request body)",
        example: {
          requestBody: {
            name: "John Doe",
            email: "johndoe@example.com",
          },
        },
      },
      {
        method: "GET",
        path: "/echo",
        description: "Echo back a message provided as a query parameter",
        example: "/echo?message=Hello",
      },
    ],
  });  
  });

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.json({
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
  });
});

app.post("/user", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  res.status(201).json({ id: Date.now(), name, email });
});

app.get("/echo", (req, res) => {
  const message = req.query.message || "No message provided";
  res.json({ echo: message });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () =>
  console.log(`app listening on http://localhost:${port}`)
);

export { app, server };