import { SerializedEditorState } from 'lexical';
import { useEffect, useState } from 'react';

import { Editor } from '@/components/blocks/editor-x/editor';
import { convertEditorStateToHtml } from '@/lib/lexical-headless';
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
export default function CustomTextEditor({
    isNew = false,
}: {
    isNew: boolean;
}) {
    const [editorState, setEditorState] = useState<SerializedEditorState>(
        () => {
            if (typeof window === 'undefined') return initialValue;
            // localStorage.removeItem('textContentState');
            try {
                const savedState = localStorage.getItem(
                    isNew ? 'textContentState' : 'textEditContentState',
                );
                const savedStateSerial = savedState
                    ? (JSON.parse(savedState) as SerializedEditorState)
                    : initialValue;
                console.log('savedState', savedStateSerial);

                return savedStateSerial.root.children.length === 0
                    ? initialValue
                    : savedStateSerial;
            } catch {
                return initialValue;
            }
        },
    );

    // persist editorState to localstorage when it changes
    useEffect(() => {
        localStorage.setItem(
            isNew ? 'textContentState' : `textEditContentState`,
            JSON.stringify(editorState),
        );
        (async () => {
            try {
                const htmlConverted = await convertEditorStateToHtml(
                    JSON.stringify(editorState),
                );
                localStorage.setItem(
                    isNew ? 'textHtmlContentState' : `textEditHtmlContentState`,
                    htmlConverted,
                );
            } catch (err) {
                console.error('Failed to convert editor state to HTML', err);
            }
        })();
    }, [editorState, isNew]);

    return (
        <Editor
            editorSerializedState={editorState}
            onSerializedChange={(value) => setEditorState(value)}
        />
    );
}
