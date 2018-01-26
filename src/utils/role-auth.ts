import RenderAuthorized from '@/components/common/Authorized';
import { stores } from '@/models';

export let Authorized = RenderAuthorized('');

export function reloadAuthorized(current: string) {
  Authorized = RenderAuthorized(current);
}
