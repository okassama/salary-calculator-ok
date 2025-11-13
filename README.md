# OK Salary Calculator

A comprehensive UK salary calculator built with React and TypeScript that provides detailed breakdowns of take-home pay across multiple timeframes.

## Features

- **Multi-Frequency Input**: Calculate from yearly, monthly, or weekly salary inputs
- **Comprehensive Breakdown**: View detailed results across yearly, monthly, and weekly timeframes
- **UK Tax Calculations**: Accurate income tax calculations based on 2024/2025 UK tax bands
- **National Insurance**: Proper NI deductions with current thresholds and rates
- **Student Loan Support**: Calculations for Plan 1, Plan 2, Plan 4, and Postgraduate loans
- **Hourly Rate Conversion**: Equivalent hourly rate based on 37.5-hour work week
- **Tax Efficiency Analysis**: Breakdown of tax rates, NI rates, and take-home percentages

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: npm

## Getting Started

### Development (Local)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL.

### Docker Deployment

The application can be easily deployed using Docker on port 7770.

#### Prerequisites
- Docker installed on your system
- Docker Compose (optional, for easier deployment)

#### Using Docker Compose (Recommended)
```bash
# Build and start the container
npm run docker:compose

# Or directly with docker-compose
docker-compose up --build
```

#### Using Docker Commands
```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run

# Or directly with Docker
docker build -t salary-calculator .
docker run -p 7770:7770 salary-calculator
```

#### Access the Application
Once running, open your browser and navigate to:
```
http://localhost:7770
```

## Usage

1. Enter your salary amount
2. Select the frequency (yearly, monthly, or weekly)
3. Choose your student loan plan (if applicable)
4. Click "Calculate Take-Home Pay" to see the comprehensive breakdown

## Calculation Details

The calculator uses current UK tax year 2024/2025 rates:
- **Personal Allowance**: £12,570
- **Basic Rate**: 20% on income between £12,571 and £50,270
- **Higher Rate**: 40% on income between £50,271 and £125,140
- **Additional Rate**: 45% on income above £125,140
- **National Insurance**: 8% between £12,571 and £50,270, 2% above £50,270

## License

MIT License
