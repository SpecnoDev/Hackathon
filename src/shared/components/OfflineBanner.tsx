import { Icon } from './Icon';

const OFFLINE_ICON_PX = 20;

export const OfflineBanner = ({ message }: { message: string }) => (
  <div role="status" className="flex min-h-11 items-center gap-3 bg-accent-tint px-4 py-3 text-caption text-ink">
    <Icon name="cloud-off" size={OFFLINE_ICON_PX} className="shrink-0" />
    <p>{message}</p>
  </div>
);
