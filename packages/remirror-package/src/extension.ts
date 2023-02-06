import {
  convertCommand,
  ExtensionTag,
  InputRule,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  NodeViewMethod,
} from '@remirror/core'

import {
  alwaysTrue,
  createDedentListCommand,
  createIndentListCommand,
  createListInputRules,
  createListNodeView,
  createListPlugin,
  createListSpec,
  createSplitListCommand,
} from 'prosemirror-flat-list'

export class ListExtension extends NodeExtension {
  static disableExtraAttributes = true

  get name() {
    return 'list'
  }

  createTags() {
    return [ExtensionTag.Block]
  }

  createNodeSpec(): NodeExtensionSpec {
    // @ts-expect-error: incompatible type
    return createListSpec()
  }

  createNodeViews(): NodeViewMethod {
    // @ts-expect-error: TODO: this need to be fixed on the remirror side
    return createListNodeView
  }

  createKeymap(): KeyBindings {
    return {
      Enter: convertCommand(createSplitListCommand(this.type)),

      'Shift-Tab': alwaysTrue(
        convertCommand(createDedentListCommand(this.type)),
      ),

      Tab: alwaysTrue(convertCommand(createIndentListCommand(this.type))),
    }
  }

  createExternalPlugins() {
    return [createListPlugin(this.store.schema, this.type)]
  }

  createInputRules(): InputRule[] {
    return createListInputRules(this.type)
  }

  createCommands() {
    return {
      indentList: () => convertCommand(createIndentListCommand(this.type)),
      dedentList: () => convertCommand(createDedentListCommand(this.type)),
    } as const
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      list: ListExtension
    }
  }
}