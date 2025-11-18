import React from 'react';
import { PoundSterling, Briefcase, MapPin, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface SalaryInputFormProps {
  salary: string;
  setSalary: (value: string) => void;
  pensionContribution: string;
  setPensionContribution: (value: string) => void;
  taxRegion: 'uk' | 'scotland';
  setTaxRegion: (value: 'uk' | 'scotland') => void;
  studentLoanPlan: 'none' | 'plan1' | 'plan2' | 'plan4' | 'postgrad';
  setStudentLoanPlan: (value: 'none' | 'plan1' | 'plan2' | 'plan4' | 'postgrad') => void;
  handleProceed: () => void;
}

const SalaryInputForm: React.FC<SalaryInputFormProps> = ({
  salary,
  setSalary,
  pensionContribution,
  setPensionContribution,
  taxRegion,
  setTaxRegion,
  studentLoanPlan,
  setStudentLoanPlan,
  handleProceed,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Financials</CardTitle>
      </CardHeader>
      <CardContent>
        <InputRow label="Annual Salary" icon={PoundSterling}>
          <Input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g., 50000"
          />
        </InputRow>

        <InputRow label="Pension Contribution (%)" icon={Briefcase}>
          <Input
            type="number"
            value={pensionContribution}
            onChange={(e) => setPensionContribution(e.target.value)}
            placeholder="e.g., 5"
          />
        </InputRow>

        <InputRow label="Tax Region" icon={MapPin}>
          <select
            value={taxRegion}
            onChange={(e) => setTaxRegion(e.target.value as any)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
          >
            <option value="uk">UK (England, Wales, NI)</option>
            <option value="scotland">Scotland</option>
          </select>
        </InputRow>

        <InputRow label="Student Loan" icon={FileText}>
          <select
            value={studentLoanPlan}
            onChange={(e) => setStudentLoanPlan(e.target.value as any)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
          >
            <option value="none">No Student Loan</option>
            <option value="plan1">Plan 1 - Started university before 2012 (England, Wales, NI)</option>
            <option value="plan2">Plan 2 - Started university 2012-2023 (England, Wales)</option>
            <option value="plan4">Plan 4 - Scottish students (SAAS loans)</option>
            <option value="postgrad">Postgraduate Loan - Master's or PhD courses</option>
          </select>
        </InputRow>

        <Button
          onClick={handleProceed}
          disabled={!salary || parseFloat(salary) <= 0}
          className="mt-6"
        >
          Calculate & Plan Budget <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

const InputRow = ({ label, icon: Icon, children }: { label: string, icon: React.ElementType, children: React.ReactNode }) => (
  <div className="mb-4">
    <label className="font-semibold mb-2 flex items-center text-gray-700 dark:text-gray-300">
      <Icon className="w-5 h-5 mr-2" /> {label}
    </label>
    {children}
  </div>
);

export default SalaryInputForm;
