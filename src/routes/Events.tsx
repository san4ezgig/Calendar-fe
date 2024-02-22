import React, { useCallback, useEffect, useState } from 'react';
import { clearAccessToken, getAccessToken } from "../storage/index.ts";
import { Link, useNavigate } from "react-router-dom";
import {
  Button, Container, Flex, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Table, Tbody, Td, Th, Thead, Tr
} from '@chakra-ui/react'

type CalendarEvent = {
  id: string,
  summary: string,
  start: {
    dateTime: string,
  },
  attendees?: Array<{
    email: string,
  }>,
  creator: {
    email: string
  },
  hangoutLink: string;
  created: string;
  updated: string;
};

const Events = () => {
  const [events, setEvents] = useState<Array<CalendarEvent>>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  let navigate = useNavigate();

  const openModal = useCallback((event: CalendarEvent) => () => {
    setSelectedEvent(event);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const loadEvents = useCallback(async (token: string) => {
    try {
      const params = new URLSearchParams({
        timeMin: new Date().toISOString(),
        maxResults: '10'
      })
      const jsonData = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?' + params, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await jsonData.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      setEvents(data.items);
    } catch (e) {
      clearAccessToken();
      navigate('/');
      console.error(e);
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    clearAccessToken();
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const token = getAccessToken();

    if (token) {
      loadEvents(token);
    } else {
      navigate('/');
    }
  }, [loadEvents, navigate]);

  return (
    <Container centerContent maxW='3xl'>
      <Flex justify="flex-end" w="100%" mb={8}>
        <Button colorScheme='green' onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
      <Table borderWidth='1px' variant='simple'>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Event name</Th>
            <Th>Attendees</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event) => {
            const handleOpenModal = openModal(event);
            const { id, summary, start, attendees, creator, hangoutLink } = event;
            const users = attendees ? attendees.map(({ email }) => email).join(', ') : creator.email;
            return <Tr cursor="pointer" onClick={handleOpenModal} key={id}>
              <Td>
                {new Date(start.dateTime).toLocaleDateString()}
              </Td>
              <Td>
                {summary}
              </Td>
              <Td>
                {users}
              </Td>
              <Td>
                {hangoutLink && <Link color='teal.500' target="blank" rel="noreferrer"
                                      to={hangoutLink}>{hangoutLink}</Link>}
              </Td>
            </Tr>
          })}
        </Tbody>
      </Table>
      {selectedEvent && <Modal isOpen={!!selectedEvent} onClose={closeModal}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>{selectedEvent.summary}</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            Start - {new Date(selectedEvent.start.dateTime).toLocaleDateString()},
            Attendees - {(selectedEvent.attendees || []).map(({ email }) => email).join(', ')},
            Location - {selectedEvent.hangoutLink},
            Creator Email - {selectedEvent.creator.email},
            Created - {new Date(selectedEvent.created).toLocaleDateString()},
            Updated - {new Date(selectedEvent.updated).toLocaleDateString()},
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}
    </Container>
  );
};

export default Events;
