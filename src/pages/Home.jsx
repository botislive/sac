import { Link } from "react-router-dom"
import { useAtom } from "jotai"
import { eventsAtom } from "../atoms/userAtom"
import { sacMemAtom } from "../atoms/userAtom"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function Home() {
  const [events] = useAtom(eventsAtom)
  const [members] = useAtom(sacMemAtom)

  const stats = [
    { label: 'Total Events', value: events.length || 0, color: 'from-blue-500 to-indigo-600' },
    { label: 'Upcoming Events', value: events.filter(e => !e.is_complete).length || 0, color: 'from-indigo-500 to-purple-600' },
    { label: 'Completed Events', value: events.filter(e => e.is_complete).length || 0, color: 'from-emerald-500 to-teal-600' },
    { label: 'Active Members', value: members.length || 0, color: 'from-orange-500 to-red-600' },
  ]

  const clubDistribution = events.reduce((acc, event) => {
    acc[event.club_name] = (acc[event.club_name] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(clubDistribution).map(key => ({
    name: key,
    value: clubDistribution[key]
  }));

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back to the SAC Event Log Book.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 hover:gap-6 transition-all duration-300">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</p>
                <p className={`text-4xl font-bold mt-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-white mb-6">Events by Club</h2>
        <div className="h-64 w-full">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">No events data available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Members</h2>
            <Link to="/members" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All &rarr;</Link>
          </div>
          <div className="space-y-4">
            {members.slice(0, 3).map((member, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 flex justify-between items-center hover:bg-gray-800 transition-colors">
                <div>
                  <h3 className="text-white font-medium">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.post}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{member.branch || 'N/A'}</span>
              </div>
            ))}
            {members.length === 0 && <p className="text-gray-500 text-center py-4">No members registered yet.</p>}
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
            <Link to="/events" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All &rarr;</Link>
          </div>
          <div className="space-y-4">
            {events.filter(e => !e.is_complete).slice(0, 3).map((event, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 flex flex-col hover:bg-gray-800 transition-colors">
                <h3 className="text-white font-medium">{event.event_title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-400">{event.club_name}</p>
                  <span className="text-xs text-indigo-400 font-medium bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{event.date}</span>
                </div>
              </div>
            ))}
            {events.filter(e => !e.is_complete).length === 0 && <p className="text-gray-500 text-center py-4">No upcoming events.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home