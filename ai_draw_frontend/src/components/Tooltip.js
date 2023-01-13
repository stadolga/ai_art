import React, { useState } from 'react';

const ToolTipComponent = () => {
    const [isOpen, setOpen] = useState(false);

    return (
        <div>
            <button class ="infoButton" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><i className="fa fa-question" /></button>
            {isOpen && (
                <div className="tooltip-box">
                    <label>Use the application by drawing something on the canvas by pressing with your mouse.</label>
                    <label>You can undo your latest line by pressing undo.</label>
                    <p>Slider changes the size of the brush, "Change color" changes the color of the brush.</p>

                    <label>Press "submit" to get the AI analysis of your drawing, this can take anywhere from 2-100 seconds. Press "reset" to reset the canvas.</label>
                    <label>Press "Send to Stable Diffusion" to get Stable Diffusion-generated version of your drawing. You must submit first to use this feature.</label>
                </div>
            )}
        </div>
    )
}

export { ToolTipComponent };
