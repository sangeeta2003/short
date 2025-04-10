# URL Shortener Frontend

A React-based frontend for the URL shortener and analytics dashboard application.

## Features

- User authentication
- URL shortening with custom aliases
- Analytics dashboard with charts
- QR code generation
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be created in the `build` directory.

## Testing

To run the test suite:

```bash
npm test
```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── store/         # Redux store configuration
  ├── App.jsx        # Main application component
  └── index.js       # Application entry point
```

## Dependencies

- React
- Redux Toolkit
- React Router
- Chart.js
- Tailwind CSS
- Axios
- QRCode.react

## License

MIT 