# Salary & Budget Pro

![Salary & Budget Pro](https://raw.githubusercontent.com/okassama/salary-calculator-ok/main/public/screenshot.png)

An all-in-one financial planning tool designed to give you a clear and comprehensive breakdown of your salary and monthly budget. Built with React, TypeScript, and Tailwind CSS, this application provides a detailed analysis of your take-home pay and helps you manage your outgoings effectively.

**Live Demo:** [https://firebase-salary-calculator-ok.web.app](https://firebase-salary-calculator-ok.web.app)

## Features

- **Beautiful New UI:** A modern and intuitive interface with both **light and dark modes**.
- **Comprehensive Salary Breakdown:** Get a detailed view of your yearly, monthly, and weekly take-home pay.
- **Accurate Tax Calculations:** Supports both **UK (England, Wales, NI)** and **Scottish** tax bands for the 2024/2025 tax year.
- **National Insurance & Pension:** Includes accurate NI deductions and allows you to add your pension contributions.
- **Student Loan Support:** Calculates deductions for Plan 1, Plan 2, Plan 4, and Postgraduate loans.
- **Monthly Budget Planner:** A side-by-side layout to manage your outgoings, including categories like:
  - Rent/Mortgage
  - Council Tax
  - Savings/Investments
  - Holidays & Childcare
  - And many more!
- **Data Persistence:** Your financial details are saved locally, so you don't have to re-enter them every time.
- **Interactive Charts:** Visualize your budget with an interactive pie chart.
- **Responsive Design:** A seamless experience across all devices.

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Deployment:** Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/okassama/salary-calculator-ok.git
    ```

2.  **Install dependencies:**
    ```bash
    cd salary-calculator-ok
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to the local development URL (usually `http://localhost:5173`).

## Deployment

This application is deployed to Firebase Hosting. To deploy your own version, you can follow these steps:

1.  **Build the project:**
    ```bash
    npm run build
    ```

2.  **Deploy to Firebase:**
    ```bash
    firebase deploy --only hosting
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
