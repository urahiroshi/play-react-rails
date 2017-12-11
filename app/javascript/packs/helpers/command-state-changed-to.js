/**
 * Return changed state of command.
 * If state is not changed or specified commandId is invalid
 * (undefined or not found in commands),
 * it returns null.
 */
const commandStateChangedTo = (
  { commandId, currentCommands, nextCommands },
) => {
  if (
    !commandId ||
    !nextCommands[commandId] ||
    !currentCommands[commandId] ||
    currentCommands[commandId].state === nextCommands[commandId].state
  ) {
    return null
  }
  return nextCommands[commandId].state
}

export default commandStateChangedTo
