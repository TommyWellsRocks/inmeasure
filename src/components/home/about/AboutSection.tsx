import { AboutItem } from "./AboutItem";

export function AboutSection() {
  return (
    <section className="flex flex-col gap-y-2">
      <AboutItem name="Simple" tagline="Less is more, so much more.">
        <span>
          Complex sucks. We like great. And great is usually very very simple.
        </span>
        <span>
          If something's not simple enough, send us an email. We'll get to work.
        </span>
      </AboutItem>

      <AboutItem
        name="In-Depth"
        tagline="Quality without an excuse of quantity."
      >
        <span>
          At the end of the day, we're only here to maximize the user
          experience.
        </span>
        <span>
          Get real data, in real time, to make a real impact, for the betterment
          of your users.
        </span>
      </AboutItem>

      <AboutItem name="Secure" tagline="Trust is hard gained and easily lost.">
        <span>
          And with a data/analytics company like InMeasure -- it's everything.
        </span>
        <span>
          Respect your user's data and work in compliance with the highest
          privacy standards.
        </span>
      </AboutItem>
    </section>
  );
}
