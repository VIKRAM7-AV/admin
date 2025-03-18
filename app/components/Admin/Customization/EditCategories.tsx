import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

const DEFAULT_CATEGORIES = [
  { _id: "1", title: "Development" },
  { _id: "2", title: "Mechine Learning" },
  { _id: "3", title: "artificial intelligence" },
  { _id: "4", title: "IoT" },
  { _id: "5", title: "Business" },
  { _id: "6", title: "Yoga" },
];

const EditCategories = () => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [categories, setCategories] = useState<any>(DEFAULT_CATEGORIES);

  useEffect(() => {
    if (data?.layout?.categories) {
      console.log("Fetched categories:", data.layout.categories);
      setCategories(data.layout.categories);
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }
    if (layoutSuccess) {
      refetch();
      toast.success("Categories updated successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error, refetch]);

  const handleCategoriesAdd = (id: string, value: string) => {
    setCategories((prevCategory: any[]) =>
      prevCategory.map((i) =>
        i._id === id ? { ...i, title: value } : i
      )
    );
  };

  const newCategoriesHandler = () => {
    if (categories[categories.length - 1]?.title === "") {
      toast.error("Category title cannot be empty");
    } else {
      setCategories((prevCategory: any) => [
        ...prevCategory,
        { _id: `${Date.now()}`, title: "" },
      ]);
    }
  };


  const areCategoriesUnchanged = (
    originalCategories: any[],
    newCategories: any[]
  ) => JSON.stringify(originalCategories) === JSON.stringify(newCategories);


  const isAnyCategoryTitleEmpty = (categories: any[]) =>
    categories.some((q) => q.title === "");

  // ✅ Save edited categories
  const editCategoriesHandler = async () => {
    if (
      !areCategoriesUnchanged(data?.layout?.categories || DEFAULT_CATEGORIES, categories) &&
      !isAnyCategoryTitleEmpty(categories)
    ) {
      await editLayout({
        type: "categories",
        categories,
      });
    }
  };

  const resetToDefaultCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
  };


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          {categories &&
            categories.map((item: any, index: number) => {
              return (
                <div className="p-3" key={index}>
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoriesAdd(item._id, e.target.value)
                      }
                      placeholder="Enter category title..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setCategories((prevCategory: any) =>
                          prevCategory.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCategoriesHandler}
            />
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <div
              className={`${styles.button}
                !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
                ${
                  areCategoriesUnchanged(data?.layout?.categories || DEFAULT_CATEGORIES, categories) ||
                  isAnyCategoryTitleEmpty(categories)
                    ? "!cursor-not-allowed"
                    : "!cursor-pointer !bg-[#42d383]"
                }
                !rounded`}
              onClick={
                areCategoriesUnchanged(data?.layout?.categories || DEFAULT_CATEGORIES, categories) ||
                isAnyCategoryTitleEmpty(categories)
                  ? undefined
                  : editCategoriesHandler
              }
            >
              Save
            </div>
            <div
              className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] bg-red-500 
                !rounded !cursor-pointer text-white`}
              onClick={resetToDefaultCategories}
            >
              Reset
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;
