import { Button, Input, Select } from '@chakra-ui/react';
import React from 'react';
import Board from './Board';
import './ContainerStyle.css';

type ContainerState = {
  penColor: string;
  penSize: number;
  socket: any;
};
// const styles: { [name: string]: React.CSSProperties } = {
//   select: {
//     padding: 5,
//     width: 200,
//   },
// };
class WhiteBoardContainer extends React.Component<Record<string, any>, ContainerState> {
  constructor(props: Record<string, any>) {
    super(props);
    const { socket } = this.props;
    this.state = {
      penColor: 'black',
      penSize: 5,
      socket,
    };
  }

  changePenColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ penColor: event.target.value });
  };

  changePenSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ penSize: Number(event.target.value) });
  };

  render() {
    // const { penColor, penSize, _socket } = this.state;
    const { penColor, penSize, socket } = this.state;

    return (
      <div className='container'>
        <div className='tools-bar'>
          <div className='color-picker-container'>
            Select Pen Color: &nbsp;
            <Input size='sm' type='color' value={penColor} onChange={this.changePenColor} />
          </div>
          <div className='brushsize-container'>
            Select Brush Size: &nbsp;
            <Select size='sm' value={penSize} onChange={this.changePenSize}>
              <option value='1'>1</option>
              <option value='5'>5</option>
              <option value='10'>10</option>
            </Select>
          </div>

          <Button
            className='eraser'
            size='sm'
            onClick={() => {
              this.setState({ penColor: 'white' });
            }}>
            Eraser
          </Button>
        </div>
        <div className='board-container'>
          <Board penColor={penColor} penSize={penSize} socket={socket} />
        </div>
      </div>
    );
  }
}

export default WhiteBoardContainer;
