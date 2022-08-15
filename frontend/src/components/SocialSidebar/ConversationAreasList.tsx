import { Box, Heading, ListItem, UnorderedList } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ConversationArea, { NO_TOPIC_STRING } from '../../classes/ConversationArea';
import Player from '../../classes/Player';
import useConversationAreas from '../../hooks/useConversationAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import PlayerName from './PlayerName';

function ConversationAreaComp({
  area,
  playersInTown,
}: {
  area: ConversationArea;
  playersInTown: Player[];
}): JSX.Element {
  const [occupants, setOccupants] = useState(area.occupants);

  useEffect(() => {
    const updateListener = {
      onOccupantsChange: (newOccupants: string[] | undefined) => {
        if (newOccupants) {
          setOccupants(newOccupants);
        }
      },
    };
    area.addListener(updateListener);
    updateListener.onOccupantsChange(area.occupants);
    return () => {
      area.removeListener(updateListener);
    };
  }, [area]);
  return (
    <>
      <Box key={area.label}>
        <Heading as='h3' size='sm'>
          {area.label}: {area.topic}
        </Heading>
        <UnorderedList>
          {occupants.map(occupant => {
            const player = playersInTown.filter(playerTmp => playerTmp.id === occupant);
            return player.length > 0 ? (
              <ListItem key={occupant}>
                <PlayerName player={player[0]} />
              </ListItem>
            ) : (
              <></>
            );
          })}
        </UnorderedList>
      </Box>
    </>
  );
}

/**
 * Displays a list of "active" conversation areas, along with their occupants
 *
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 *
 * If there are no active conversation areas, it displays the text "No active conversation areas"
 *
 * If there are active areas, it sorts them by label ascending, using a numeric sort with base sensitivity
 *
 * Each conversation area is represented as a Box:
 *  With a heading (H3) `{conversationAreaLabel}: {conversationAreaTopic}`,
 *  and an unordered list of occupants.
 *
 * Occupants are *unsorted*, appearing in the order
 *  that they appear in the area's occupantsByID array. Each occupant is rendered by a PlayerName component,
 *  nested within a ListItem.
 *
 * Each conversation area component must subscribe to occupant updates by registering an `onOccupantsChange` listener on
 *  its corresponding conversation area object.
 * It must register this listener when it is mounted, and remove it when it unmounts.
 *
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
export default function ConversationAreasList(): JSX.Element {
  const conversationAreas = useConversationAreas();
  let activeConversationAreasTmp = conversationAreas;
  activeConversationAreasTmp = activeConversationAreasTmp.filter(
    area => area.topic !== NO_TOPIC_STRING,
  );
  activeConversationAreasTmp.sort((a, b) =>
    a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }),
  );
  const playersInTown = usePlayersInTown();

  return (
    <>
      {activeConversationAreasTmp.length === 0
        ? 'No active conversation areas'
        : activeConversationAreasTmp.map(areaTmp => (
            <ConversationAreaComp
              area={areaTmp}
              playersInTown={playersInTown}
              key={areaTmp.label}
            />
          ))}
    </>
  );
}
