export default function CardWrapper(props: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full h-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            {props.children}
        </div>
    );
}
