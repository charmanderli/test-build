import React from 'react';
import { io } from 'socket.io-client';
import './BoardStyle.css';

type BoardProps = {
  penSize: number;
  penColor: string;
};
// type BoardStates = {};
class Board extends React.Component<BoardProps, Record<string, never>> {
  timeout: NodeJS.Timeout;

  // socket = io("http://localhost:3000", { transports: ["websocket"] });
  socket = io('http://localhost:3000');

  isDrawing = false;

  ctx: CanvasRenderingContext2D;

  constructor(props: BoardProps) {
    super(props);
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
    this.socket.on('canvas-data', (data: any) => initData(data));
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

  drawOnCanvas() {
    const canvas = document.getElementById('board') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const { ctx } = this;
    const sketch = document.getElementById('sketch') as HTMLElement;
    const sketchSize = getComputedStyle(sketch);
    canvas.width = parseInt(sketchSize.getPropertyValue('width'), 10);
    canvas.height = parseInt(sketchSize.getPropertyValue('height'), 10);

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
        this.socket.emit('canvas-data', base64ImageData);
      }, 1000);
    };

    canvas.addEventListener(
      'mousemove',
      function (e) {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;
        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
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
        <canvas className='board' id='board' />
      </div>
    );
  }
}

export default Board;
