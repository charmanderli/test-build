import React from 'react';
import Board from './Board';
import './ContainerStyle.css';

type ContainerState = {
  penColor: string;
  penSize: number;
};
const styles: { [name: string]: React.CSSProperties } = {
  select: {
    padding: 5,
    width: 200,
  },
};
class WhiteBoardContainer extends React.Component<Record<string, never>, ContainerState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      penColor: 'black',
      penSize: 5,
    };
  }

  changePenColor(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ penColor: event.target.value });
  }

  changePenSize(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ penSize: Number(event.target.value) });
  }

  render() {
    const { penColor, penSize } = this.state;
    return (
      <div className='container'>
        <div className='tools-bar'>
          <div className='color-picker-container'>
            Select Pen Color: &nbsp;
            <input type='color' value={penColor} onChange={this.changePenColor.bind(this)} />
          </div>
          <div className='brushsize-container'>
            Select Brush Size: &nbsp;
            <select value={penSize} onChange={this.changePenSize.bind(this)} style={styles.select}>
              <option value='1'>1</option>
              <option value='5'>5</option>
              <option value='10'>10</option>
            </select>
          </div>
        </div>
        <div className='board-container'>
          <Board penColor={penColor} penSize={penSize} />
        </div>
      </div>
    );
  }
}

export default WhiteBoardContainer;
