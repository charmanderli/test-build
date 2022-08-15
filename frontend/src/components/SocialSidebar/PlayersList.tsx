import { Heading, ListItem, OrderedList, Tooltip } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerName from './PlayerName';
/**
 * Lists the current players in the town, along with the current town's name and ID
 *
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 *
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 *
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 *
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 *
 */
export default function PlayersInTownList(): JSX.Element {
  const townInfo = useCoveyAppState();
  const townId = townInfo.currentTownID;
  const townName = townInfo.currentTownFriendlyName;
  const players = usePlayersInTown();
  const playersSorted = [...players];
  playersSorted.sort((a, b) =>
    a.userName.localeCompare(b.userName, undefined, { numeric: true, sensitivity: 'base' }),
  );
  return (
    <>
      <Tooltip label={`Town ID: ${townId}`}>
        <Heading as='h2' size='sm'>
          Current town: {townName}
        </Heading>
      </Tooltip>
      <OrderedList>
        {playersSorted.map(p => (
          <ListItem key={p.id}>
            <PlayerName player={p} />
          </ListItem>
        ))}
      </OrderedList>
    </>
  );
}
