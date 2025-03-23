interface representativesProps {
  src: string
  name: string
  followers: string
}

const representatives: representativesProps[] = [
  { src: "assets/representative1.png", name: "Representative 1", followers: "1.5M" },
  { src: "assets/representative2.png", name: "Representative 2", followers: "1.5M" },
  { src: "assets/representative3.png", name: "Representative 3", followers: "1.5M" },
  { src: "assets/representative4.png", name: "Representative 4", followers: "1.5M" },
  { src: "assets/representative5.png", name: "Representative 5", followers: "1.5M" },
  { src: "assets/representative6.png", name: "Representative 6", followers: "1.5M" },
  { src: "assets/representative7.png", name: "Representative 7", followers: "1.5M" },
  { src: "assets/representative8.png", name: "Representative 8", followers: "1.5M" },
]

interface sponsorsProps {
  src: string
  alt: string
}

const sponsors: sponsorsProps[] = [
  { src: "assets/manna.svg", alt: "Manna Logo" },
  { src: "assets/visa.svg", alt: "Visa Logo" },
  { src: "assets/stich.svg", alt: "Stich Logo" },
  { src: "assets/open_ai.svg", alt: "OpenAI Logo" },
  { src: "assets/meili.svg", alt: "Meili Logo" },
  { src: "assets/ultra.svg", alt: "Ultra Logo" },
  { src: "assets/identity.svg", alt: "Identity Logo" },
  { src: "assets/unban.svg", alt: "Unban Logo" },
]

const Credentials = () => {
  
  return (
    <div className="text-xl mt-44 self-center flex flex-col justify-center items-center">
      <div>Used by 10 million creators and businesses</div>
      <div className="flex flex-wrap items-center justify-center gap-5 mt-5">
        {sponsors.map((sponsor) => {
          return (
            <img src={sponsor.src} alt={sponsor.alt} className="w-[100px] h-[100px] mx-5" />
          )
        })}
      </div>

      <div className="text-xl mt-10">Trusted by top representatives</div>
      <div className="flex flex-wrap items-center justify-center gap-5 mt-16">
        {representatives.map((representative) => {
          return (
            <div className="flex flex-col flex-wrap items-center px-5">
              <img src={representative.src} alt={representative.name} className="w-[100px] h-[100px]" />
              <div className="mt-3 text-sm">{representative.name}</div>
              <div className="text-sm">{representative.followers} Followers</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Credentials;