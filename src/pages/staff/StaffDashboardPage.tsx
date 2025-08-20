import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useTickets } from '../../hooks/useTickets';
import { MetricCard } from '../../visuals/MetricCard';
import { RadialGauge } from '../../visuals/RadialGauge';
import { GlowCard } from '../../visuals/GlowCard';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Ticket,
  Users
} from 'lucide-react';

export function StaffDashboardPage() {
  const { data: allTickets = [] } = useTickets();

  const stats = React.useMemo(() => {
    const total = allTickets.length;
    const open = allTickets.filter(t => t.status === 'open').length;
    const inProgress = allTickets.filter(t => t.status === 'in_progress').length;
    const resolved = allTickets.filter(t => t.status === 'resolved').length;
    const closed = allTickets.filter(t => t.status === 'closed').length;
    
    const urgent = allTickets.filter(t => t.priority === 'urgent').length;
    const high = allTickets.filter(t => t.priority === 'high').length;
    
    const unassigned = allTickets.filter(t => !t.assignedStaffId).length;
    
    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
      high,
      unassigned,
    };
  }, [allTickets]);

  // Generate mock trend data
  const trendData = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      tickets: Math.floor(Math.random() * 20) + 5,
      resolved: Math.floor(Math.random() * 15) + 3,
    }));
  }, []);

  const categoryData = React.useMemo(() => [
    { name: 'Technical', value: 45, color: 'var(--brand)' },
    { name: 'Billing', value: 30, color: 'var(--brand-2)' },
    { name: 'General', value: 25, color: 'var(--info)' },
  ], []);

  const priorityData = React.useMemo(() => [
    { name: 'Low', value: 12 },
    { name: 'Medium', value: 8 },
    { name: 'High', value: 5 },
    { name: 'Urgent', value: 2 },
  ], []);

  const sparklineData = React.useMemo(() => 
    Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 100) + 20 }))
  , []);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-ink to-ink-2 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted mt-2 text-lg">Real-time overview of your support system</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <MetricCard
          title="Total Tickets"
          value={stats.total}
          delta={{ value: 12, isPositive: true }}
          sparklineData={sparklineData}
          icon={<Ticket className="h-6 w-6" />}
        />
        
        <MetricCard
          title="Open Tickets"
          value={stats.open}
          delta={{ value: 5, isPositive: false }}
          sparklineData={sparklineData}
          icon={<Clock className="h-6 w-6" />}
        />
        
        <MetricCard
          title="In Progress"
          value={stats.inProgress}
          delta={{ value: 8, isPositive: true }}
          sparklineData={sparklineData}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        
        <MetricCard
          title="Resolved (7d)"
          value={stats.resolved}
          delta={{ value: 15, isPositive: true }}
          sparklineData={sparklineData}
          icon={<CheckCircle className="h-6 w-6" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlowCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-ink">Ticket Trends</h3>
                <p className="text-muted">7-day overview</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-brand" />
                  <span className="text-sm text-muted">Created</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-brand-2" />
                  <span className="text-sm text-muted">Resolved</span>
                </div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-2)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--brand-2)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--panel)', 
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(12px)'
                    }} 
                  />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="var(--brand)"
                    fillOpacity={1}
                    fill="url(#ticketsGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="var(--brand-2)"
                    fillOpacity={1}
                    fill="url(#resolvedGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </motion.div>

        {/* SLA Gauge */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlowCard className="p-6 text-center">
            <h3 className="text-lg font-semibold text-ink mb-6">SLA Performance</h3>
            <div className="flex justify-center mb-6">
              <RadialGauge value={87} label="SLA" size="lg" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Avg Response</span>
                <span className="text-sm font-medium text-ink">2.4h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Avg Resolution</span>
                <span className="text-sm font-medium text-ink">18.2h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted">Customer Satisfaction</span>
                <span className="text-sm font-medium text-ok">94%</span>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlowCard className="p-6">
            <h3 className="text-lg font-semibold text-ink mb-6">Tickets by Category</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted">{item.name}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlowCard className="p-6">
            <h3 className="text-lg font-semibold text-ink mb-6">Priority Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="horizontal">
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--panel)', 
                      border: '1px solid var(--border)',
                      borderRadius: '12px' 
                    }} 
                  />
                  <Bar 
                    dataKey="value" 
                    fill="var(--brand)" 
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Critical Issues</span>
                </div>
                <span className="text-lg font-bold text-red-500">{stats.urgent + stats.high}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted" />
                  <span className="text-sm font-medium">Unassigned</span>
                </div>
                <span className="text-lg font-bold text-warn">{stats.unassigned}</span>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </motion.div>
  );
}

                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
              
              {recentTickets.length === 0 && (
                <p className="text-center text-muted">No tickets found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}