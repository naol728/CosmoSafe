'use client';
import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';

import {
    Ripple,
    AuthTabs,
    TechOrbitDisplay,
} from '@/components/modern-animated-sign-in';
import Image from 'next/image';

type FormData = {
    email: string;
    password: string;
};

interface OrbitIcon {
    component: () => ReactNode;
    className: string;
    duration?: number;
    delay?: number;
    radius?: number;
    path?: boolean;
    reverse?: boolean;
}

const iconsArray: OrbitIcon[] = [
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/mercury.jpg'
                alt='mercury'
            />
        ),
        className: 'size-[30px] border-none bg-transparent',
        duration: 20,
        delay: 20,
        radius: 100,
        path: false,
        reverse: false,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/earth.jpg'
                alt='CSS3'
            />
        ),
        className: 'size-[30px] border-none bg-transparent',
        duration: 20,
        delay: 10,
        radius: 100,
        path: false,
        reverse: false,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/mercury.jpg'
                alt='TypeScript'
            />
        ),
        className: 'size-[50px] border-none bg-transparent',
        radius: 210,
        duration: 20,
        path: false,
        reverse: false,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/mercury.jpg'
                alt='JavaScript'
            />
        ),
        className: 'size-[50px] border-none bg-transparent',
        radius: 210,
        duration: 20,
        delay: 20,
        path: false,
        reverse: false,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/mercury.jpg'
                alt='TailwindCSS'
            />
        ),
        className: 'size-[30px] border-none bg-transparent',
        duration: 20,
        delay: 20,
        radius: 150,
        path: false,
        reverse: true,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/mercury.jpg'
                alt='Nextjs'
            />
        ),
        className: 'size-[30px] border-none bg-transparent',
        duration: 20,
        delay: 10,
        radius: 150,
        path: false,
        reverse: true,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/earth.jpg'
                alt='React'
            />
        ),
        className: 'size-[50px] border-none bg-transparent',
        radius: 270,
        duration: 20,
        path: false,
        reverse: true,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/earth.jpg'
                alt='Figma'
            />
        ),
        className: 'size-[50px] border-none bg-transparent',
        radius: 270,
        duration: 20,
        delay: 60,
        path: false,
        reverse: true,
    },
    {
        component: () => (
            <Image
                width={100}
                height={100}
                src='/earth.jpg'
                alt='Git'
            />
        ),
        className: 'size-[50px] border-none bg-transparent',
        radius: 320,
        duration: 20,
        delay: 20,
        path: false,
        reverse: false,
    },
];

export default function Page() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const goToForgotPassword = (
        event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
        event.preventDefault();
        console.log('forgot password');
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        name: keyof FormData
    ) => {
        const value = event.target.value;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted', formData);
    };

    const formFields = {
        header: 'Welcome back',
        subHeader: 'Sign in to your account',
        fields: [
            {
                label: 'Email',
                required: true,
                type: 'email' as 'email',
                placeholder: 'Enter your email address',
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(event, 'email'),
            },
            {
                label: 'Password',
                required: true,
                type: 'password' as 'password',
                placeholder: 'Enter your password',
                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(event, 'password'),
            },
        ],
        submitButton: 'Sign in',
        textVariantButton: 'Forgot password?',
    };

    return (
        <section className='flex max-lg:justify-center'>
            {/* Left Side */}
            <span className='flex flex-col justify-center w-1/2 max-lg:hidden'>
                <Ripple mainCircleSize={100} />
                <TechOrbitDisplay iconsArray={iconsArray} />
            </span>

            {/* Right Side */}
            <span className='w-1/2 h-[100dvh] flex flex-col justify-center items-center max-lg:w-full max-lg:px-[10%]'>
                <AuthTabs
                    formFields={formFields}
                    goTo={goToForgotPassword}
                    handleSubmit={handleSubmit}
                />
            </span>
        </section>
    );
}
