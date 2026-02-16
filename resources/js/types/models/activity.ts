import { CriterionType, SaveStatus } from '@/lib/type';
import { CourseActivity } from './course';

export interface GradingScale {
    id: number;
    name: string;
    max_score: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface GradingScaleRange {
    id?: number;
    grading_scale_id: number;
    letter: string;
    min_score: number;
    max_score: number;
    gpa_value?: number;
    mention?: string;
    color?: string;
    position?: number;
    grading_scale?: GradingScale;
    created_at: string;
    updated_at: string;
}

export interface Rubric {
    id: number;
    title: string;
    description?: string;
    status: SaveStatus;
    version?: number;
    parent_rubric_id?: number;
    created_at: string;
    updated_at: string;
}

export interface RubricCriteria {
    id: number;
    rubric_id: number;
    title: string;
    description?: string;
    weight: number;
    position?: number;
    rubric?: Rubric;
    created_at: string;
    updated_at: string;
}
export interface RubricPerformanceLevel {
    id: number;
    rubric_criteria_id: number;
    label: string;
    description?: string;
    score_value?: number;
    min_score?: number;
    max_score?: number;
    is_passing?: boolean;
    position?: number;
    color?: string;
    rubric_criteria?: RubricCriteria;
    created_at: string;
    updated_at: string;
}

export interface EvaluationCriteria {
    id: number;
    activity_id: number;
    skill_id?: number;
    title: string;
    slug: string;
    description?: string;
    position?: number;
    weight: number;
    max_score?: number;
    success_threshold?: number;
    is_mandatory?: boolean;
    criterion_type: CriterionType;
    evaluation_method: 'points' | 'rubric' | 'pass_fail';
    status: SaveStatus;
    version?: number;
    parent_criteria_id?: number;
    activity?: CourseActivity;
    created_at: string;
    updated_at: string;
}

export interface FeedbackGuideline {
    id: number;
    title: string;
    content: string;
    type: 'positive' | 'improvement' | 'warning' | 'general';
    criterion_type?: CriterionType;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
}

export interface CriterionFeedbackGuideline {
    id: number;
    evaluation_criteria_id: number;
    feedback_guideline_id: number;
    evaluation_criteria?: EvaluationCriteria;
}
