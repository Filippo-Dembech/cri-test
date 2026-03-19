import type { ButtonHTMLAttributes } from "react";
import { BsArrowRight } from "react-icons/bs";
import Button from "./Button";

interface NextButtonProps {
    show: boolean;
}

export default function NextButton({
    show,
    ...rest
}: NextButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    if (show)
        return (
            <Button outlined
                className="flex items-center gap-3"
                {...rest}
            >
                Prossimo <BsArrowRight />
            </Button>
        );
}
