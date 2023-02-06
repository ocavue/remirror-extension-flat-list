# ProseMirror Flat List

[![NPM version](https://img.shields.io/npm/v/remirror-extension-flat-list?color=a1b858&label=)](https://www.npmjs.com/package/remirror-extension-flat-list)

## [Online demo](https://remirror-extension-flat-list.netlify.app/)

## Motivation

This project introduces a new list schema different from the [prosemirror-schema-list].

## Installation and Usage

- If you are using plain [ProseMirror], please check the document of [prosemirror-flat-list].
- If you are using [Remirror], please check the document of [remirror-extension-flat-list].

## Node Specs

A new list node type, named `list`, will be added to the schema. Unlike the node in [prosemirror-scheam-list], it allows any block node as its children. The first child of a list node can be any block type in addition to a paragraph.

This node type has the following attributes.

- `type`:
  A string representing the type of the list node. It can be chose from the
  following values: `bullet`, `ordered`, `task` or `toggle`. Based on the
  `type` attribute, the list node will has different appearance and behavior.
  The default value is `bullet`.

  ![Node types](https://user-images.githubusercontent.com/24715727/216966304-c2f9a7f4-fc65-430c-91e8-2eb7aff956fa.png).

- `counter`:
  An optional number to determine the number of an ordered list node.
- `checked`:
  A boolean value to determine the checked state of the checkbox for a task
  list node.
- `collapsed`:
  A boolean value to determine the collapse state of a toggle list node.

## Commands

Since the first child of a list node can also be a list node, we can have multiple bullet points on one line. If we hide all the bullets except the last one in one line, we actually allow a list item to have arbitrary indentation level. Facebook's lexical editor uses a similar approach. The GIF below shows what arbitrary indentation looks like.



## Copy and paste

## Input rules

## Migration

`migrateDocJSON` accepts an ProseMirror document JSON object and returns an updated document JSON object. It will replace all the list nodes from [prosemirror-schema-list] or [@remirror/extension-list] with the new `list` node.

## License

MIT

[ProseMirror]: https://prosemirror.net/
[prosemirror-schema-list]: https://github.com/ProseMirror/prosemirror-schema-list
[@remirror/extension-list]: https://www.npmjs.com/package/@remirror/extension-list
[Remirror]: https://github.com/remirror/remirror
[prosemirror-flat-list]: https://github.com/ocavue/prosemirror-flat-list/tree/master/packages/prosemirror-package
[remirror-extension-flat-list]: https://github.com/ocavue/prosemirror-flat-list/tree/master/packages/remirror-package
