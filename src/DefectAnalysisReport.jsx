// DefectAnalysisReport.jsx
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer, Legend } from "recharts";
import { useReactToPrint } from "react-to-print";

// Mock defect data (replace with API data as needed)
const mockDefects = [
  {
    id: "D-101",
    title: "Null pointer exception in Auth module",
    description: "App crashes on login due to null pointer.",
    severity: "Critical",
    status: "Resolved",
    rootCause: "Uninitialized variable",
    createdAt: "2025-08-01T10:00:00Z",
    resolvedAt: "2025-08-02T12:00:00Z",
    module: "Auth"
  },
  {
    id: "D-102",
    title: "UI misalignment in Dashboard",
    description: "Widgets overlap on smaller screens.",
    severity: "Medium",
    status: "Open",
    rootCause: "CSS issue",
    createdAt: "2025-08-03T09:00:00Z",
    resolvedAt: null,
    module: "Dashboard"
  },
  {
    id: "D-103",
    title: "Slow API response in Reports",
    description: "Report generation takes >10s.",
    severity: "High",
    status: "Resolved",
    rootCause: "Inefficient query",
    createdAt: "2025-08-02T14:00:00Z",
    resolvedAt: "2025-08-05T16:00:00Z",
    module: "Reports"
  },
  {
    id: "D-104",
    title: "Memory leak in Auth module",
    description: "Memory usage increases over time.",
    severity: "Critical",
    status: "Resolved",
    rootCause: "Unreleased resources",
    createdAt: "2025-08-04T11:00:00Z",
    resolvedAt: "2025-08-06T13:00:00Z",
    module: "Auth"
  },
  {
    id: "D-105",
    title: "Incorrect calculation in Billing",
    description: "Totals are off by 1 cent.",
    severity: "Low",
    status: "Resolved",
    rootCause: "Rounding error",
    createdAt: "2025-08-05T08:00:00Z",
    resolvedAt: "2025-08-07T10:00:00Z",
    module: "Billing"
  },
  // Add more defects as needed
];

// Severity colors for charts
const SEVERITY_COLORS = {
  Critical: "#EF4444",
  High: "#F59E42",
  Medium: "#3B82F6",
  Low: "#10B981"
};

// Spinner component for loading state
const Spinner = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

const DefectAnalysisReport = ({
  data = mockDefects,
  requestId = "REQ-001",
  timestamp = new Date().toISOString(),
  loading = false
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  // PDF export ref
  const reportRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: "DefectAnalysisReport"
  });

  // Analysis logic
  const analysis = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Log step: Group by severity
    const severityCounts = data.reduce((acc, defect) => {
      acc[defect.severity] = (acc[defect.severity] || 0) + 1;
      return acc;
    }, {});
    console.log("Severity distribution:", severityCounts);

    // Log step: Group by root cause
    const rootCauseCounts = data.reduce((acc, defect) => {
      acc[defect.rootCause] = (acc[defect.rootCause] || 0) + 1;
      return acc;
    }, {});
    console.log("Root cause frequency:", rootCauseCounts);

    // Log step: Group by module
    const moduleCounts = data.reduce((acc, defect) => {
      acc[defect.module] = (acc[defect.module] || 0) + 1;
      return acc;
    }, {});
    console.log("Module defect counts:", moduleCounts);

    // Log step: Calculate resolution times
    const resolvedDefects = data.filter(d => d.status === "Resolved" && d.resolvedAt);
    const resolutionTimes = resolvedDefects.map(d => {
      const created = new Date(d.createdAt);
      const resolved = new Date(d.resolvedAt);
      return (resolved - created) / (1000 * 60 * 60); // hours
    });
    const avgResolutionTime =
      resolutionTimes.length > 0
        ? (resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length).toFixed(2)
        : "N/A";
    console.log("Average resolution time (hrs):", avgResolutionTime);

    // Log step: Overdue tickets (open > 72h)
    const now = new Date();
    const overdueTickets = data.filter(
      d =>
        d.status !== "Resolved" &&
        ((now - new Date(d.createdAt)) / (1000 * 60 * 60)) > 72
    );
    console.log("Overdue tickets:", overdueTickets);

    // Log step: Top recurring issues/root causes
    const topRootCauses = Object.entries(rootCauseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cause, count]) => ({ cause, count }));

    // Log step: Top modules with defects
    const topModules = Object.entries(moduleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([module, count]) => ({ module, count }));

    // Recommendations
    const recommendations = [
      ...topModules.map(
        m => `Improve testing coverage in ${m.module} (high defect count)`
      ),
      ...topRootCauses.map(
        r => `Refactor code to address recurring root cause: ${r.cause}`
      ),
      "Monitor overdue tickets and prioritize resolution.",
      "Automate regression tests for critical modules."
    ];

    // KPIs to monitor
    const kpis = [
      "Defect resolution time (avg, max)",
      "Open vs resolved defect ratio",
      "Severity distribution trends",
      "Root cause recurrence",
      "Overdue ticket count"
    ];

    // Prepare chart data
    const severityChartData = Object.keys(SEVERITY_COLORS).map(sev => ({
      name: sev,
      value: severityCounts[sev] || 0
    }));

    const rootCauseChartData = Object.entries(rootCauseCounts).map(
      ([cause, count]) => ({ cause, count })
    );

    const resolutionTrendData = resolvedDefects.map(d => ({
      id: d.id,
      module: d.module,
      resolutionTime:
        ((new Date(d.resolvedAt) - new Date(d.createdAt)) / (1000 * 60 * 60)).toFixed(2),
      severity: d.severity
    }));

    return {
      totalDefects: data.length,
      openDefects: data.filter(d => d.status !== "Resolved").length,
      resolvedDefects: resolvedDefects.length,
      avgResolutionTime,
      severityChartData,
      rootCauseChartData,
      resolutionTrendData,
      topRootCauses,
      topModules,
      recommendations,
      kpis,
      overdueTickets
    };
  }, [data]);

  // Loading state
  if (isLoading) return <Spinner />;
  if (!data || data.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-gray-500 text-lg font-semibold mb-2">No defects available</div>
        <div className="text-gray-400">Please check your data source or try again later.</div>
      </div>
    );

  // Executive summary layout
  return (
    <div ref={reportRef} className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Defect Analysis Report</h1>
          <div className="text-sm text-gray-500">Request ID: {requestId} | Generated: {new Date(timestamp).toLocaleString()}</div>
        </div>
        <button
          onClick={handlePrint}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
        >
          Export to PDF
        </button>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Overview */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-500 mb-4">Summary of defect status and resolution performance.</p>
          <ul className="mb-2">
            <li>Total defects: <span className="font-bold">{analysis.totalDefects}</span></li>
            <li>Open defects: <span className="font-bold text-red-500">{analysis.openDefects}</span></li>
            <li>Resolved defects: <span className="font-bold text-green-600">{analysis.resolvedDefects}</span></li>
            <li>Avg. resolution time: <span className="font-bold">{analysis.avgResolutionTime} hrs</span></li>
            <li>Overdue tickets: <span className="font-bold text-yellow-600">{analysis.overdueTickets.length}</span></li>
          </ul>
        </div>

        {/* Section 2: Severity Distribution */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Severity Distribution</h2>
          <p className="text-gray-500 mb-4">Defects grouped by severity level.</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analysis.severityChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {analysis.severityChartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={SEVERITY_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            {analysis.severityChartData.map(s => (
              <span key={s.name} className="mr-4">
                <span className="font-bold" style={{ color: SEVERITY_COLORS[s.name] }}>{s.name}</span>: {s.value}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Root Cause Analysis */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Root Cause Analysis</h2>
          <p className="text-gray-500 mb-4">Top recurring root causes and their frequency.</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={analysis.rootCauseChartData}
              layout="vertical"
              margin={{ left: 40, right: 20, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="cause" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" barSize={24} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm text-gray-600">
            Top causes: {analysis.topRootCauses.map(c => `${c.cause} (${c.count})`).join(", ")}
          </div>
        </div>

        {/* Section 4: Resolution Time Trends */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Resolution Time Trends</h2>
          <p className="text-gray-500 mb-4">How quickly defects are resolved over time.</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analysis.resolutionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="resolutionTime" stroke="#10B981" name="Resolution Time (hrs)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Section 5: Recommendations & Monitoring */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
          <p className="text-gray-500 mb-4">Actionable improvement points based on analysis.</p>
          <ul className="list-disc ml-6 text-gray-700">
            {analysis.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-2">Monitoring KPIs</h2>
          <p className="text-gray-500 mb-4">Suggested metrics to track for continuous improvement.</p>
          <ul className="list-disc ml-6 text-gray-700">
            {analysis.kpis.map((kpi, idx) => (
              <li key={idx}>{kpi}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// PropTypes for reusability
DefectAnalysisReport.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      severity: PropTypes.oneOf(["Critical", "High", "Medium", "Low"]).isRequired,
      status: PropTypes.string.isRequired,
      rootCause: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      resolvedAt: PropTypes.string,
      module: PropTypes.string
    })
  ),
  requestId: PropTypes.string,
  timestamp: PropTypes.string,
  loading: PropTypes.bool
};

export default DefectAnalysisReport;

/*
Design Notes:
- Uses useMemo for efficient analysis and chart data preparation.
- All analysis steps are logged to the console for debugging.
- Responsive grid layout with TailwindCSS for executive dashboard look.
- Export-to-PDF via react-to-print for reliability and styling.
- Error and loading states are handled gracefully.
- Component is reusable and accepts props for data, requestId, timestamp, and loading.
- Replace mockDefects with API data for real integration.
*/
