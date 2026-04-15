import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel"

export default function HowItWorks() {
    const datas = [
        {id: 1, title: 'Search & Discover', desc: 'Browse properties by location, price, and features. Schedule virtual or physical inspections.'},
        {id: 2, title: 'Choose Your Plan', desc: 'Select from flexible payment options that fit your budget - full rent, rent-to-own, or installments.'},
        {id: 3, title: 'Move In & Manage', desc: 'Complete secure payments, access property management tools, and connect with service providers'},
    ]

    return (
        <section className="w-full flex flex-col items-center mt-16 gap-4 px-5">
            <h2 className="text-3xl text-center lg:text-4xl text-gray-900">How Conekta Works</h2>
            <p>Simple, transparent, and designed for you</p>

            <div className="w-full lg:flex-row justify-between lg:justify-evenly mt-8 hidden lg:flex">
                {datas.map((data) => (
                    <div key={data.id} className="flex flex-col items-center gap-3">
                        <p className="w-9 lg:w-15 h-9 lg:h-15 flex items-center 
                        justify-center rounded-full bg-tertiary-green text-white 
                        font-800 text-2xl">
                            {data.id}
                        </p>
                        <h3 className="text-lg text-center lg:text-xl">{data.title}</h3>
                        <p className="text-center text-sm lg:text-base">{data.desc}</p>
                    </div>
                ))}
            </div>

            <div className="w-full flex lg:hidden mt-10">
                <Carousel>
                    <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-5 z-10 bg-white p-2 rounded-full shadow-md"/>
                    <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-5 z-10 bg-white p-2 rounded-full shadow-md"/>
                <CarouselContent className=" cursor-pointer">
                 {datas.map((data) => (
                    <CarouselItem  key={data.id} className="flex flex-col items-center gap-3">
                        <p className="w-9 lg:w-15 h-9 lg:h-15 flex items-center 
                        justify-center rounded-full bg-tertiary-green text-white 
                        font-800 text-2xl">
                            {data.id}
                        </p>
                        <h3 className="text-lg text-center lg:text-xl">{data.title}</h3>
                        <p className="text-center text-sm lg:text-base">{data.desc}</p>
                    </CarouselItem>
                 ))}
                </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}