import {
  TrendingUp, Users, HelpCircle, MessageSquare, BarChart3, Clock, Activity, Trophy, ArrowUpRight
} from "lucide-react";
// Import your chart library, e.g., Recharts, Chart.js, or a custom Chart component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnswersTrendChart, QuestionsPerDayChart } from "@/components/chartComponent";
// Assume you have custom Chart components for usage

export default function AnalyticsPage() {
  // These values are placeholders. Fetch your real analytics data with hooks or APIs
  const stats = [
    { icon: Users, label: "Total Users", value: 2340 },
    { icon: HelpCircle, label: "Questions Asked", value: 6804 },
    { icon: MessageSquare, label: "Answers Written", value: 12421 },
    { icon: Trophy, label: "Top Topic", value: "Science" },
  ];


  const topUsers = [
    { name: "Alice Sky", questions: 54, answers: 230 },
    { name: "John Doe", questions: 40, answers: 210 },
    { name: "Minji", questions: 32, answers: 190 },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex gap-3 items-center mb-8">
          <div className="p-2 bg-orange-500 rounded-lg shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-200 to-amber-200">
                  <stat.icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-orange-700">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Chart Card: Active Users Over Time */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <BarChart3 className="text-orange-600 w-5 h-5" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Questions Per Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Replace this with a real chart component */}
              <QuestionsPerDayChart/>
            </CardContent>
          </Card>
          {/* Chart Card: Engagement (e.g. answers trend) */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Activity className="text-orange-600 w-5 h-5" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Answers Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Another chart mockup, replace with line chart */}
              <AnswersTrendChart />
            </CardContent>
          </Card>
        </div>

        {/* Next Section: Top users, popular topics, recent activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Top Users */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Trophy className="text-orange-600 w-5 h-5" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-orange-700">
                    <th className="py-2">User</th>
                    <th>Questions</th>
                    <th>Answers</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-orange-50/80 bg-transparent"
                    >
                      <td className="py-3 font-medium text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-semibold text-sm shadow">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name}
                      </td>
                      <td>{user.questions}</td>
                      <td>{user.answers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          {/* Engagement Panel: Peak Activity/Quick Stats */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Clock className="text-orange-600 w-5 h-5" />
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowUpRight className="text-green-600 w-4 h-4" />
                  <span>Peak activity: <span className="font-semibold text-gray-800">8pm-10pm</span></span>
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="text-blue-600 w-4 h-4" />
                  <span>Most active topic: <span className="font-semibold text-gray-800">Science</span></span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="text-orange-600 w-4 h-4" />
                  <span>New users this week: <span className="font-semibold text-gray-800">124</span></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Feed */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MessageSquare className="text-orange-600 w-5 h-5" />
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-orange-100">
              <li className="py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <span className="font-semibold text-gray-800">Alice Sky</span> answered a question in <span className="text-orange-700">Science</span>
                  <div className="text-xs text-gray-400">2 min ago</div>
                </div>
              </li>
              <li className="py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold">J</div>
                <div>
                  <span className="font-semibold text-gray-800">John Doe</span> asked a question in <span className="text-orange-700">Technology</span>
                  <div className="text-xs text-gray-400">6 min ago</div>
                </div>
              </li>
              {/* ... More items */}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
