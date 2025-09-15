/* eslint-disable */
"use client";
import { useAppSelector } from "@/store/hook";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/services/stripe";

export default function Setting() {
    const authState = useAppSelector((state) => state.auth);
    const user = authState.user?.user;

    if (!user) return <p className="text-center mt-20 text-lg">Loading...</p>;

    const handleUpgrade = () => {
        if (user.email) {
            createCheckoutSession(user.email);
        } else {
            alert("Please log in to upgrade.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-10">
            <div className="flex flex-col items-center gap-6 p-10 bg-background shadow-2xl rounded-3xl w-full max-w-3xl">
                {/* Profile Picture */}
                <img
                    src="https://i.pravatar.cc/200?img=3"
                    alt="User Avatar"
                    className="w-40 h-40 rounded-full border-6 border-purple-500"
                />

                {/* User Info */}
                <h2 className="text-3xl font-bold">{user.email}</h2>
                <p className="text-gray-600 text-lg">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>

                {/* Premium Status */}
                {user?.is_admin ? "Admin" : user.is_premium ? (
                    <p className="text-2xl text-green-600 font-semibold mt-4">
                        Premium User 🚀
                    </p>
                ) : (
                    <Button
                        onClick={handleUpgrade}
                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl hover:opacity-90 transition-all duration-300 mt-4 px-8 py-4 text-lg"
                    >
                        Upgrade to Premium
                    </Button>
                )}
            </div>
        </div>
    );
}
