type SliderInput = {
    icon?: React.ReactNode;
    sliderValue: number;
    handleSliderChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
};
/**
 * Custom range input for game to control speed and col size.
 * @param icon Icon component `Lucide Icons`;
 * @param sliderValue number;
 * @param  handleSliderChange function
 * @param  min number;
 * @param max number;
 * @param step number;
 * @returns
 */
const SliderInput: React.FC<SliderInput> = ({step, handleSliderChange, sliderValue, icon, max, min}) => {
    return (
        <div className="flex gap-2">
            {icon}
            <input
                className="cursor-pointer"
                type="range"
                min={min}
                max={max}
                step={step}
                value={sliderValue} // Set the slider value for reverse effect
                onChange={(e) => handleSliderChange(Number(e.target.value))}
            />
        </div>
    );
};

SliderInput.displayName = 'SliderInput';
export default SliderInput;
