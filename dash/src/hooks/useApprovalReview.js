import { approvalsApi } from "@/api";
import { useApiMutation } from "./useApiResource";

/**
 * The three client review actions, each as its own mutation with its own
 * idle/submitting/success/error state — a card can be approving while a
 * sibling card is mid "request changes" without them fighting over one flag.
 *
 * Feedback is required by the backend for anything other than approve
 * (ReviewApprovalDto.feedback is validated server-side); the UI enforces the
 * same rule before it ever calls out.
 */
export function useApprovalReview(approvalId, { onSuccess } = {}) {
  const approveMutation = useApiMutation(
    (feedback) => approvalsApi.approve(approvalId, feedback || undefined),
    { onSuccess },
  );
  const changesMutation = useApiMutation(
    (feedback) => approvalsApi.requestChanges(approvalId, feedback),
    { onSuccess },
  );
  const rejectMutation = useApiMutation(
    (feedback) => approvalsApi.reject(approvalId, feedback),
    { onSuccess },
  );

  return {
    approve: approveMutation.mutate,
    requestChanges: changesMutation.mutate,
    reject: rejectMutation.mutate,
    isApproving: approveMutation.isSubmitting,
    isRequestingChanges: changesMutation.isSubmitting,
    isRejecting: rejectMutation.isSubmitting,
    isBusy:
      approveMutation.isSubmitting || changesMutation.isSubmitting || rejectMutation.isSubmitting,
    error: approveMutation.error || changesMutation.error || rejectMutation.error,
  };
}
