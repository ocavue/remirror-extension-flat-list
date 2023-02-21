import type { ListType, ProsemirrorNodeJSON } from './types'

function migrateNodes(
  nodes: ProsemirrorNodeJSON[],
): [ProsemirrorNodeJSON[], boolean] {
  const content: ProsemirrorNodeJSON[] = []
  let updated = false

  for (const node of nodes) {
    if (node.type === 'bullet_list' || node.type === 'bulletList') {
      updated = true
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { type: 'bullet' })[0])
      }
    } else if (node.type === 'ordered_list' || node.type === 'orderedList') {
      updated = true
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { type: 'ordered' })[0])
      }
    } else if (node.type === 'task_list' || node.type === 'taskList') {
      updated = true
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { type: 'task' })[0])
      }
    } else {
      content.push(node)
    }
  }

  return [content, updated]
}

function migrateNode(
  node: ProsemirrorNodeJSON,
  { type }: { type?: ListType } = {},
): [ProsemirrorNodeJSON, boolean] {
  if (
    node.type === 'list_item' ||
    node.type === 'listItem' ||
    node.type === 'taskListItem'
  ) {
    return [
      {
        ...node,
        type: 'list',
        attrs: {
          collapsed: node.attrs?.closed,
          ...node.attrs,
          type: type ?? 'bullet',
        },
        content: node.content ? migrateNodes(node.content)[0] : undefined,
      },
      true,
    ]
  } else if (node.content) {
    const [content, updated] = migrateNodes(node.content)
    return [{ ...node, content }, updated]
  } else {
    return [node, false]
  }
}

/**
 * Migrate a ProseMirror document JSON object from the old list structure to the
 * new. A new document JSON object is returned if the document is updated,
 * otherwise `null` is returned.
 *
 * @public
 */
export function migrateDocJSON(
  docJSON: ProsemirrorNodeJSON,
): ProsemirrorNodeJSON | null {
  const [migrated, updated] = migrateNode(docJSON)
  return updated ? migrated : null
}
