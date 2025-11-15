import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Calculator, PoundSterling, Calendar, Clock, TrendingUp, FileText, PieChart as PieChartIcon, MapPin,
  Car, Zap, Flame, Home, ShoppingCart, Clapperboard, Shirt, CreditCard, Shield, Network, PlusCircle, ArrowRight, ArrowLeft,
  Sun, Moon, PiggyBank, Briefcase, Landmark, Train, Baby, Umbrella
} from 'lucide-react';

// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

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
    return Object.values(outgoings).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }, [outgoings]);

  const remainingMonthlyNet = breakdown ? breakdown.monthly.net - totalOutgoings : 0;

  const outgoingsData = useMemo(() => Object.entries(outgoings)
    .filter(([, value]) => Number(value) > 0)
    .map(([name, value]) => ({ name, value: Number(value) })), [outgoings]);

  const formatCurrency = (amount: number, showDecimals = false): string => new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP', minimumFractionDigits: showDecimals ? 2 : 0, maximumFractionDigits: showDecimals ? 2 : 0
  }).format(amount);

  const outgoingsCategories: { name: OutgoingsCategory, icon: React.ElementType }[] = [
    { name: 'Rent/Mortgage', icon: Home },
    { name: 'Council Tax', icon: Landmark },
    { name: 'Car', icon: Car },
    { name: 'Insurances', icon: Shield },
    { name: 'Credit Cards', icon: CreditCard },
    { name: 'Electricity', icon: Zap },
    { name: 'Gas', icon: Flame },
    { name: 'Food', icon: ShoppingCart },
    { name: 'Entertainment', icon: Clapperboard },
    { name: 'Clothing', icon: Shirt },
    { name: 'Online Subscriptions', icon: Network },
    { name: 'Savings/Investments', icon: PiggyBank },
    { name: 'Holidays', icon: Umbrella },
    { name: 'Childcare', icon: Baby },
    { name: 'Public Transport', icon: Train },
    { name: 'Other', icon: PlusCircle },
  ];
  
  const half = Math.ceil(outgoingsCategories.length / 2);
  const firstHalf = outgoingsCategories.slice(0, half);
  const secondHalf = outgoingsCategories.slice(half);


  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1943", "#6c757d", "#343a40", "#ffc107", "#dc3545", "#17a2b8", "#28a745", "#fd7e14", "#6f42c1", "#20c997", "#e83e8c"];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-10 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">Salary & Budget Pro</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Your all-in-one financial planning tool.</p>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Financials</h2>

              <InputRow label="Annual Salary" icon={PoundSterling}>
                <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white" placeholder="e.g., 50000" />
              </InputRow>

              <InputRow label="Pension Contribution (%) " icon={Briefcase}>
                <input type="number" value={pensionContribution} onChange={(e) => setPensionContribution(e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white" placeholder="e.g., 5" />
              </InputRow>

              <InputRow label="Tax Region" icon={MapPin}>
                <select value={taxRegion} onChange={(e) => setTaxRegion(e.target.value as any)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white">
                  <option value="uk">UK (England, Wales, NI)</option>
                  <option value="scotland">Scotland</option>
                </select>
              </InputRow>

              <InputRow label="Student Loan" icon={FileText}>
                <select value={studentLoanPlan} onChange={(e) => setStudentLoanPlan(e.target.value as any)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white">
                  <option value="none">No Student Loan</option>
                  <option value="plan1">Plan 1</option>
                  <option value="plan2">Plan 2</option>
                  <option value="plan4">Plan 4</option>
                  <option value="postgrad">Postgraduate</option>
                </select>
              </InputRow>

              <button onClick={handleProceed} disabled={!salary || parseFloat(salary) <= 0}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all flex items-center justify-center mt-6">
                Calculate & Plan Budget <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {step === 'salary' && !breakdown && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center flex flex-col justify-center items-center h-full">
                <Calculator className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Your financial breakdown will appear here.</h3>
                <p className="text-gray-500 dark:text-gray-400">Enter your details and click calculate to get started.</p>
              </div>
            )}

            {(step === 'salary' && breakdown) && <SalaryResults breakdown={breakdown} formatCurrency={formatCurrency} />}

            {step === 'outgoings' && breakdown && (
              <div>
                <button onClick={() => setStep('salary')} className="mb-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Salary
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Monthly Budget Planner</h2>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                    <div className="space-y-4">
                      {firstHalf.map(({ name, icon: Icon }) => (
                        <div key={name} className="flex items-center">
                          <Icon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />
                          <label className="w-48 font-medium text-sm text-gray-700 dark:text-gray-300">{name}</label>
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">£</span>
                            <input type="number" value={outgoings[name]}
                              onChange={e => handleOutgoingChange(name, e.target.value)}
                              className="w-full p-2 pl-7 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white" placeholder="0" />
                          </div>
                        </div>
                      ))}
                    </div>
                     <div className="space-y-4">
                      {secondHalf.map(({ name, icon: Icon }) => (
                        <div key={name} className="flex items-center">
                          <Icon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />
                          <label className="w-48 font-medium text-sm text-gray-700 dark:text-gray-300">{name}</label>
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">£</span>
                            <input type="number" value={outgoings[name]}
                              onChange={e => handleOutgoingChange(name, e.target.value)}
                              className="w-full p-2 pl-7 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white" placeholder="0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center mb-8">
                    <div className="w-full h-64">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={outgoingsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {outgoingsData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-gray-600 dark:text-gray-400">Total Monthly Outgoings:</p>
                      <p className="font-bold text-2xl text-red-500">{formatCurrency(totalOutgoings)}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Your Financial Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <SummaryCard title="Monthly Net Pay" value={formatCurrency(breakdown.monthly.net)} color="green" />
                      <SummaryCard title="Monthly Outgoings" value={formatCurrency(totalOutgoings)} color="red" />
                      <SummaryCard title="Money Left Over" value={formatCurrency(remainingMonthlyNet)} color="blue" />
                    </div>
                  </div>
                </div>
              </div>
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

const InputRow = ({ label, icon: Icon, children }: { label: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300"><Icon className="w-5 h-5 mr-2" /> {label}</label>
    {children}
  </div>
);

const SalaryResults = ({ breakdown, formatCurrency }: { breakdown: SalaryBreakdown, formatCurrency: any }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white"><PieChartIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" /> Salary Breakdown</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
      <StatCard title="Net Monthly Pay" value={formatCurrency(breakdown.monthly.net)} color="green" />
      <StatCard title="Total Annual Deductions" value={formatCurrency(breakdown.yearly.tax + breakdown.yearly.ni + breakdown.yearly.studentLoan + breakdown.yearly.pension)} color="red" />
      <StatCard title="Take Home %" value={`${((breakdown.yearly.net / breakdown.yearly.gross) * 100).toFixed(1)}%`} color="blue" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BreakdownCard title="Yearly" data={breakdown.yearly} icon={Calendar} formatCurrency={formatCurrency} />
      <BreakdownCard title="Monthly" data={breakdown.monthly} icon={TrendingUp} formatCurrency={formatCurrency} />
      <BreakdownCard title="Weekly" data={breakdown.weekly} icon={Clock} formatCurrency={formatCurrency} />
    </div>
  </div>
);

const StatCard = ({ title, value, color }: { title: string, value: string, color: 'green' | 'red' | 'blue' }) => {
  const colors = {
    green: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
    red: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
  }
  return (
    <div className={`p-4 rounded-lg ${colors[color]}`}>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
};

const BreakdownCard = ({ title, data, icon: Icon, formatCurrency }: { title: string; data: any; icon: any; formatCurrency: any }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-3">
      <Icon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="space-y-2 text-sm">
      <DetailRow label="Gross" value={formatCurrency(data.gross)} />
      {data.pension > 0 && <DetailRow label="Pension" value={`-${formatCurrency(data.pension)}`} isDeduction />}
      <DetailRow label="Tax" value={`-${formatCurrency(data.tax)}`} isDeduction />
      <DetailRow label="NI" value={`-${formatCurrency(data.ni)}`} isDeduction />
      {data.studentLoan > 0 && <DetailRow label="Student Loan" value={`-${formatCurrency(data.studentLoan)}`} isDeduction />}
      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600 mt-2 font-bold text-green-600 dark:text-green-400">
        <span>Net Pay:</span>
        <span>{formatCurrency(data.net)}</span>
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value, isDeduction = false }: { label: string, value: string, isDeduction?: boolean }) => (
  <div className={`flex justify-between ${isDeduction ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
    <span>{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const SummaryCard = ({ title, value, color }: { title: string, value: string, color: 'green' | 'red' | 'blue' }) => {
    const colors = {
        green: "from-green-400 to-green-500",
        red: "from-red-400 to-red-500",
        blue: "from-blue-400 to-blue-500",
    }
    return (
        <div className={`bg-gradient-to-br ${colors[color]} text-white p-4 rounded-lg shadow-md`}>
            <p className="text-sm opacity-90">{title}</p>
            <p className="font-bold text-2xl">{value}</p>
        </div>
    )
};

export default OKSalaryCalculator;
