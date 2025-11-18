import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { ArrowLeft, Home, Landmark, Car, Shield, CreditCard, Zap, Flame, ShoppingCart, Clapperboard, Shirt, Network, PiggyBank, Umbrella, Baby, Train, PlusCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

type OutgoingsCategory = 
  'Rent/Mortgage' | 'Council Tax' | 'Car' | 'Insurances' | 'Credit Cards' | 'Electricity' | 'Gas' | 'Food' |
  'Entertainment' | 'Clothing' | 'Online Subscriptions' | 'Savings/Investments' | 'Holidays' | 'Childcare' |
  'Public Transport' | 'Other';

interface OutgoingsPlannerProps {
  outgoings: Record<OutgoingsCategory, number | ''>;
  handleOutgoingChange: (category: OutgoingsCategory, value: string) => void;
  totalOutgoings: number;
  remainingMonthlyNet: number;
  monthlyNet: number;
  setStep: (step: 'salary' | 'outgoings') => void;
  formatCurrency: (amount: number, showDecimals?: boolean) => string;
  theme: 'light' | 'dark';
}

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1943", "#6c757d", "#343a40", "#ffc107", "#dc3545", "#17a2b8", "#28a745", "#fd7e14", "#6f42c1", "#20c997", "#e83e8c"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-bold text-lg text-gray-900 dark:text-white">{label}</p>
        <p className="text-indigo-600 dark:text-indigo-400">{`Amount: ${new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

const OutgoingsPlanner: React.FC<OutgoingsPlannerProps> = ({
  outgoings,
  handleOutgoingChange,
  totalOutgoings,
  remainingMonthlyNet,
  monthlyNet,
  setStep,
  formatCurrency,
  theme,
}) => {
  const outgoingsData = Object.entries(outgoings)
    .filter(([, value]) => Number(value) > 0)
    .map(([name, value]) => ({ name, value: Number(value) }));

  const half = Math.ceil(outgoingsCategories.length / 2);
  const firstHalf = outgoingsCategories.slice(0, half);
  const secondHalf = outgoingsCategories.slice(half);

  const exportToWord = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>OK Salary & Budget Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; }
          .header h1 { color: #4F46E5; margin: 0; font-size: 28px; }
          .header p { color: #666; margin: 5px 0; }
          .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 30px 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
          .summary-card { background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
          .summary-card.green { border-left: 4px solid #10B981; }
          .summary-card.red { border-left: 4px solid #EF4444; }
          .summary-card.blue { border-left: 4px solid #3B82F6; }
          .summary-card h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; }
          .summary-card .value { font-size: 20px; font-weight: bold; margin: 0; }
          .section-title { font-size: 20px; font-weight: bold; color: #2d3748; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
          .outgoings-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .outgoings-table th, .outgoings-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .outgoings-table th { background: #4F46E5; color: white; font-weight: bold; }
          .outgoings-table tr:nth-child(even) { background: #f9f9f9; }
          .total-row { background: #e8f4fd !important; font-weight: bold; }
          .insights { background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3B82F6; margin: 20px 0; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>OK Salary & Budget Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <h2 class="section-title">Financial Summary</h2>
          <div class="summary-grid">
            <div class="summary-card green">
              <h3>Monthly Net Pay</h3>
              <div class="value">${formatCurrency(monthlyNet)}</div>
            </div>
            <div class="summary-card red">
              <h3>Monthly Outgoings</h3>
              <div class="value">${formatCurrency(totalOutgoings)}</div>
            </div>
            <div class="summary-card blue">
              <h3>Money Left Over</h3>
              <div class="value">${formatCurrency(remainingMonthlyNet)}</div>
            </div>
          </div>
        </div>

        <h2 class="section-title">Monthly Outgoings Breakdown</h2>
        <table class="outgoings-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${outgoingsData.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${formatCurrency(item.value)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td><strong>Total Outgoings</strong></td>
              <td><strong>${formatCurrency(totalOutgoings)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="insights">
          <h2 class="section-title">Financial Insights</h2>
          <p>
            ${remainingMonthlyNet > 0 
              ? `Great! You have ${formatCurrency(remainingMonthlyNet)} left after expenses. Consider saving or investing this amount.`
              : `Your expenses exceed your income by ${formatCurrency(Math.abs(remainingMonthlyNet))}. Consider reviewing your budget.`
            }
          </p>
        </div>

        <div class="footer">
          <p>Generated by OK Salary & Budget</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salary-calculator-report-${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div>
      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setStep('salary')}
          className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md text-center"
        >
          Salary
        </button>
        <button
          className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md text-center cursor-default"
        >
          Budget
        </button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget Planner</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="w-full h-96">
              <ResponsiveContainer>
                <BarChart data={outgoingsData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(Number(value))} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={200} 
                    tick={{ fill: theme === 'dark' ? '#FFF' : '#000', fontSize: 12 }}
                    interval={0}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Monthly Outgoings">
                    {outgoingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400">Total Monthly Outgoings:</p>
              <p className="font-bold text-2xl text-red-500">{formatCurrency(totalOutgoings)}</p>
            </div>
            
            {/* Export Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={exportToWord}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md"
              >
                <FileText className="w-5 h-5" />
                Export to Word
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Your Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <SummaryCard title="Monthly Net Pay" value={formatCurrency(monthlyNet)} color="green" />
              <SummaryCard title="Monthly Outgoings" value={formatCurrency(totalOutgoings)} color="red" />
              <SummaryCard title="Money Left Over" value={formatCurrency(remainingMonthlyNet)} color="blue" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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

export default OutgoingsPlanner;
