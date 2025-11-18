import React from 'react';
import { PieChart as PieChartIcon, Calendar, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface SalaryBreakdown {
  yearly: { gross: number; tax: number; ni: number; studentLoan: number; pension: number; net: number; };
  monthly: { gross: number; tax: number; ni: number; studentLoan: number; pension: number; net: number; };
  weekly: { gross: number; tax: number; ni: number; studentLoan: number; pension: number; net: number; };
}

interface SalaryResultsProps {
  breakdown: SalaryBreakdown;
  formatCurrency: (amount: number, showDecimals?: boolean) => string;
}

const SalaryResults: React.FC<SalaryResultsProps> = ({ breakdown, formatCurrency }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <PieChartIcon className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
        Salary Breakdown
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 text-center">
        <StatCard title="Net Monthly Pay" value={formatCurrency(breakdown.monthly.net)} color="green" />
        <StatCard title="Total Annual Deductions" value={formatCurrency(breakdown.yearly.tax + breakdown.yearly.ni + breakdown.yearly.studentLoan + breakdown.yearly.pension)} color="red" />
        <StatCard title="Take Home %" value={`${((breakdown.yearly.net / breakdown.yearly.gross) * 100).toFixed(1)}%`} color="blue" />
        <StatCard title="Hourly Rate (Net)" value={formatCurrency(breakdown.yearly.net / (52 * 37.5), true)} color="purple" />
      </div>
      
      <div className="text-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Hourly Rates (37.5h week)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gross Hourly</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{formatCurrency(breakdown.yearly.gross / (52 * 37.5), true)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Hourly</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(breakdown.yearly.net / (52 * 37.5), true)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BreakdownCard title="Yearly" data={breakdown.yearly} icon={Calendar} formatCurrency={formatCurrency} />
        <BreakdownCard title="Monthly" data={breakdown.monthly} icon={TrendingUp} formatCurrency={formatCurrency} />
        <BreakdownCard title="Weekly" data={breakdown.weekly} icon={Clock} formatCurrency={formatCurrency} />
      </div>
    </CardContent>
  </Card>
);

const StatCard = ({ title, value, color }: { title: string, value: string, color: 'green' | 'red' | 'blue' | 'purple' }) => {
  const colors = {
    green: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
    red: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
    purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300",
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

export default SalaryResults;
