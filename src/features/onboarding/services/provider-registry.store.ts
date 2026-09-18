import { ProviderProfileDto } from '../dto';

export type StoredProfile = ProviderProfileDto & { reference: string };

/** Backing store for the stand-in registry. Dies with the process, like everything else here. */
class ProviderRegistryStore {
  private readonly profiles: StoredProfile[] = [];

  add(profile: StoredProfile): void {
    this.profiles.push(profile);
  }

  list(): readonly StoredProfile[] {
    return this.profiles;
  }
}

const globalScope = globalThis as { __providerRegistryStore?: ProviderRegistryStore };

export const providerRegistryStore = (globalScope.__providerRegistryStore ??= new ProviderRegistryStore());
