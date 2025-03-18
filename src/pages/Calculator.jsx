import React from 'react';
import { create } from 'zustand';
import { Toaster, toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { factorial, erf, exp, pow } from 'mathjs';
import '../styles/App.css';

// Zustand Store
const useProbabilityStore = create((set) => ({
  distribution: 'binomial',
  params: {},
  result: null,
  chartData: [],
  setDistribution: (dist) => set({ distribution: dist, params: {}, result: null, chartData: [] }),
  setParams: (params) => set({ params }),
  setResult: (result) => set({ result }),
  setChartData: (data) => set({ chartData: data }),
}));

// Probability Functions
const binomial = (n, k, p) => (factorial(n) / (factorial(k) * factorial(n - k))) * pow(p, k) * pow(1 - p, n - k);
const poisson = (k, lambda) => (pow(lambda, k) * exp(-lambda)) / factorial(k);
const geometric = (k, p) => pow(1 - p, k - 1) * p;
const uniform = (a, b) => (a <= b ? 1 / (b - a) : 0);
const exponential = (x, lambda) => lambda * exp(-lambda * x);
const normal = (x, mean, std_dev) => 0.5 * (1 + erf((x - mean) / (std_dev * Math.sqrt(2))));

const calculateProbability = (distribution, params) => {
  switch (distribution) {
    case 'binomial': return binomial(params.n, params.k, params.p);
    case 'poisson': return poisson(params.k, params.lambda);
    case 'geometric': return geometric(params.k, params.p);
    case 'uniform': return uniform(params.a, params.b);
    case 'exponential': return exponential(params.x, params.lambda);
    case 'normal': return normal(params.x, params.mean, params.std_dev);
    default: return null;
  }
};

const generateChartData = (distribution, params) => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    let value;
    switch (distribution) {
      case 'binomial': 
        value = binomial(params.n, i, params.p); 
        break;
      case 'poisson': 
        value = poisson(i, params.lambda); 
        break;
      case 'geometric': 
        value = geometric(i, params.p); 
        break;
      case 'uniform': 
        value = uniform(params.a, params.b); 
        break;
      case 'exponential': 
        value = exponential(i, params.lambda); 
        break;
      case 'normal': 
        value = normal(i, params.mean, params.std_dev); 
        break;
      default: 
        value = 0;
    }
    data.push({ x: i, y: value });
  }

  return (
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="gray" />
    <XAxis dataKey="x" stroke="black" />
    <YAxis stroke="black" />
    <Tooltip />
    <Line type="monotone" dataKey="y" stroke="black" activeDot={{ r: 8 }} />
  </LineChart>
</ResponsiveContainer>

  );
};


const Calculator = () => {
  const { distribution, params, result, chartData, setDistribution, setParams, setResult, setChartData } = useProbabilityStore();

  const handleCalculate = () => {
    const res = calculateProbability(distribution, params);
    setResult(res);
    setChartData(generateChartData(distribution, params));
    toast.success('Calculation Successful!');
  };

  const handleParamChange = (key, value) => {
    setParams({ ...params, [key]: parseFloat(value) });
  };

  const renderInputs = () => {
    switch (distribution) {
      case 'binomial':
        return (
          <>
            <input type="number" placeholder="n" onChange={(e) => handleParamChange('n', e.target.value)} />
            <input type="number" placeholder="k" onChange={(e) => handleParamChange('k', e.target.value)} />
            <input type="number" placeholder="p" step="0.01" onChange={(e) => handleParamChange('p', e.target.value)} />
          </>
        );
      case 'poisson':
        return (
          <>
            <input type="number" placeholder="k" onChange={(e) => handleParamChange('k', e.target.value)} />
            <input type="number" placeholder="Lambda (λ)" onChange={(e) => handleParamChange('lambda', e.target.value)} />
          </>
        );
      case 'geometric':
        return (
          <>
            <input type="number" placeholder="k" onChange={(e) => handleParamChange('k', e.target.value)} />
            <input type="number" placeholder="p" step="0.01" onChange={(e) => handleParamChange('p', e.target.value)} />
          </>
        );
      case 'uniform':
        return (
          <>
            <input type="number" placeholder="a (min)" onChange={(e) => handleParamChange('a', e.target.value)} />
            <input type="number" placeholder="b (max)" onChange={(e) => handleParamChange('b', e.target.value)} />
          </>
        );
      case 'exponential':
        return (
          <>
            <input type="number" placeholder="x" onChange={(e) => handleParamChange('x', e.target.value)} />
            <input type="number" placeholder="Lambda (λ)" onChange={(e) => handleParamChange('lambda', e.target.value)} />
          </>
        );
      case 'normal':
        return (
          <>
            <input type="number" placeholder="x" onChange={(e) => handleParamChange('x', e.target.value)} />
            <input type="number" placeholder="Mean (μ)" onChange={(e) => handleParamChange('mean', e.target.value)} />
            <input type="number" placeholder="Std Dev (σ)" onChange={(e) => handleParamChange('std_dev', e.target.value)} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <h1>Probability Calculator</h1>
      <select value={distribution} onChange={(e) => setDistribution(e.target.value)}>
        <option value="binomial">Binomial Distribution</option>
        <option value="poisson">Poisson Distribution</option>
        <option value="geometric">Geometric Distribution</option>
        <option value="uniform">Uniform Distribution</option>
        <option value="exponential">Exponential Distribution</option>
        <option value="normal">Normal Distribution</option>
      </select>
      <div>{renderInputs()}</div>
      <button onClick={handleCalculate}>CALCULATE</button>
      <p>Result: {result !== null ? result.toFixed(4) : ''}</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <Toaster />
    </div>
  );
};

export default Calculator;
