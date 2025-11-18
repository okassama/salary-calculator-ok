import React, { useState, useMemo, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import useLocalStorage from './hooks/useLocalStorage';
import SalaryInputForm from './components/SalaryInputForm';
import SalaryResults from './components/SalaryResults';
import OutgoingsPlanner from './components/OutgoingsPlanner';
import Header from './components/Header';

interface SalaryBreakdown {
  yearly: { gross: number; tax: number; ni: number; studentLoan: number; pension: number; net: number; };
  monthly: { gross: number; tax: number; ni: number; studentLoan: number; pension: number; net: number; };
  weekly: { gross: number; tax: number; ni: number; studentLoan: number; pension: number; net: number; };
}

type OutgoingsCategory = 
  'Rent/Mortgage' | 'Council Tax' | 'Car' | 'Insurances' | 'Credit Cards' | 'Electricity' | 'Gas' | 'Food' |
  'Entertainment' | 'Clothing' | 'Online Subscriptions' | 'Savings/Investments' | 'Holidays' | 'Childcare' |
  'Public Transport' | 'Other';

const OKSalaryCalculator = () => {
  const [salary, setSalary] = useLocalStorage<string>('salary', '50000');
  const [pensionContribution, setPensionContribution] = useLocalStorage<string>('pensionContribution', '5');
  const [studentLoanPlan, setStudentLoanPlan] = useLocalStorage<'none' | 'plan1' | 'plan2' | 'plan4' | 'postgrad'>('studentLoanPlan', 'none');
  const [taxRegion, setTaxRegion] = useLocalStorage<'uk' | 'scotland'>('taxRegion', 'uk');
  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);
  const [step, setStep] = useState<'salary' | 'outgoings'>('salary');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const initialOutgoings: Record<OutgoingsCategory, number | '' > = {
    'Rent/Mortgage': '', 'Council Tax': '', 'Car': '', 'Insurances': '', 'Credit Cards': '', 'Electricity': '', 'Gas': '', 'Food': '', 
    'Entertainment': '', 'Clothing': '', 'Online Subscriptions': '', 'Savings/Investments': '', 'Holidays': '', 
    'Childcare': '', 'Public Transport': '', 'Other': ''
  };

  const [outgoings, setOutgoings] = useLocalStorage<Record<OutgoingsCategory, number | ''>>('outgoings', initialOutgoings);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const TAX_BANDS_UK = {
    personalAllowance: 12570,
    basicRate: { threshold: 50270, rate: 0.2 },
    higherRate: { threshold: 125140, rate: 0.4 },
    additionalRate: { rate: 0.45 }
  };

  const TAX_BANDS_SCOTLAND = {
    personalAllowance: 12570,
    starterRate: { threshold: 14876, rate: 0.19 },
    basicRate: { threshold: 26561, rate: 0.20 },
    intermediateRate: { threshold: 43662, rate: 0.21 },
    higherRate: { threshold: 75000, rate: 0.42 },
    advancedRate: { threshold: 125140, rate: 0.45 },
    topRate: { rate: 0.48 },
  };

  const NI_RATES = {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    rateBelowUEL: 0.08,
    rateAboveUEL: 0.02
  };

  const STUDENT_LOAN_THRESHOLDS = {
    plan1: 24990, plan2: 27295, plan4: 31395, postgrad: 21000
  };

  const STUDENT_LOAN_RATES = {
    plan1: 0.09, plan2: 0.09, plan4: 0.09, postgrad: 0.06
  };

  const calculateTax = (grossAfterPension: number, region: 'uk' | 'scotland'): number => {
    let tax = 0;
    let personalAllowance = region === 'scotland' ? TAX_BANDS_SCOTLAND.personalAllowance : TAX_BANDS_UK.personalAllowance;
    if (grossAfterPension > 100000) {
      personalAllowance = Math.max(0, personalAllowance - (grossAfterPension - 100000) / 2);
    }
    const taxableIncome = grossAfterPension - personalAllowance;
    if (taxableIncome <= 0) return 0;

    if (region === 'uk') {
      const { basicRate, higherRate, additionalRate } = TAX_BANDS_UK;
      let income = taxableIncome;
      if (income > higherRate.threshold - personalAllowance) {
        tax += (income - (higherRate.threshold - personalAllowance)) * additionalRate.rate;
        income = higherRate.threshold - personalAllowance;
      }
      if (income > basicRate.threshold - personalAllowance) {
        tax += (income - (basicRate.threshold - personalAllowance)) * higherRate.rate;
        income = basicRate.threshold - personalAllowance;
      }
      tax += income * basicRate.rate;
    } else { // Scotland
      const bands = TAX_BANDS_SCOTLAND;
      let income = taxableIncome;
      if (income > bands.advancedRate.threshold - personalAllowance) {
        tax += (income - (bands.advancedRate.threshold - personalAllowance)) * bands.topRate.rate;
        income = bands.advancedRate.threshold - personalAllowance;
      }
      if (income > bands.higherRate.threshold - personalAllowance) {
        tax += (income - (bands.higherRate.threshold - personalAllowance)) * bands.advancedRate.rate;
        income = bands.higherRate.threshold - personalAllowance;
      }
      if (income > bands.intermediateRate.threshold - personalAllowance) {
        tax += (income - (bands.intermediateRate.threshold - personalAllowance)) * bands.higherRate.rate;
        income = bands.intermediateRate.threshold - personalAllowance;
      }
      if (income > bands.basicRate.threshold - personalAllowance) {
        tax += (income - (bands.basicRate.threshold - personalAllowance)) * bands.intermediateRate.rate;
        income = bands.basicRate.threshold - personalAllowance;
      }
      if (income > bands.starterRate.threshold - personalAllowance) {
        tax += (income - (bands.starterRate.threshold - personalAllowance)) * bands.basicRate.rate;
        income = bands.starterRate.threshold - personalAllowance;
      }
      tax += income * bands.starterRate.rate;
    }
    return Math.round(tax * 100) / 100;
  };

  const calculateNI = (grossYearly: number): number => {
    if (grossYearly <= NI_RATES.primaryThreshold) return 0;
    let ni = 0;
    if (grossYearly <= NI_RATES.upperEarningsLimit) {
      ni = (grossYearly - NI_RATES.primaryThreshold) * NI_RATES.rateBelowUEL;
    } else {
      ni = (NI_RATES.upperEarningsLimit - NI_RATES.primaryThreshold) * NI_RATES.rateBelowUEL +
        (grossYearly - NI_RATES.upperEarningsLimit) * NI_RATES.rateAboveUEL;
    }
    return Math.round(ni * 100) / 100;
  };

  const calculateStudentLoan = (grossYearly: number): number => {
    if (studentLoanPlan === 'none') return 0;
    const threshold = STUDENT_LOAN_THRESHOLDS[studentLoanPlan];
    const rate = STUDENT_LOAN_RATES[studentLoanPlan];
    if (grossYearly <= threshold) return 0;
    return Math.round((grossYearly - threshold) * rate * 100) / 100;
  };

  const calculateSalary = () => {
    const salaryValue = parseFloat(salary);
    if (!salaryValue || salaryValue <= 0) return;

    const pensionPercent = parseFloat(pensionContribution) || 0;
    const yearlyPension = (salaryValue * pensionPercent) / 100;
    const grossAfterPension = salaryValue - yearlyPension;

    const tax = calculateTax(grossAfterPension, taxRegion);
    const ni = calculateNI(salaryValue);
    const studentLoan = calculateStudentLoan(salaryValue);
    const netYearly = grossAfterPension - tax - ni - studentLoan;

    setBreakdown({
      yearly: { gross: salaryValue, pension: yearlyPension, tax, ni, studentLoan, net: netYearly },
      monthly: { gross: salaryValue / 12, pension: yearlyPension / 12, tax: tax / 12, ni: ni / 12, studentLoan: studentLoan / 12, net: netYearly / 12 },
      weekly: { gross: salaryValue / 52, pension: yearlyPension / 52, tax: tax / 52, ni: ni / 52, studentLoan: studentLoan / 52, net: netYearly / 52 },
    });
    setStep('salary');
  };

  const handleProceed = () => {
    calculateSalary();
    setStep('outgoings');
  };

  const handleOutgoingChange = (category: OutgoingsCategory, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value);
    if (numValue === '' || (numValue >= 0)) {
      setOutgoings({ ...outgoings, [category]: numValue });
    }
  };

  const totalOutgoings = useMemo(() => {
    return Object.values(outgoings).reduce((acc: number, val) => acc + (Number(val) || 0), 0);
  }, [outgoings]);

  const remainingMonthlyNet = breakdown ? breakdown.monthly.net - totalOutgoings : 0;

  const formatCurrency = (amount: number, showDecimals = false): string => new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP', minimumFractionDigits: showDecimals ? 2 : 0, maximumFractionDigits: showDecimals ? 2 : 0
  }).format(amount);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-10 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <SalaryInputForm
              salary={salary}
              setSalary={setSalary}
              pensionContribution={pensionContribution}
              setPensionContribution={setPensionContribution}
              taxRegion={taxRegion}
              setTaxRegion={setTaxRegion}
              studentLoanPlan={studentLoanPlan}
              setStudentLoanPlan={setStudentLoanPlan}
              handleProceed={handleProceed}
            />
          </div>

          <div className="lg:col-span-3">
            {step === 'salary' && !breakdown && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center flex flex-col justify-center items-center h-full">
                <Calculator className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your financial breakdown will appear here.</h3>
                <p className="text-gray-500 dark:text-gray-400">Enter your details and click calculate to get started.</p>
              </div>
            )}

            {(step === 'salary' && breakdown) && (
              <div>
                {/* Navigation Buttons */}
                <div className="flex gap-4 mb-6">
                  <button
                    className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md text-center cursor-default"
                  >
                    Salary
                  </button>
                  <button
                    onClick={() => setStep('outgoings')}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md text-center"
                  >
                    Budget
                  </button>
                </div>
                <SalaryResults breakdown={breakdown} formatCurrency={formatCurrency} />
              </div>
            )}

            {step === 'outgoings' && breakdown && (
              <OutgoingsPlanner
                outgoings={outgoings}
                handleOutgoingChange={handleOutgoingChange}
                totalOutgoings={totalOutgoings}
                remainingMonthlyNet={remainingMonthlyNet}
                monthlyNet={breakdown.monthly.net}
                setStep={setStep}
                formatCurrency={formatCurrency}
                theme={theme}
              />
            )}
          </div>
        </div>
        <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Calculations are based on 2024/2025 tax rates and are for guidance only.</p>
          <p className="mt-1">Created By O Kassama</p>
        </footer>
      </div>
    </div>
  );
};

export default OKSalaryCalculator;
