import { TravellerFlows } from '@/features/demand/pages/flows';
import { FlowsIndexPage } from '@/features/supply/pages/flows';

export default function Page() {
  return <FlowsIndexPage extra={<TravellerFlows />} />;
}
