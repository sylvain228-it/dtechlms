import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';

const carouselItems = [
    {
        title: 'Bienvenue sur Dtech Learning',
        description:
            'La plateforme de formation en ligne pour les professionnels de la tech.',
        bg_url: '/assets/banner/bg1.png',
    },
    {
        title: 'Des cours de qualité',
        description:
            "Accédez à des cours créés par des experts de l'industrie.",
        bg_url: '/assets/banner/bg2.png',
    },
    {
        title: 'Apprenez à votre rythme',
        description:
            'Suivez les cours quand vous le souhaitez, où que vous soyez.',
        bg_url: '/assets/banner/bg3.png',
    },
];
export default function HomeCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true }),
    );
    return (
        <Carousel
            className="w-full p-0"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="h-[calc(100vh-200px)] w-full">
                {carouselItems.map((item, index) => (
                    <CarouselItem
                        key={index}
                        className="relative flex h-full w-full items-center justify-center bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.bg_url})` }}
                    >
                        <div className="absolute inset-0 bg-black/50"></div>
                        <div className="relative z-10 max-w-2xl text-center text-white">
                            <h2 className="mb-4 text-4xl font-bold">
                                {item.title}
                            </h2>
                            <p className="text-lg">{item.description}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
