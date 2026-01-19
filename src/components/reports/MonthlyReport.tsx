import { useState } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MonthlyReportProps {
  availableMonths: string[];
  getMonthlyUsage: (month: string) => { itemName: string; box: string; quantity: number }[];
}

const MonthlyReport = ({ availableMonths, getMonthlyUsage }: MonthlyReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const usageData = selectedMonth ? getMonthlyUsage(selectedMonth) : [];

  const handleExport = () => {
    if (!selectedMonth || usageData.length === 0) {
      alert('Please select a month with data first');
      return;
    }

    let csv = 'Month,Product Name,Box,Units Used\n';
    usageData.forEach(row => {
      csv += `"${selectedMonth}","${row.itemName}","${row.box}",${row.quantity}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OKTO-Usage-${selectedMonth}.csv`;
    a.click();
  };

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-accent" />
          Monthly Usage Report
        </h2>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-2 p-4">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a month..." />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {availableMonths.length === 0 ? (
              <SelectItem value="none" disabled>No data available</SelectItem>
            ) : (
              availableMonths.map(month => (
                <SelectItem key={month} value={month}>
                  {formatMonth(month)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExport} disabled={!selectedMonth || usageData.length === 0}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {!selectedMonth ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-3 opacity-50" />
            <p>Select a month to view usage data</p>
          </div>
        ) : usageData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mb-3 opacity-50" />
            <p>No products used in this month</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Product Name</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Box</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-right">Units Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{row.itemName}</TableCell>
                    <TableCell className="text-muted-foreground">{row.box}</TableCell>
                    <TableCell className="text-right font-semibold">{row.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReport;
