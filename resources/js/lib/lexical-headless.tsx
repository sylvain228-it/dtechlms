import { nodes } from '@/components/blocks/editor-x/nodes';
import { createHeadlessEditor } from '@lexical/headless';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot } from 'lexical';

const editor = createHeadlessEditor({
    nodes: nodes,
    onError: () => {},
});

export async function convertEditorStateToHtml(
    serializedState: string,
): Promise<string> {
    const editorState = editor.parseEditorState(serializedState);
    editor.setEditorState(editorState);

    const html = editor.read(() => {
        // const root = $getRoot();
        return $generateHtmlFromNodes(editor);
    });
    return html;
}

// htmlTo EditorState to be implemented later if needed

// export async function convertHtmlToEditorState(html: string): Promise<string> {
//     const domParser = new DOMParser();
//     const doc = domParser.parseFromString(html, 'text/html');

//     // Crée un état d'éditeur vierge
//     const editorState = editor.getEditorState().clone();

//     // Log : inspecter le DOM
//     console.log('DOM parsed:', doc.body);

//     editor.update(() => {
//         const nodes = $generateNodesFromDOM(editor, doc.body);
//         console.log('Generated nodes:', nodes); // Ajouter ce log

//         const root = $getRoot();
//         root.clear();
//         nodes.forEach((node) => root.append(node));
//     });

//     // Log : inspecter l'état final
//     console.log(
//         'Serialized EditorState:',
//         JSON.stringify(editorState.toJSON()),
//     );
//     return JSON.stringify(editorState.toJSON());
// }

export function loadExistTextHtmlIntoEditor(html: string) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');

    editor.update(() => {
        const nodes = $generateNodesFromDOM(editor, dom.body);
        const root = $getRoot();
        root.clear();
        nodes.forEach((node) => root.append(node));
        localStorage.removeItem('textEditContentState');
        // Callback ici après la mise à jour
        setTimeout(() => {
            // Effectuer une action après la mise à jour de l'éditeur
            localStorage.setItem(
                'textEditContentState',
                JSON.stringify(editor.getEditorState().toJSON()),
            );
        }, 0);
    });
}

// export async function convertHtmlToEditorState(html: string): Promise<string> {
//     const domParser = new DOMParser();
//     const doc = domParser.parseFromString(html, 'text/html');

//     editor.update(() => {
//         const nodes = $generateNodesFromDOM(editor, doc.body);
//         const root = $getRoot();
//         root.clear();
//         nodes.forEach((node) => root.append(node));
//     });

//     return JSON.stringify(editor.getEditorState().toJSON());
// }

// export function convertHtmlToState(html: string): string {
//     const domParser = new DOMParser();
//     const doc = domParser.parseFromString(html, 'text/html');

//     let result: string;

//     editor.update(() => {
//         const nodes = $generateNodesFromDOM(editor, doc.body);
//         const root = $getRoot();
//         root.clear();
//         nodes.forEach((node) => root.append(node));

//         result = JSON.stringify(editor.getEditorState().toJSON());
//     });
//     localStorage.setItem(
//         'textContentState',
//         JSON.stringify(editor.getEditorState().toJSON()),
//     );
//     console.log(
//         'convertHtmlToState result',
//         JSON.parse(result!) as SerializedEditorState,
//     );

//     return result!;
// }
