type Button = {
    children?: React.ReactNode;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * Custom Button component for game !!
 * @param param0
 * @returns
 */
const Button: React.FC<Button> = ({children, className, ...props}) => {
    return (
        <button
            {...props}
            className={[className, 'text-white flex items-center bg-blue-600 hover:bg-blue-950 transition-all font-semibold px-4 py-2 sm:text-lg lg:text-xl 2xl:text-2xl rounded-full '].join(
                ' ',
            )}
        >
            {children}
        </button>
    );
};

Button.displayName = 'Button';

export default Button;
