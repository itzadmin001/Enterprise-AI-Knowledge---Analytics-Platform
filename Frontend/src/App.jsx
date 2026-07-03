import { useMemo, useState } from 'react';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Upload,
    Sparkles,
    Brain,
    CheckCircle2,
    FileSpreadsheet,
    Loader2,
    ShieldCheck,
    TrendingUp,
    Search,
    BarChart3,
} from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarController,
    BarElement,
    ArcElement,
    Legend,
    Title,
    Tooltip,
    Filler,
    LineController
);

const metricCards = [
    { label: 'Total Revenue', key: 'Total_sales', prefix: '$', suffix: '' },
    { label: 'Average Order', key: 'Average_sales', prefix: '$', suffix: '' },
    { label: 'Total Rows', key: 'Total_rows', prefix: '', suffix: '' },
    { label: 'Total Columns', key: 'Total_columns', prefix: '', suffix: '' },
];

function formatNumber(value) {
    if (typeof value === 'number') {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
    }
    return value;
}

function InsightContent({ text }) {
    if (!text) return null;

    const lines = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/#{1,6}\s*/g, '')
        .replace(/^\*\s+/gm, '• ')
        .replace(/^\-\s+/gm, '• ')
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

    return (
        <div className="space-y-4">
            {lines.map((block, index) => {
                const bulletLines = block.split('\n').map((line) => line.trim()).filter(Boolean);

                if (bulletLines.every((line) => line.startsWith('• '))) {
                    return (
                        <ul key={index} className="list-none space-y-2 pl-1">
                            {bulletLines.map((line, bulletIndex) => (
                                <li key={`${index}-${bulletIndex}`} className="flex items-start gap-3">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />
                                    <span className="text-slate-200">{line.replace(/^•\s*/, '')}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }

                if (block.startsWith('1. ') || block.startsWith('2. ') || block.startsWith('3. ') || block.startsWith('4. ') || block.startsWith('5. ')) {
                    return (
                        <div key={index} className="rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3">
                            <p className="font-semibold text-white">{block}</p>
                        </div>
                    );
                }

                return (
                    <p key={index} className="leading-7 text-slate-200">
                        {block}
                    </p>
                );
            })}
        </div>
    );
}

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
        setError('');
        setResult(null);
    };

    const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
    console.log(API_BASE_URL)
    const handleProcess = async () => {
        if (!selectedFile) {
            setError('Please select a CSV or Excel file first.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log(formData, "formData")
        try {
            const res = await fetch(`${API_BASE_URL}/run-analysis`, {
                method: 'POST',
                body: formData,
            });
            console.log(res, "res")
            const data = await res.json();
            console.log(data, "data")
            if (!res.ok) {
                throw new Error(data?.detail || 'Something went wrong while processing the file.');
            }

            setResult(data);
        } catch (err) {
            console.log(err, "err")
            setError(err.message || 'Unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const charts = result?.charts ?? {};

    const summaryCards = useMemo(() => {
        if (!result?.metrics) return [];
        return metricCards.map((card) => ({
            ...card,
            value: result.metrics[card.key],
        }));
    }, [result]);

    return (
        <div className="min-h-screen text-slate-100">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
                <div className="absolute bottom-[-8%] right-[-5%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
                <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl">
                    <div className="border-b border-white/10 px-8 py-6">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-2xl bg-indigo-500/20 p-3 ring-1 ring-indigo-400/30">
                                        <Brain className="h-7 w-7 text-indigo-200" />
                                    </div>
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/60">Enterprise AI Suite</p>
                                        <h1 className="text-3xl font-semibold tracking-tight text-white">Business Intelligence Studio</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <label className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 transition hover:border-cyan-400/60">
                                    <Upload className="h-5 w-5 text-cyan-200" />
                                    <span className="text-sm font-medium text-white">
                                        {selectedFile ? selectedFile.name : 'Choose file'}
                                    </span>
                                    <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
                                </label>

                                <button
                                    onClick={handleProcess}
                                    className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-900/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                                    {loading ? 'Processing...' : 'Process File'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 px-8 py-8 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-500/15 p-2">
                                    <BarChart3 className="h-5 w-5 text-emerald-200" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
                                    <h2 className="text-xl font-semibold text-white">Performance Snapshot</h2>
                                </div>
                            </div>

                            {summaryCards.length > 0 ? (
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {summaryCards.map((card) => (
                                        <div key={card.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.label}</p>
                                            <p className="mt-3 text-2xl font-semibold text-white">
                                                {card.key === 'Total_sales' || card.key === 'Average_sales' ? '$' : ''}
                                                {formatNumber(card.value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/30 text-center">
                                    <FileSpreadsheet className="mb-4 h-12 w-12 text-slate-500" />
                                    <p className="text-slate-300">Upload a file to analyze sales trends, product performance, and business health.</p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-emerald-200" />
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Quality Check</p>
                            </div>
                            {result?.validation_report ? (
                                <div className="space-y-4">
                                    <div className="rounded-2xl bg-white/5 p-4">
                                        <p className="text-sm text-slate-400">Duplicate Rows</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{result.validation_report.duplicate_rows}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 p-4">
                                        <p className="text-sm text-slate-400">Null Percentage</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{result.validation_report.total_null_percentage?.toFixed(2)}%</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/5 p-4">
                                        <p className="text-sm text-slate-400">Unique Values</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">{Object.keys(result.validation_report.unique_values ?? {}).length}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-900/20 text-slate-400">
                                    No validation data yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mx-8 mb-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-8 px-8 pb-8">
                            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Insights</p>
                                        <h3 className="text-2xl font-semibold text-white">Executive Summary</h3>
                                    </div>
                                    <div className="rounded-2xl bg-cyan-400/10 px-3 py-2 text-cyan-100">
                                        <span className="text-sm font-semibold">AI Generated</span>
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-5 text-slate-300">
                                    <InsightContent text={result.insights} />
                                </div>
                            </div>

                            <div className="grid gap-6 xl:grid-cols-2">
                                {charts.sales_trend && (
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                                        <h4 className="mb-4 text-lg font-semibold text-white">Sales Trend</h4>
                                        <div className="h-72">
                                            <Line
                                                data={{
                                                    labels: charts.sales_trend.labels,
                                                    datasets: charts.sales_trend.datasets.map((dataset) => ({
                                                        ...dataset,
                                                        borderColor: '#4f46e5',
                                                        backgroundColor: 'rgba(79, 70, 229, 0.16)',
                                                        fill: true,
                                                        tension: 0.35,
                                                        borderWidth: 3,
                                                        pointRadius: 3,
                                                        pointHoverRadius: 5,
                                                        pointBackgroundColor: '#6366f1',
                                                        pointBorderColor: '#ffffff',
                                                    })),
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: { legend: { display: false } },
                                                    scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.18)' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } },
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {charts.top_products && (
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                                        <h4 className="mb-4 text-lg font-semibold text-white">Top Products</h4>
                                        <div className="h-72">
                                            <Bar
                                                data={{
                                                    labels: charts.top_products.labels,
                                                    datasets: charts.top_products.datasets.map((dataset) => ({
                                                        ...dataset,
                                                        backgroundColor: ['#4f46e5', '#6366f1', '#8b5cf6', '#0ea5e9', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#38bdf8'],
                                                        borderColor: ['#312e81', '#4338ca', '#7c3aed', '#0369a1', '#0f766e', '#047857', '#d97706', '#b91c1c', '#be185d', '#0284c7'],
                                                        borderWidth: 1,
                                                        borderRadius: 6,
                                                    })),
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: { legend: { display: false } },
                                                    scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.18)' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } },
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {charts.category_distribution && (
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                                        <h4 className="mb-4 text-lg font-semibold text-white">Category Distribution</h4>
                                        <div className="mx-auto h-64 max-w-[280px]">
                                            <Pie
                                                data={{
                                                    labels: charts.category_distribution.labels,
                                                    datasets: charts.category_distribution.datasets.map((dataset) => ({
                                                        ...dataset,
                                                        backgroundColor: ['#4f46e5', '#6366f1', '#06b6d4', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#38bdf8'],
                                                        borderColor: '#020617',
                                                        borderWidth: 2,
                                                    })),
                                                }}
                                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 16 } } } }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {charts.correlation_heatmap && (
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5">
                                        <h4 className="mb-4 text-lg font-semibold text-white">Correlation Heatmap</h4>
                                        <div className="overflow-auto">
                                            <table className="min-w-full text-left text-sm">
                                                <thead>
                                                    <tr className="text-slate-400">
                                                        <th className="px-3 py-2"></th>
                                                        {charts.correlation_heatmap.labels.map((label) => (
                                                            <th key={label} className="px-3 py-2 font-semibold">
                                                                {label}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {charts.correlation_heatmap.matrix.map((row, rowIndex) => (
                                                        <tr key={rowIndex} className="border-t border-white/10">
                                                            <td className="px-3 py-2 font-semibold text-slate-300">{charts.correlation_heatmap.labels[rowIndex]}</td>
                                                            {row.map((cell, colIndex) => (
                                                                <td key={`${rowIndex}-${colIndex}`} className="px-3 py-2 text-slate-300">
                                                                    {cell.toFixed(3)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <TrendingUp className="h-5 w-5 text-cyan-200" />
                                    <h3 className="text-xl font-semibold text-white">Key Findings</h3>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {result.metrics && (
                                        <>
                                            <div className="rounded-2xl bg-white/5 p-4">
                                                <p className="text-sm text-slate-400">Sales Column</p>
                                                <p className="mt-2 text-lg font-semibold text-white">{result.metrics.sales_column}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white/5 p-4">
                                                <p className="text-sm text-slate-400">Date Column</p>
                                                <p className="mt-2 text-lg font-semibold text-white">{result.metrics.date_column}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white/5 p-4">
                                                <p className="text-sm text-slate-400">Product Column</p>
                                                <p className="mt-2 text-lg font-semibold text-white">{result.metrics.product_column}</p>
                                            </div>
                                            <div className="rounded-2xl bg-white/5 p-4">
                                                <p className="text-sm text-slate-400">Category Column</p>
                                                <p className="mt-2 text-lg font-semibold text-white">{result.metrics.category_column}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <Search className="h-5 w-5 text-indigo-200" />
                                    <h3 className="text-xl font-semibold text-white">Recommendations</h3>
                                </div>
                                <div className="rounded-2xl bg-white/5 p-4 text-slate-300">
                                    <p className="whitespace-pre-line leading-7">{result.recommendations || 'No recommendations available yet.'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default App;
