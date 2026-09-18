import { CaptureScreen } from '../../components';
import { HOST_ROUTES } from '../../constants';

const DOCUMENT_STEP = 2;
const SELFIE_STEP = 3;

export const DocumentPhotoPage = () => (
  <CaptureScreen kind="document" step={DOCUMENT_STEP} backHref={HOST_ROUTES.verify.document} nextHref={HOST_ROUTES.verify.selfie} />
);

export const SelfiePage = () => (
  <CaptureScreen kind="selfie" step={SELFIE_STEP} backHref={HOST_ROUTES.verify.documentPhoto} nextHref={HOST_ROUTES.verify.checking} />
);
