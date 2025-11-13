import React, { useState } from 'react';
import { Calculator, PoundSterling, Calendar, Clock, TrendingUp, FileText, PieChart } from 'lucide-react';

interface SalaryBreakdown {
  yearly: {
    gross: number;
    tax: number;
    ni: number;
    studentLoan: number;
    net: number;
  };
  monthly: {
    gross: number;
    tax: number;
    ni: number;
    studentLoan: number;
    net: number;
  };
  weekly: {
    gross: number;
    tax: number;
    ni: number;
    studentLoan: number;
    net: number;
  };
  hourly: number;
}

const OKSalaryCalculator = () => {
  const [salary, setSalary] = useState<string>('');
  const [frequency, setFrequency] = useState<'yearly' | 'monthly' | 'weekly'>('yearly');
  const [studentLoanPlan, setStudentLoanPlan] = useState<'none' | 'plan1' | 'plan2' | 'plan4' | 'postgrad'>('none');
  const [breakdown, setBreakdown] = useState<SalaryBreakdown | null>(null);

  // UK Tax Bands 2024/2025 (England, Wales, NI)
  const TAX_BANDS = {
    personalAllowance: 12570,
    basicRate: { threshold: 50270, rate: 0.2 },
    higherRate: { threshold: 125140, rate: 0.4 },
    additionalRate: { rate: 0.45 }
  };

  // NI Rates 2024/2025 (Effective from April 6, 2024)
  const NI_RATES = {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    rateBelowUEL: 0.08,
    rateAboveUEL: 0.02
  };

  // Student Loan Thresholds 2024/2025
  const STUDENT_LOAN_THRESHOLDS = {
    plan1: 24990, // Updated from 22015
    plan2: 27295,
    plan4: 31395, // Updated from 27660
    postgrad: 21000
  };

  const STUDENT_LOAN_RATES = {
    plan1: 0.09,
    plan2: 0.09,
    plan4: 0.09,
    postgrad: 0.06
  };

  const calculateTax = (grossYearly: number): number => {
    let tax = 0;
    
    // This calculation does not account for the tapering of personal allowance for incomes over £100,000.
    if (grossYearly > TAX_BANDS.personalAllowance) {
      const taxableIncome = grossYearly - TAX_BANDS.personalAllowance;
      
      if (grossYearly <= TAX_BANDS.basicRate.threshold) {
        tax = taxableIncome * TAX_BANDS.basicRate.rate;
      } else if (grossYearly <= TAX_BANDS.higherRate.threshold) {
        const basicRateTax = (TAX_BANDS.basicRate.threshold - TAX_BANDS.personalAllowance) * TAX_BANDS.basicRate.rate;
        const higherRateTax = (grossYearly - TAX_BANDS.basicRate.threshold) * TAX_BANDS.higherRate.rate;
        tax = basicRateTax + higherRateTax;
      } else {
        const basicRateTax = (TAX_BANDS.basicRate.threshold - TAX_BANDS.personalAllowance) * TAX_BANDS.basicRate.rate;
        const higherRateTax = (TAX_BANDS.higherRate.threshold - TAX_BANDS.basicRate.threshold) * TAX_BANDS.higherRate.rate;
        const additionalRateTax = (grossYearly - TAX_BANDS.higherRate.threshold) * TAX_BANDS.additionalRate.rate;
        tax = basicRateTax + higherRateTax + additionalRateTax;
      }
    }
    
    return Math.round(tax * 100) / 100;
  };

  const calculateNI = (grossYearly: number): number => {
    if (grossYearly <= NI_RATES.primaryThreshold) {
      return 0;
    }
    
    let ni = 0;
    
    if (grossYearly <= NI_RATES.upperEarningsLimit) {
      ni = (grossYearly - NI_RATES.primaryThreshold) * NI_RATES.rateBelowUEL;
    } else {
      const earningsBelowUEL = NI_RATES.upperEarningsLimit - NI_RATES.primaryThreshold;
      const earningsAboveUEL = grossYearly - NI_RATES.upperEarningsLimit;
      ni = (earningsBelowUEL * NI_RATES.rateBelowUEL) + (earningsAboveUEL * NI_RATES.rateAboveUEL);
    }
    
    return Math.round(ni * 100) / 100;
  };

  const calculateStudentLoan = (grossYearly: number): number => {
    if (studentLoanPlan === 'none') return 0;
    
    const threshold = STUDENT_LOAN_THRESHOLDS[studentLoanPlan];
    const rate = STUDENT_LOAN_RATES[studentLoanPlan];
    
    if (grossYearly <= threshold) return 0;
    
    const repayment = (grossYearly - threshold) * rate;
    return Math.round(repayment * 100) / 100;
  };

  const calculateSalary = () => {
    const salaryValue = parseFloat(salary);
    if (!salaryValue || salaryValue <= 0) return;

    let grossYearly = salaryValue;
    
    // Convert to yearly
    switch (frequency) {
      case 'monthly':
        grossYearly = salaryValue * 12;
        break;
      case 'weekly':
        grossYearly = salaryValue * 52;
        break;
    }

    const tax = calculateTax(grossYearly);
    const ni = calculateNI(grossYearly);
    const studentLoan = calculateStudentLoan(grossYearly);
    const netYearly = grossYearly - tax - ni - studentLoan;

    const result: SalaryBreakdown = {
      yearly: {
        gross: grossYearly,
        tax,
        ni,
        studentLoan,
        net: netYearly
      },
      monthly: {
        gross: grossYearly / 12,
        tax: tax / 12,
        ni: ni / 12,
        studentLoan: studentLoan / 12,
        net: netYearly / 12
      },
      weekly: {
        gross: grossYearly / 52,
        tax: tax / 52,
        ni: ni / 52,
        studentLoan: studentLoan / 52,
        net: netYearly / 52
      },
      hourly: netYearly / 52 / 37.5 // Based on 37.5 hour week
    };

    setBreakdown(result);
  };

  const formatCurrency = (amount: number, showDecimals = false): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    }).format(amount);
  };

  const BreakdownCard = ({ title, data, icon: Icon, timeframe }: { 
    title: string; 
    data: any; 
    icon: any;
    timeframe: string;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {timeframe}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Gross Salary:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(data.gross)}</span>
        </div>
        
        <div className="flex justify-between items-center text-red-600">
          <span>Income Tax:</span>
          <span>-{formatCurrency(data.tax)}</span>
        </div>
        
        <div className="flex justify-between items-center text-red-600">
          <span>National Insurance:</span>
          <span>-{formatCurrency(data.ni)}</span>
        </div>
        
        {data.studentLoan > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span>Student Loan:</span>
            <span>-{formatCurrency(data.studentLoan)}</span>
          </div>
        )}
        
        <hr className="my-3 border-gray-200" />
        
        <div className="flex justify-between items-center text-green-600 text-lg font-bold">
          <span>Take Home Pay:</span>
          <span>{formatCurrency(data.net)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">OK Salary Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your UK take-home pay with accurate National Insurance and Student Loan deductions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <PoundSterling className="h-6 w-6 mr-2 text-blue-600" />
                Enter Your Details
              </h2>
              
              <div className="space-y-6">
                {/* Salary Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PoundSterling className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="Enter your salary"
                    />
                  </div>
                </div>

                {/* Frequency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'yearly', label: 'Yearly', icon: Calendar },
                      { value: 'monthly', label: 'Monthly', icon: TrendingUp },
                      { value: 'weekly', label: 'Weekly', icon: Clock }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setFrequency(value as any)}
                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${
                          frequency === value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <Icon className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Student Loan Plan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Loan Plan
                  </label>
                  <select
                    value={studentLoanPlan}
                    onChange={(e) => setStudentLoanPlan(e.target.value as any)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="none">No Student Loan</option>
                    <option value="plan1">Plan 1 (Started course before 2012)</option>
                    <option value="plan2">Plan 2 (Started course after 2012)</option>
                    <option value="plan4">Plan 4 (Scotland)</option>
                    <option value="postgrad">Postgraduate Loan</option>
                  </select>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateSalary}
                  disabled={!salary || parseFloat(salary) <= 0}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Calculate Take-Home Pay
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-green-600" />
                Comprehensive Salary Breakdown
              </h2>

              {breakdown ? (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Yearly</h4>
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {formatCurrency(breakdown.yearly.net)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Take Home</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Monthly</h4>
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatCurrency(breakdown.monthly.net)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Take Home</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="h-6 w-6 text-purple-600 mr-2" />
                        <h4 className="font-semibold text-gray-900">Weekly</h4>
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {formatCurrency(breakdown.weekly.net)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Take Home</p>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                      Detailed Breakdown by Timeframe
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <BreakdownCard
                        title="Yearly"
                        data={breakdown.yearly}
                        icon={Calendar}
                        timeframe="Per Year"
                      />
                      
                      <BreakdownCard
                        title="Monthly"
                        data={breakdown.monthly}
                        icon={TrendingUp}
                        timeframe="Per Month"
                      />
                      
                      <BreakdownCard
                        title="Weekly"
                        data={breakdown.weekly}
                        icon={Clock}
                        timeframe="Per Week"
                      />
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-center text-white">
                    <h4 className="font-semibold text-lg mb-2">Equivalent Hourly Rate</h4>
                    <div className="text-3xl font-bold mb-2">
                      {formatCurrency(breakdown.hourly, true)}/hour
                    </div>
                    <p className="text-purple-100 text-sm">
                      Based on 37.5 hours per week, 52 weeks per year
                    </p>
                  </div>

                  {/* Tax Efficiency */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Tax Efficiency Analysis</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-600">Tax Rate</div>
                        <div className="text-lg font-bold text-red-600">
                          {((breakdown.yearly.tax / breakdown.yearly.gross) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">NI Rate</div>
                        <div className="text-lg font-bold text-orange-600">
                          {((breakdown.yearly.ni / breakdown.yearly.gross) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Take Home %</div>
                        <div className="text-lg font-bold text-green-600">
                          {((breakdown.yearly.net / breakdown.yearly.gross) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Deductions</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatCurrency(breakdown.yearly.tax + breakdown.yearly.ni + breakdown.yearly.studentLoan)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Enter your salary details to see your comprehensive take-home pay breakdown
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Calculations are based on 2024/2025 tax rates for England, Wales &amp; Northern Ireland. This is for guidance only.</p>
        </div>
      </div>
    </div>
  );
};

export default OKSalaryCalculator;
