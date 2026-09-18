/** What a back-office form gets back: nothing when the change landed, one sentence when it did not. */
export interface AdminFormState {
  error?: string;
}

export type AdminFormAction = (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
