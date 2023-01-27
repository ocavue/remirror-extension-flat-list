import { DispatchFunction } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { liftTarget, ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList } from '../plugins/auto-join-item-plugin'
import { findIndentationRange } from '../utils/find-indentation-range'
import { findItemRange } from '../utils/find-item-range'
import { isItemRange } from '../utils/is-item-range'
import { separateItemRange } from './separate-item-range'

export { createDedentListCommandV1 as createDedentListCommand }

export function createDedentListCommandV1(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const { $from, $to } = state.selection
    // const range = findItemRange($from, $to, listType)
    const range = findIndentationRange($from, $to, listType, false)

    if (!range) {
      return false
    }

    if (isItemRange(range, listType)) {
      return liftToOuterList(state.tr, dispatch, listType, range)
    }

    return liftBlockRange(state.tr, dispatch, range)
  }

  return dedentListCommand
}

export function createDedentListCommandV2(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    {
      const { $from, $to } = tr.selection
      separateItemRange(tr, $from, $to, listType)
    }

    {
      const { $from, $to } = tr.selection
      const range = findItemRange($from, $to, listType)
      if (!range) {
        return false
      }

      const target = liftTarget(range)
      if (target == null) {
        return false
      }

      dispatch?.(tr.lift(range, target).scrollIntoView())
      return true
    }
  }

  return autoJoinList(dedentListCommand, listType)
}

export function liftToOuterList(
  tr: Transaction,
  dispatch: DispatchFunction | undefined,
  listType: NodeType,
  range: NodeRange,
) {
  const endOfItem = range.end
  const endOfSiblings = range.$to.end(range.depth)

  if (endOfItem < endOfSiblings) {
    // There are siblings after the lifted items, which must become
    // children of the last item
    tr.step(
      new ReplaceAroundStep(
        endOfItem - 1,
        endOfSiblings,
        endOfItem,
        endOfSiblings,
        new Slice(Fragment.from(listType.create(null)), 1, 0),
        0,
        true,
      ),
    )
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(endOfSiblings),
      range.depth,
    )
  }

  return liftBlockRange(tr, dispatch, range)
}

export function liftBlockRange(
  tr: Transaction,
  dispatch: DispatchFunction | undefined,
  range: NodeRange,
) {
  const target = liftTarget(range)

  if (target == null) {
    return false
  }

  dispatch?.(tr.lift(range, target).scrollIntoView())
  return true
}
