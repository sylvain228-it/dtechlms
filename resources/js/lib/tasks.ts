import { textEditorToSession } from '@/routes';
import { router } from '@inertiajs/react';
import React from 'react';
import { loadExistTextHtmlIntoEditor } from './lexical-headless';

export function subStrText(
    text: string,
    start: number,
    end: number,
    elipse?: boolean,
) {
    elipse = elipse ?? true;
    const truncated = text.substring(start, end);
    const hasEllipse = elipse && text.length > end;

    return `${truncated}${hasEllipse ? '...' : ''}`;
}

export async function sendSyllabusToApi(oldId?: number) {
    try {
        const savedStateHtml = localStorage.getItem(
            oldId == 0 ? 'textHtmlContentState' : 'textEditHtmlContentState',
        );
        const params = new URLSearchParams({
            syllabus: savedStateHtml ?? '',
            oldId: `${oldId ?? 0}`,
        });
        const res = await fetch(
            `${textEditorToSession().url}?${params.toString()}`,
            {
                method: 'GET',
                headers: { Accept: 'application/json' },
            },
        );
        if (!res.ok) {
            const text = await res.text();
            console.error(`API error ${res.status}: ${text}`);
        } else {
            console.log(await res.json());
        }
    } catch (err) {
        console.error('sendSyllabusToApi failed', err);
    }
}

export function handleEditClicked(
    e: React.MouseEvent,
    syllabus: string,
    url: string,
) {
    e.preventDefault();
    loadExistTextHtmlIntoEditor(syllabus ?? '');
    setTimeout(() => {
        router.get(url);
    }, 10);
}
