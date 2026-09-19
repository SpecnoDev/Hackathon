import { DEMO_MODE_ON } from '@/core/constants';
import { Button, StatusPill } from '@/shared/components';
import { setDemoModeAction } from '../actions';
import { ADMIN_SHELL_COPY, DEMO_MODE_FIELD } from '../constants';

const COPY = ADMIN_SHELL_COPY.demo;

/** The pitch switch. It flips a cookie in this browser, so the state shown is the state of this device. */
export const DemoModeToggle = ({ enabled }: { enabled: boolean }) => (
  <form action={setDemoModeAction} className="flex flex-col gap-2 border-t border-hairline px-3 pt-4">
    <div className="flex items-center justify-between gap-2">
      <span className="text-caption text-ink">{COPY.title}</span>
      <StatusPill density="traveller" tone={enabled ? 'live' : 'draft'} label={enabled ? COPY.on : COPY.off} />
    </div>
    <p className="text-caption text-muted">{COPY.note}</p>
    <input type="hidden" name={DEMO_MODE_FIELD} value={enabled ? '' : DEMO_MODE_ON} />
    <Button type="submit" variant={enabled ? 'secondary' : 'primary'} size="md">
      {enabled ? COPY.turnOff : COPY.turnOn}
    </Button>
  </form>
);
