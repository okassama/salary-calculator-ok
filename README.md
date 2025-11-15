# Salary & Budget Pro

![Salary & Budget Pro](https://raw.githubusercontent.com/okassama/salary-calculator-ok/main/public/screenshots/Screenshot%202025-11-15%20at%2003.17.40.png)

An all-in-one financial planning tool designed to give you a clear and comprehensive breakdown of your salary and monthly budget. Built with React, TypeScript, and Tailwind CSS, this application provides a detailed analysis of your take-home pay and helps you manage your outgoings effectively.

## Features

- **Beautiful New UI:** A modern and intuitive interface with both **light and dark modes**.
- **Comprehensive Salary Breakdown:** Get a detailed view of your yearly, monthly, and weekly take-home pay.
- **Accurate Tax Calculations:** Supports both **UK (England, Wales, NI)** and **Scottish** tax bands for the 2024/2025 tax year.
- **National Insurance & Pension:** Includes accurate NI deductions and allows you to add your pension contributions.
- **Student Loan Support:** Calculates deductions for:
  - **Plan 1:** For students who started their course before 1 September 2012.
  - **Plan 2:** For students who started their course between 1 September 2012 and 31 July 2023.
  - **Plan 4:** For Scottish students.
  - **Postgraduate Loan:** For postgraduate courses.
- **Monthly Budget Planner:** A side-by-side layout to manage your outgoings, including categories like:
  - Rent/Mortgage
  - Council Tax
  - Savings/Investments
  - Holidays & Childcare
  - And many more!
- **Data Persistence:** Your financial details are saved locally, so you don't have to re-enter them every time.
- **Interactive Charts:** Visualize your budget with an interactive pie chart.
- **Responsive Design:** A seamless experience across all devices.

## Screenshots

### Salary Breakdown

![Salary Breakdown](https://raw.githubusercontent.com/okassama/salary-calculator-ok/main/public/screenshots/Screenshot%202025-11-15%20at%2003.17.40.png)

### Monthly Budget Planner

![Monthly Budget Planner](https://raw.githubusercontent.com/okassama/salary-calculator-ok/main/public/screenshots/Screenshot%202025-11-15%20at%2003.17.59.png)

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Deployment:** Firebase Hosting, Docker

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (for Docker deployment)

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

### Firebase

This application is deployed to Firebase Hosting. To deploy your own version, you can follow these steps:

1.  **Build the project:**
    ```bash
    npm run build
    ```

2.  **Deploy to Firebase:**
    ```bash
    firebase deploy --only hosting
    ```

### Docker

The application can be easily deployed using Docker on port 7770.

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

#### Portainer (Stack)

You can also deploy this application using Portainer as a stack.

1.  **Log in to your Portainer instance.**
2.  **Go to "Stacks" and click "Add stack".**
3.  **Give the stack a name (e.g., `salary-calculator`).**
4.  **Select "Git Repository" as the build method.**
5.  **Enter the repository URL:** `https://github.com/okassama/salary-calculator-ok.git`
6.  **Set the Compose path to:** `docker-compose.yml`
7.  **Click "Deploy the stack".**

#### Access the Application
Once running, open your browser and navigate to:
```
http://localhost:7770
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
