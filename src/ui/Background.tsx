export default function Background() {
    return (
        <div className="fixed inset-0 overflow-hidden -z-10">
            <img
                className="opacity-7 absolute top-1/2 -translate-y-1/2 sm:top-0 sm:bottom-0 sm:right-0 sm:translate-x-1/2 sm:translate-y-0 sm:h-full"
                src="/CRI_logo.png"
            />
        </div>
    )
}