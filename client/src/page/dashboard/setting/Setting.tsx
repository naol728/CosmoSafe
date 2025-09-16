/* eslint-disable */
"use client";
import { useAppSelector } from "@/store/hook";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/services/stripe";

export default function Setting() {
    const authState = useAppSelector((state) => state.auth);
    const user = authState.user?.user;

    if (!user)
        return (
            <p className="text-center mt-20 text-lg text-gray-500">Loading...</p>
        );

    const handleUpgrade = () => {
        if (user.email) {
            createCheckoutSession(user.email);
        } else {
            alert("Please log in to upgrade.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-10">
            <div className="flex flex-col items-center gap-6 p-6 sm:p-10 bg-white dark:bg-gray-800 shadow-2xl rounded-3xl w-full max-w-md sm:max-w-3xl transition-transform hover:scale-[1.02]">
                {/* Profile Picture */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                    <img
                        src="https://i.pravatar.cc/200?img=3"
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>

                {/* User Info */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center break-words">
                    {user.email}
                </h2>
                <p className="text-gray-500 dark:text-gray-300 text-sm sm:text-lg">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>

                {/* Premium Status */}
                {user?.is_admin ? (
                    <p className="text-xl sm:text-2xl text-blue-500 font-semibold mt-4 text-center">
                        Admin 🚀
                    </p>
                ) : user?.is_premium ? (
                    <p className="text-xl sm:text-2xl text-green-600 font-semibold mt-4 text-center">
                        Premium User 🌟
                    </p>
                ) : (
                    <Button
                        onClick={handleUpgrade}
                        className="mt-4 px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold shadow-xl hover:scale-105 hover:opacity-90 transition-transform duration-300 w-full sm:w-auto"
                    >
                        Upgrade to Premium
                    </Button>
                )}
            </div>

            {/* Extra Touch: Footer Info for Mobile */}
            <p className="mt-6 text-gray-400 text-sm text-center sm:hidden">
                Upgrade to unlock premium features 🚀
            </p>
        </div>
    );
}
