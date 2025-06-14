import { Separator } from '@/components/ui/separator';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { NotificationCard } from '@/components/settings/NotificationCard';
import { PasswordCard } from '@/components/settings/PasswordCard';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold md:text-3xl">Account Settings</h1>

      <ProfileCard />

      <Separator />

      <NotificationCard />

      <Separator />

      <PasswordCard />
    </div>
  );
}
