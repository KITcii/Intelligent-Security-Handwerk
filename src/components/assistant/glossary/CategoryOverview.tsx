import CategoryTile from "./CategoryTile";
import { getAllCategories } from "@/lib/api/glossary.api";

const CategoryOverview = async () => {
  const categories = await getAllCategories();

  if (!categories) {
    return (
      <div className="w-full text-center italic">
        Es wurden keine Wissenskategorien gefunden.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Topic Overview */}
      <div className="flex flex-row flex-wrap gap-5">
        {categories?.map((category) => {
          return (
            <CategoryTile category={category} key={`cat_tile_${category.id}`} />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryOverview;
