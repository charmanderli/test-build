import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import './ContainerStyle.css';
import WhiteBoardContainer from './WhiteBoardContainer';
// type WhiteBoardModalState = {
//   penColor: string;
//   penSize: number;
// };
type WhiteBoardModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};
const styles: { [name: string]: React.CSSProperties } = {
  select: {
    padding: 5,
    width: 200,
  },
};
export default function WhiteBoardModal({ isOpen, closeModal }: WhiteBoardModalProps): JSX.Element {
  //   constructor(props: WhiteBoardModalProps) {
  //     super(props);
  //     this.state = {
  //       penColor: 'black',
  //       penSize: 5,
  //     };
  //   }
  const { socket } = useCoveyAppState();

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeModal();
      }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ulalalala</ModalHeader>
        <ModalCloseButton />
        <WhiteBoardContainer socket={socket} />
      </ModalContent>
    </Modal>
  );
}

// export default WhiteBoardModal;
