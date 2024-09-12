# AlgoMeter AI Frontend Repo

AlgoMeter AI is a web application designed to help developers analyze and visualize the time and space complexity of their algorithms. This tool uses AI to provide insights into code performance and offers a visual representation of algorithm efficiency.

This repository contains the frontend code for AlgoMeter AI. For the backend code, please visit [AlgoMeter AI Backend Repo](https://github.com/raumildhandhukia/AlgoMeterAIBack).

## Features

- Code analysis for time and space complexity
- Visual representation of algorithm performance
- Support for various programming languages
- Interactive code editor
- Responsive design for mobile and desktop

## Technologies Used

### Frontend (This Repo)

- Next.js
- React with TypeScript
- Tailwind CSS for styling
- MUI Charts for data visualization
- CodeMirror for the code editor

### Backend (Separate Repo)

- Python
- FastAPI
- Gemini API for AI-powered analysis
- Redis for rate limiting

## Getting Started

To run this project locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_SERVER_URL=your_backend_url
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Visit the homepage
2. Enter your code in the provided editor
3. Click the "Analyze" button
4. View the analysis results and performance chart

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this project helpful, consider supporting it:

[Buy Me A Coffee](https://buymeacoffee.com/raumildhandhukia)

## License

This project is open source and available under the [MIT License](LICENSE).
