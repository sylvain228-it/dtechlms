import { ActivityType } from '@/lib/type';

type ActivityRules = {
    canBeEvaluated: boolean;
    canHaveDeliverable: boolean;
    canRequestFeedback: boolean;
    allowGroupWork: boolean;
    requiresSynchronous?: boolean;
};

export const ACTIVITY_RULES: Record<ActivityType, ActivityRules> = {
    lecture: {
        canBeEvaluated: false,
        canHaveDeliverable: false,
        canRequestFeedback: false,
        allowGroupWork: false,
    },
    discussion: {
        canBeEvaluated: false,
        canHaveDeliverable: false,
        canRequestFeedback: true,
        allowGroupWork: true,
    },
    quiz: {
        canBeEvaluated: true,
        canHaveDeliverable: false,
        canRequestFeedback: false,
        allowGroupWork: false,
    },
    exercise: {
        canBeEvaluated: true,
        canHaveDeliverable: true,
        canRequestFeedback: true,
        allowGroupWork: true,
    },
    project: {
        canBeEvaluated: true,
        canHaveDeliverable: true,
        canRequestFeedback: true,
        allowGroupWork: true,
    },
    assessment: {
        canBeEvaluated: true,
        canHaveDeliverable: true,
        canRequestFeedback: true,
        allowGroupWork: true,
    },
};
