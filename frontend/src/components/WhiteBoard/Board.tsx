import { Button, ButtonGroup } from '@chakra-ui/react'
import React from 'react';
import { Socket, io } from 'socket.io-client';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import './BoardStyle.css';



type BoardProps = {
  penSize: number;
  penColor: string;
  socket: any
};
// type BoardStates = {};
class Board extends React.Component<BoardProps, Record<string, any>> {
  timeout: NodeJS.Timeout;

  private canvas: HTMLCanvasElement;

  isDrawing = false;

  private _socket: Socket;

  ctx: CanvasRenderingContext2D;

  constructor(props: BoardProps) {
    super(props);

    const { socket } = this.props;
    // this._socket = io('http://localhost:3000');

    this._socket = socket;
    const initData = (data: string) => {
      //   const root: Board = this;
      const interval = setInterval(() => {
        if (this.isDrawing) {
          return;
        }
        this.isDrawing = true;
        clearInterval(interval);
        const image = new Image();
        const canvas = document.getElementById('board') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        // image.onload = function () {
        //   ctx.drawImage(image, 0, 0);
        //   root.isDrawing = false;
        // };
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          this.isDrawing = false;
        };
        image.src = data;
      }, 200);
      return initData;
    };

    this._socket.on('canvas-data', (data: any) => initData(data));

  }


  componentDidMount() {
    this.drawOnCanvas();
  }

  UNSAFE_componentWillReceiveProps(newProps: BoardProps) {
    this.ctx.strokeStyle = newProps.penColor;
    this.ctx.lineWidth = newProps.penSize;
  }
  // var socket = io.connect
  // var socket = io.connect("http://localhost:5000");
  // const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
  // const socket: Socket<ServerTo

  handleClearBoard() {
    const canvas = document.getElementById("board") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      const base64ImageData = canvas.toDataURL('image/png');
      this._socket.emit('canvas-data', base64ImageData);
    }, 1000);
  }

  drawOnCanvas() {
    const canvas = document.getElementById('board') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { ctx } = this;
    const sketch = document.getElementById('sketch') as HTMLElement;
    const sketchSize = getComputedStyle(sketch);
    canvas.width = parseInt(sketchSize.getPropertyValue('width'), 10);
    canvas.height = parseInt(sketchSize.getPropertyValue('height'), 10);
    console.log(canvas.width);
    console.log(canvas.height);
    const mouse = { x: 0, y: 0 };
    const lastMouse = { x: 0, y: 0 };

    // const root = this;
    const onPaint = () => {
      ctx.beginPath();
      ctx.moveTo(lastMouse.x, lastMouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();
      if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        const base64ImageData = canvas.toDataURL('image/png');
        this._socket.emit('canvas-data', base64ImageData);
      }, 1000);
    };

    canvas.addEventListener(
      'mousemove',
      function (e) {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        mouse.x = e.pageX - this.offsetLeft - 35;
        mouse.y = e.pageY - this.offsetTop - 35;
      },
      false,
    );
    console.log(`in drawOnCanvas${this.props}`);
    const { penSize, penColor } = this.props;
    ctx.lineWidth = penSize;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = penColor;
    canvas.addEventListener('mousedown', () => {
      canvas.addEventListener('mousemove', onPaint, false);
    });

    canvas.addEventListener(
      'mouseup',
      () => {
        canvas.removeEventListener('mousemove', onPaint, false);
      },
      false,
    );
  }

  render() {
    return (
      <div className='sketch' id='sketch'>
        <Button className='clear-btn' colorScheme='red' size='sm' onClick={() => this.handleClearBoard()}>Clear</Button>
        <canvas className='board' id='board' />
      </div>
    );
  }
}

export default Board;
