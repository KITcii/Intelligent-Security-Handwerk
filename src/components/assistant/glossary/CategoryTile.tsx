import Link from "next/link";
import BackgroundPanelWithHero from "../shared/BackgroundPanelWithHero";
import { GlossaryCategory } from "@/types/assistant";

const CategoryTile = ({ category }: { category: GlossaryCategory }) => {
  return (
    <BackgroundPanelWithHero
      className="max-w-[400px] w-[300px] max-sm:w-[250px]"
      title={category.name}
      heroImg={`/assets/images/glossary/hero/${category.imageSrc || "default.svg"}`}
      url={`/assistant/glossary/details/cat/${category.id}`}
    >
      <Link href={`/assistant/glossary/details/cat/${category.id}`}>
        {category.description}
      </Link>
    </BackgroundPanelWithHero>
  );
};

export default CategoryTile;
