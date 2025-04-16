const login = require("@xaviabot/fca-unofficial");

login(
  { email: "vikoeifpi24e@gmail.com", password: "@vikoeifpi24e#" },
  (err, api) => {
    if (err) return console.error("Login failed", err);

    console.log("Logged in successfully");
    api.sendMessage("Hello, world!", "your_thread_id"); // Example of sending a message

    // Continue with more logic for your bot...
  }
);
