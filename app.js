const { useState, useEffect } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } = Recharts;
const { Calculator, TrendingUp, DollarSign, Clock } = LucideReact;

export default function ETFSavingsCalculator() {
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [timeHorizon, setTimeHorizon] = useState(20);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [results, setResults] = useState(null);

  const calculateReturns = () => {
    const monthlyReturn = annualReturn / 100 / 12;
    const totalMonths = timeHorizon * 12;
    
    let chartData = [];
    let currentValue = initialInvestment;
    let totalContributions = initialInvestment;
    
    // Add initial data point
    chartData.push({
      year: 0,
      totalValue: initialInvestment,
      totalContributions: initialInvestment,
      totalReturns: 0
    });
    
    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly contribution
      currentValue += monthlyContribution;
      totalContributions += monthlyContribution;
      
      // Apply monthly return
      currentValue *= (1 + monthlyReturn);
      
      // Store yearly data points
      if (month % 12 === 0) {
        const year = month / 12;
        const totalReturns = currentValue - totalContributions;
        
        chartData.push({
          year: year,
          totalValue: Math.round(currentValue),
          totalContributions: totalContributions,
          totalReturns: Math.round(totalReturns)
        });
      }
    }
    
    const finalValue = currentValue;
    const totalInvested = totalContributions;
    const totalReturns = finalValue - totalInvested;
    const roi = ((finalValue - totalInvested) / totalInvested) * 100;
    
    setResults({
      finalValue,
      totalInvested,
      totalReturns,
      roi,
      chartData
    });
  };

  useEffect(() => {
    calculateReturns();
  }, [monthlyContribution, annualReturn, timeHorizon, initialInvestment]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">ETF Savings Plan Calculator</h1>
          </div>
          <p className="text-gray-600">Calculate the potential growth of your ETF investment over time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Investment Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Investment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Contribution
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Annual Return (%)
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="7"
                      min="0"
                      max="30"
                      step="0.1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Typical ETF returns: 6-8% annually</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Period (Years)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="20"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {results && (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Final Portfolio Value</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(results.finalValue)}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Returns</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(results.totalReturns)}
                        </p>
                        <p className="text-sm text-gray-500">
                          ROI: {results.roi.toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Invested</p>
                        <p className="text-2xl font-bold text-gray-700">
                          {formatCurrency(results.totalInvested)}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Calculator className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Monthly Contribution</p>
                        <p className="text-2xl font-bold text-indigo-600">
                          {formatCurrency(monthlyContribution)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(monthlyContribution * 12)}/year
                        </p>
                      </div>
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <Clock className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4% Rule Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 mb-6 border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    4% Rule - Retirement Income Potential
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Annual Retirement Income</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(results.finalValue * 0.04)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Based on 4% withdrawal rate</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Monthly Retirement Income</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency((results.finalValue * 0.04) / 12)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Sustainable monthly withdrawal</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>The 4% Rule:</strong> A guideline suggesting you can withdraw 4% of your portfolio annually in retirement 
                      without depleting your savings over a 30-year period, assuming historical market performance.
                    </p>
                  </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Portfolio Growth Over Time</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={results.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value, name) => [formatCurrency(value), name]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="totalValue" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        name="Total Portfolio Value"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalContributions" 
                        stroke="#6b7280" 
                        strokeWidth={2}
                        name="Total Contributions"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalReturns" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Investment Returns"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Breakdown Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contributions vs Returns Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results.chartData.filter((_, index) => index % 2 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value, name) => [formatCurrency(value), name]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="totalContributions" stackId="a" fill="#6b7280" name="Contributions" />
                      <Bar dataKey="totalReturns" stackId="a" fill="#3b82f6" name="Returns" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>

                  <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Notes</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• This calculator provides estimates based on consistent monthly contributions and assumed annual returns.</p>
            <p>• Actual ETF performance will vary and past performance doesn't guarantee future results.</p>
            <p>• The 4% rule is based on historical data and assumes a balanced portfolio with 30-year retirement period.</p>
            <p>• Consider fees, taxes, and inflation when planning your investment strategy.</p>
            <p>• Dollar-cost averaging through regular contributions can help reduce the impact of market volatility.</p>
            <p>• Retirement income calculations don't account for taxes, healthcare costs, or changing expenses in retirement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Render the component
ReactDOM.render(React.createElement(ETFSavingsCalculator), document.getElementById('root'));
