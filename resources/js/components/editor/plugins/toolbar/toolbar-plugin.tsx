'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';

import { ToolbarContext } from '@/components/editor/context/toolbar-context';
import { useEditorModal } from '@/components/editor/editor-hooks/use-modal';

// import { $generateHtmlFromNodes } from '@lexical/html';
export function ToolbarPlugin({
    children,
}: {
    children: (props: { blockType: string }) => React.ReactNode;
}) {
    const [editor] = useLexicalComposerContext();

    const [activeEditor, setActiveEditor] = useState(editor);
    const [blockType, setBlockType] = useState<string>('paragraph');

    const [modal, showModal] = useEditorModal();

    const $updateToolbar = () => {};

    useEffect(() => {
        editor.update(() => {
            // // Try to restore a previously saved editor state (JSON) from localStorage
            // if (typeof window !== 'undefined') {
            //     const savedJson = localStorage.getItem('textContentState');
            //     if (savedJson) {
            //         try {
            //             const parsed = JSON.parse(savedJson);
            //             // Use Lexical API to parse and set the editor state if available
            //             // (editor.parseEditorState / editor.setEditorState)
            //             // These APIs accept the serialized editor state produced by editor.toJSON()
            //             // or similar serialization.
            //             // Guarding in case APIs are not present on the editor instance.
            //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //             // @ts-ignore
            //             const restored = editor.parseEditorState ? editor.parseEditorState(parsed) : null;
            //             if (restored) {
            //                 editor.setEditorState(restored);
            //             }
            //         } catch (err) {
            //             console.error('Failed to restore editor state from localStorage', err);
            //         }
            //     }
            // }
            // const html = $generateHtmlFromNodes(editor);
            // if (typeof window != 'undefined') {
            //     localStorage.setItem('textHtmlContentState', html);
            //     const savedStateHtml = localStorage.getItem(
            //         'textHtmlContentState',
            //     );
            //     console.log('ddd', savedStateHtml);
            // }
        });
        return activeEditor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload, newEditor) => {
                setActiveEditor(newEditor);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [activeEditor, editor]);
    return (
        <ToolbarContext
            activeEditor={activeEditor}
            $updateToolbar={$updateToolbar}
            blockType={blockType}
            setBlockType={setBlockType}
            showModal={showModal}
        >
            {modal}

            {children({ blockType })}
        </ToolbarContext>
    );
}
