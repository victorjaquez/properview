import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function NotificationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how you receive notifications from ProperView.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="newInquiryEmail" className="font-medium">
              New Inquiry Emails
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive an email for every new inquiry.
            </p>
          </div>
          <Switch id="newInquiryEmail" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="weeklySummary" className="font-medium">
              Weekly Performance Summary
            </Label>
            <p className="text-sm text-muted-foreground">
              Get a weekly email with your listing performance.
            </p>
          </div>
          <Switch id="weeklySummary" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="platformUpdates" className="font-medium">
              Platform Updates
            </Label>
            <p className="text-sm text-muted-foreground">
              Stay informed about new features and updates.
            </p>
          </div>
          <Switch id="platformUpdates" defaultChecked />
        </div>
        <Button>Save Notifications</Button>
      </CardContent>
    </Card>
  );
}
