import { Hero } from "@/components/sections/Hero";
import { FeaturedPosts } from "@/components/sections/FeaturedPosts";
import { AsciiDivider } from "@/components/animations/AsciiDivider";
import { AboutMe } from "@/components/sections/AboutMe";
import { Connect } from "@/components/sections/Connect";
import { FilmGrain } from "@/components/ui/FilmGrain";

export default function Home() {
  return (
    <>
      <FilmGrain />
      <Hero />
      <AsciiDivider />
      <FeaturedPosts />
      <AboutMe />
      <Connect />
    </>
  );
}
