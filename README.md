# VIKO EIF Lecture Timetable

This project provides a lecture timetable for a specific group at Vilniaus kolegija (VIKO) Faculty of Electronics and Informatics (EIF). It consists of a Node.js proxy server and a React.js frontend application.

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

