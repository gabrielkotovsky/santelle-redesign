import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    TestSession,
    createSession as apiCreate,
    fetchOpenSession as apiFetchOpen,
    fetchSessionById as apiFetchById,
    setStep as apiSetStep,
    setPhResultsReadyAt as apiSetPhResults,
    setResultsReadyAt as apiSetResults,
    completeSession as apiComplete,
    abortSession as apiAbort,
    upsertResults as apiUpsertResults,
} from "./testSession.api";

type SessionUI = Pick<TestSession, "id" | "current_step" | "status" | "ph_result_ready_at" | "results_ready_at">;

type State = {
    session?: SessionUI;
    loading: boolean;
    error?: string;
    hydrateFromServer: () => Promise<void>;
    startSession: () => Promise<void>;
    /** Put a (possibly completed) session in local state so results can be re-edited. */
    loadSessionForEdit: (sessionId: string) => Promise<void>;
    setStep: (step: number) => Promise<void>;
    setPhResultsReadyAt: (iso: string) => Promise<void>;
    setResultsReadyAt: (iso: string) => Promise<void>;
    complete: () => Promise<void>;
    abort: (reason?: string) => Promise<void>;
    upsertResults: (patch: Record<string, any>) => Promise<void>;
    resetLocal: () => void;
  };
  
export const useTestSession = create<State>()(
    persist(
      (set, get) => ({
        session: undefined,
        loading: false,
        error: undefined,
  
        hydrateFromServer: async () => {
          set({ loading: true, error: undefined });
          try {
            const s = await apiFetchOpen();
            if (s) {
              set({ session: { 
                id: s.id, 
                current_step: s.current_step, 
                status: s.status, 
                results_ready_at: s.results_ready_at,
                ph_result_ready_at: s.ph_result_ready_at } });
            } else {
              set({ session: undefined });
            }
          } catch (e: any) {
            set({ error: e.message ?? "Failed to hydrate session" });
          } finally {
            set({ loading: false });
          }
        },
  
        startSession: async () => {
          set({ loading: true, error: undefined });
          try {
            const s = await apiCreate();
            set({ session: { 
              id: s.id, 
              current_step: s.current_step, 
              status: s.status,
              ph_result_ready_at: s.ph_result_ready_at,
              results_ready_at: s.results_ready_at } });
          } catch (e: any) {
            set({ error: e.message ?? "Failed to start session" });
          } finally {
            set({ loading: false });
          }
        },

        loadSessionForEdit: async (sessionId: string) => {
          set({ loading: true, error: undefined });
          try {
            const s = await apiFetchById(sessionId);
            if (!s) throw new Error("Session not found");
            // Ensure timers are expired so pH/marker selectors show immediately.
            const past = new Date(Date.now() - 1000).toISOString();
            set({
              session: {
                id: s.id,
                current_step: 5,
                status: s.status,
                ph_result_ready_at: s.ph_result_ready_at && new Date(s.ph_result_ready_at).getTime() <= Date.now()
                  ? s.ph_result_ready_at
                  : past,
                results_ready_at: s.results_ready_at && new Date(s.results_ready_at).getTime() <= Date.now()
                  ? s.results_ready_at
                  : past,
              },
            });
          } catch (e: any) {
            set({ error: e.message ?? "Failed to load session for edit" });
            throw e;
          } finally {
            set({ loading: false });
          }
        },
  
        setStep: async (step: number) => {
          const s = get().session;
          if (!s) return;
          // optimistic
          set({ session: { ...s, current_step: step } });
          try {
            const updated = await apiSetStep(s.id, step);
            set({
              session: {
                id: updated.id,
                current_step: updated.current_step,
                status: updated.status,
                results_ready_at: updated.results_ready_at,
                ph_result_ready_at: updated.ph_result_ready_at,
              },
            });
          } catch (e: any) {
            // rollback (fetch server truth)
            await get().hydrateFromServer();
            set({ error: e.message ?? "Failed to update step" });
          }
        },
  
        setResultsReadyAt: async (iso: string) => {
          const s = get().session;
          if (!s) return;
          // optimistic
          set({ session: { ...s, results_ready_at: iso } });
          try {
            const updated = await apiSetResults(s.id, iso);
            set({
              session: {
                id: updated.id,
                current_step: updated.current_step,
                status: updated.status,
                results_ready_at: updated.results_ready_at,
                ph_result_ready_at: updated.ph_result_ready_at,
              },
            });
          } catch (e: any) {
            await get().hydrateFromServer();
            set({ error: e.message ?? "Failed to set results time" });
          }
        },

        setPhResultsReadyAt: async (iso: string) => {
          const s = get().session;
          if (!s) return;
          // optimistic
          set({ session: { ...s, ph_result_ready_at: iso } });
          try {
            const updated = await apiSetPhResults(s.id, iso);
            set({
              session: {
                id: updated.id,
                current_step: updated.current_step,
                status: updated.status,
                results_ready_at: updated.results_ready_at,
                ph_result_ready_at: updated.ph_result_ready_at,
              },
            });
          } catch (e: any) {
            await get().hydrateFromServer();
            set({ error: e.message ?? "Failed to set pH results time" });
          }
        },
  
        complete: async () => {
          const s = get().session;
          if (!s) return;
          try {
            const updated = await apiComplete(s.id);
            set({
              session: {
                id: updated.id,
                current_step: updated.current_step,
                status: updated.status,
                results_ready_at: updated.results_ready_at,
                ph_result_ready_at: updated.ph_result_ready_at,
              },
            });
          } catch (e: any) {
            set({ error: e.message ?? "Failed to complete session" });
          }
        },
  
        abort: async () => {
          const s = get().session;
          if (!s) return;
          try {
            await apiAbort(s.id);
            set({ session: undefined });
          } catch (e: any) {
            set({ error: e.message ?? "Failed to abort session" });
          }
        },
  
        upsertResults: async (patch) => {
          const s = get().session;
          if (!s) return;
          try {
            await apiUpsertResults(s.id, patch);
          } catch (e: any) {
            set({ error: e.message ?? "Failed to save results" });
          }
        },
  
        resetLocal: () => set({ session: undefined, error: undefined }),
      }),
      { name: "santelle-test-session", storage: createJSONStorage(() => AsyncStorage) }
    )
  );