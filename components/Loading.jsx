import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
        </div>
    )
}

export const ProductSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                    <div className="bg-gray-200 h-4 w-full rounded"></div>
                    <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                    <div className="bg-gray-200 h-12 w-1/3 rounded"></div>
                    <div className="bg-gray-200 h-32 w-full rounded"></div>
                    <div className="flex gap-4">
                        <div className="bg-gray-200 h-12 flex-1 rounded"></div>
                        <div className="bg-gray-200 h-12 flex-1 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading