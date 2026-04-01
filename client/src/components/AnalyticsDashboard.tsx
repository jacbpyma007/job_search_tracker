import { ApplicationStats, AppState } from '@/types';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { getStatusLabel } from '@/lib/analytics';

interface AnalyticsDashboardProps {
  stats: ApplicationStats;
  state: AppState;
}

const COLORS = ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#EF4444', '#6B7280'];

export default function AnalyticsDashboard({
  stats,
  state,
}: AnalyticsDashboardProps) {
  // Prepare data for status chart
  const statusData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: getStatusLabel(status as any),
    value: count,
  }));

  // Prepare data for profile chart
  const profileData = Object.entries(stats.byProfile).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  // Prepare timeline data (applications over time)
  const timelineData = state.applications
    .sort((a, b) => new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime())
    .reduce((acc: any[], app) => {
      const date = new Date(app.appliedDate).toLocaleDateString();
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.count += 1;
        existing.cumulative = (acc[acc.length - 1]?.cumulative || 0) + 1;
      } else {
        acc.push({
          date,
          count: 1,
          cumulative: (acc[acc.length - 1]?.cumulative || 0) + 1,
        });
      }
      return acc;
    }, []);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-subtle p-6">
          <p className="text-muted-foreground text-sm font-medium">Total Applications</p>
          <p className="text-4xl font-bold text-foreground mt-3">{stats.total}</p>
        </Card>

        <Card className="card-subtle p-6">
          <p className="text-muted-foreground text-sm font-medium">Success Rate</p>
          <p className="text-4xl font-bold text-foreground mt-3">
            {stats.successRate ? `${stats.successRate.toFixed(1)}%` : 'N/A'}
          </p>
        </Card>

        <Card className="card-subtle p-6">
          <p className="text-muted-foreground text-sm font-medium">Avg Days to Response</p>
          <p className="text-4xl font-bold text-foreground mt-3">
            {stats.averageDaysToResponse || 'N/A'}
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card className="card-subtle p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Applications by Status</h3>
          {statusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#3B82F6"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data yet
            </div>
          )}
        </Card>

        {/* Profile Distribution */}
        <Card className="card-subtle p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Applications by Profile</h3>
          {profileData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profileData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#CBD5E1" />
                <YAxis stroke="#CBD5E1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A2744',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data yet
            </div>
          )}
        </Card>
      </div>

      {/* Timeline */}
      {timelineData.length > 0 && (
        <Card className="card-subtle p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#CBD5E1" />
              <YAxis stroke="#CBD5E1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A2744',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Cumulative Applications"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Status Breakdown Table */}
      <Card className="card-subtle p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Status Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">Count</th>
                <th className="text-right py-2 px-4 text-muted-foreground font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {statusData.map((row) => (
                <tr key={row.name} className="border-b border-border hover:bg-background/50">
                  <td className="py-3 px-4 text-foreground">{row.name}</td>
                  <td className="text-right py-3 px-4 text-foreground font-medium">{row.value}</td>
                  <td className="text-right py-3 px-4 text-muted-foreground">
                    {stats.total > 0 ? ((row.value / stats.total) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
