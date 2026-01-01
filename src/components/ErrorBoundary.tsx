import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    state: State = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log("App crashed: ", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className='min-h-screen flex items-center justify-center bg-gray-100'>
                    <div className='bg-white p-6 rounded-xl shadow-lg text-center max-w-md'>
                        <h2 className='text-xl font-semibold mb-2'>
                            Something went wrong!
                        </h2>
                        <p className='text-gray-600 mb-4'>
                            Refresh the page and try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className='px-4 py-2 bg-primary text-white rounded-lg cursor-pointer'>
                            Refresh
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
