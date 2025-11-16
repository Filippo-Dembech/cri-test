import type { ButtonHTMLAttributes } from "react";
import { BsArrowRight } from "react-icons/bs";

interface NextButtonProps {
    show: boolean;
}

export default function NextButton({
    show,
    ...rest
}: NextButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    if (show)
        return (
            <button
                className="flex items-center justify-center gap-3 cursor-pointer rounded-full bg-red-100 px-3 py-1"
                {...rest}
            >
                Prossimo <BsArrowRight />
            </button>
        );
}
