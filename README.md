# VIKO EIF Lecture Timetable

**Description**:  
VIKO-eif Lecture Timetable is a Progressive Web Application (PWA) designed for students at the Faculty of Electronics and Informatics (VIKO). The app consolidates lecture schedules for different groups, fetching data from multiple API endpoints through a custom Node.js proxy server. It displays real-time updates on class cancellations and schedule changes via Firebase, making it easier for students to stay informed without navigating multiple websites.

**Key Features**:
- **Real-time updates** for schedule changes and cancellations, delivered instantly through Firebase.
- **Single platform access** for all students, eliminating the need to visit separate sites for different groups or changes.
- **Social media sharing**: Allows students to share schedules for specific days on platforms like WhatsApp or Facebook, complete with live previews.
- **PWA support**, enabling easy installation on mobile devices for an app-like experience.

This app currently serves **50-100 active users daily**, helping students stay on top of their schedules with minimal hassle.

## Project Structure

- **Node.js Proxy Server**: Located in the main directory, this server acts as a middleware to handle API requests and responses between the frontend and external services.
- **React.js Frontend Application**: Found within the `viko_timetable` directory, this application offers a user interface for viewing and interacting with the lecture timetable.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/icerahi/VIKO-eif-lecture-timetable.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd VIKO-eif-lecture-timetable
   ```

3. **Install Dependencies for the Proxy Server**:

   ```bash
   npm install
   ```

4. **Navigate to the Frontend Directory and Install Dependencies**:

   ```bash
   cd viko_timetable
   npm install
   ```

## Usage

### Running the Proxy Server

From the main project directory:

```bash
npm start
```

By default, the proxy server runs on port 3000. You can modify this in the server configuration.

### Running the Frontend Application

1. **Navigate to the Frontend Directory**:

   ```bash
   cd viko_timetable
   ```

2. **Start the Development Server**:

   ```bash
   npm start
   ```

The frontend application will run on port 3001 by default. Access it via `http://localhost:3001`.

## Contributing

Contributions are welcome! Feel free to fork the repository, open issues, or submit pull requests to improve the project.

## License

No official license has been added to this project.

