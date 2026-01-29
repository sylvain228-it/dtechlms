// types/SkillJson.ts

import { SkillType } from '@/lib/type';
import { Domaine } from './course';

export interface SkillJsonBase {
    id: string; // identifiant stable (UUID ou code)
    label: string; // texte affiché
    description?: string;
    level?: number; // niveau attendu / observé
    order?: number; // ordre d’affichage
}

export interface LearningOutcome extends SkillJsonBase {
    taxonomy?:
        | 'remember'
        | 'understand'
        | 'apply'
        | 'analyze'
        | 'evaluate'
        | 'create';
}

export interface SkillIndicator extends SkillJsonBase {
    measurable?: boolean;
    weight?: number; // pondération dans l’évaluation
}

export interface SkillContext extends SkillJsonBase {
    environment?: 'academic' | 'professional' | 'simulation';
}

export interface Skill {
    id: number;

    // Identification
    code: string;
    name: string;
    description?: string;

    // Structuration
    domaine_id?: number;
    sub_domaine_id?: number;
    type: SkillType;

    // Niveau
    level_min?: number;
    level_max?: number;
    framework?: string;

    // JSON fields (interfaces dédiées)
    learning_outcomes: LearningOutcome[];
    indicators: SkillIndicator[];
    contexts: SkillContext[];

    // Gouvernance
    is_active: boolean;
    is_certifiable: boolean;

    // Versioning
    version: number;
    parent_id?: number;

    domaine?: Domaine;
    subdomaine?: Domaine;
    // Meta
    language: string;
    source?: string;
    created_at?: string | null;
    updated_at?: string | null;
}
