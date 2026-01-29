import { SerializedEditorState } from 'lexical';
import { useEffect, useState } from 'react';

import { Editor } from '@/components/blocks/editor-x/editor';

export const initialValue = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '',
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;

export default function EditorPage() {
    const [editorState, setEditorState] = useState<SerializedEditorState>(
        () => {
            if (typeof window === 'undefined') return initialValue;
            try {
                const savedState = localStorage.getItem('textContentState');
                return savedState
                    ? (JSON.parse(savedState) as SerializedEditorState)
                    : initialValue;
            } catch {
                return initialValue;
            }
        },
    );

    // persist editorState to localstorage when it changes
    useEffect(() => {
        localStorage.setItem('textContentState', JSON.stringify(editorState));
    }, [editorState]);

    return (
        <Editor
            editorSerializedState={editorState}
            onSerializedChange={(value) => setEditorState(value)}
        />
    );
}
