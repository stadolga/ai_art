import { Canvas } from './components/Canvas';
import { ClearCanvasButton } from './components/ClearCanvasButton';
import { CanvasToAIButton } from './components/CanvasToAIButton';
import { UndoButton } from './components/UndoButton';
import { StableDiffusionButton } from './components/StableDiffusionButton';
import { ColorPicker } from './components/ColorPicker';
import { Slider } from './components/Slider';
import { ResponseField } from './components/responseField';
import { ToolTipComponent } from './components/Tooltip';
import {ImageComponent} from './components/ImageComponent'
import { ErrorField } from './components/ErrorField';
import Togglable from './components/Togglable';
import Header from './components/Header';

function Controls() {
  return (
    <div className="controls">
      <div className="buttons">
        <StableDiffusionButton/>
        <ClearCanvasButton />
        <UndoButton/><br/>
        <CanvasToAIButton />
      </div>
      <div className="sliders">
        <Slider />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <ImageComponent/>
      <div className="canvasContainer">
        <Canvas className="canvas" />
        <ToolTipComponent/>
        <div className="center">
          <div className="controls-container">
            <Togglable>
              <ColorPicker />
            </Togglable>
            <Controls />
            <div className="text-box">
              <ErrorField/>
              <ResponseField />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
