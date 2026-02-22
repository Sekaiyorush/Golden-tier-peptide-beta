import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error in 3D Canvas:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 border border-[#D4AF37]/20 bg-slate-50 opacity-50">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#AA771C] mb-2">Display Error</p>
                    <p className="text-xs text-slate-500 text-center">The 3D interactive model could not be loaded on this device.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
