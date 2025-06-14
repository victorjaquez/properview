import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DailyActivityCardProps {
  chartData: any[];
}

interface ActivityMetricProps {
  value: number;
  label: string;
  colorClass: string;
}

function ActivityMetric({ value, label, colorClass }: ActivityMetricProps) {
  return (
    <div className={`${colorClass} rounded p-2 text-center`}>
      <div className="text-sm font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}

interface DayColumnProps {
  day: any;
}

function DayColumn({ day }: DayColumnProps) {
  return (
    <div className="flex flex-col min-w-[80px] sm:min-w-0 flex-shrink-0 sm:flex-shrink">
      <div className="text-xs text-center mb-2 font-medium">
        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
      </div>
      <div className="flex-1 flex flex-col justify-end space-y-1 sm:space-y-1">
        <ActivityMetric
          value={day.views}
          label="views"
          colorClass="bg-blue-100 text-blue-600"
        />
        <ActivityMetric
          value={day.inquiries}
          label="inquiries"
          colorClass="bg-green-100 text-green-600"
        />
        <ActivityMetric
          value={day.uniqueVisitors}
          label="visitors"
          colorClass="bg-purple-100 text-purple-600"
        />
      </div>
      <div className="text-xs text-center mt-2 text-muted-foreground">
        {new Date(day.date).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
        })}
      </div>
    </div>
  );
}

export function DailyActivityCard({ chartData }: DailyActivityCardProps) {
  const recentData = chartData.slice(-7);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Daily Activity Summary
        </CardTitle>
        <CardDescription>
          Breakdown of views and inquiries over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] sm:h-[300px]">
        <div className="flex gap-3 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 h-full sm:grid sm:grid-cols-7 sm:gap-2">
          {recentData.map((day) => (
            <DayColumn key={day.date} day={day} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
