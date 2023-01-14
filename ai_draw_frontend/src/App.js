import { Canvas } from './components/Canvas';
import { ColorPicker } from './components/ColorPicker';
import { ToolTipComponent } from './components/Tooltip';
import { ImageComponent } from './components/ImageComponent';

import { ClearCanvasButton } from './components/ClearCanvasButton';
import { CanvasToAIButton } from './components/CanvasToAIButton';
import { UndoButton } from './components/UndoButton';
import { StableDiffusionButton } from './components/StableDiffusionButton';
import { Slider } from './components/Slider';

import { ResponseField } from './components/responseField';
import { ErrorField } from './components/ErrorField';

import Togglable from './components/Togglable';
import Header from './components/Header';

function Controls() {
  return (
    <div className="controls">
      <div className="buttons">
      <div className="sliders">
      <Slider />
      </div>
        <Togglable>
          <ColorPicker />
        </Togglable>
        <ClearCanvasButton />
        <UndoButton />
        <br />
        <CanvasToAIButton />
        <StableDiffusionButton />
      </div>

    </div>
  );
}

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <ImageComponent />
      <div className="canvasContainer">
        <Canvas className="canvas" />
        <ToolTipComponent />
        <div className="center">
          <div className="controls-container">
            <Controls />
            <div className="text-box">
              <ErrorField />
              <ResponseField />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
