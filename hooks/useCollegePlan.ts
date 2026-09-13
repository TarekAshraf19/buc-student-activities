"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { College } from "@/types/college";

import type {
  CollegePlanItem,
  CollegePlanSemester,
} from "@/types/college-plan";

import {
  updateCollegePlan,
} from "@/services/college.service";

import {
  uploadCollegePlan,
} from "@/services/storage.service";

import {
  getStructuredCollegePlan,
  saveStructuredCollegePlan,
} from "@/services/college-plan.service";

function createEmptyItem(): CollegePlanItem {
  return {
    id: crypto.randomUUID(),

    title: {
      en: "",
      ar: "",
    },

    category: {
      en: "",
      ar: "",
    },

    plannedDate: "",

    status: "planned",
  };
}

function getNextSemester(
  currentSemester: CollegePlanSemester
): CollegePlanSemester {
  switch (currentSemester) {
    case "first":
      return "second";

    case "second":
      return "summer";

    case "summer":
      return "first";

    default:
      return "first";
  }
}

export function useCollegePlan(
  college: College | null
) {
  const [planName, setPlanName] =
    useState("");

  const [planUrl, setPlanUrl] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  const [academicYear, setAcademicYear] =
    useState("");

  const [semester, setSemester] =
    useState<CollegePlanSemester>("first");

  const [items, setItems] =
    useState<CollegePlanItem[]>([
      createEmptyItem(),
    ]);

  const [loadingPlan, setLoadingPlan] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [
    hasCurrentPlan,
    setHasCurrentPlan,
  ] = useState(false);

  const [
    isStartingNewPlan,
    setIsStartingNewPlan,
  ] = useState(false);

  const savedPlanNameRef =
    useRef("");

  const savedPlanUrlRef =
    useRef("");

  const savedAcademicYearRef =
    useRef("");

  const savedSemesterRef =
    useRef<CollegePlanSemester>(
      "first"
    );

  useEffect(() => {
    if (!college) {
      return;
    }

    let cancelled = false;

    async function loadStructuredPlan() {
      try {
        setLoadingPlan(true);

        const structuredPlan =
          await getStructuredCollegePlan(
            college!.id
          );

        if (cancelled) {
          return;
        }

        const currentPlanName =
          college!.planName || "";

        const currentPlanUrl =
          college!.planUrl || "";

        savedPlanNameRef.current =
          currentPlanName;

        savedPlanUrlRef.current =
          currentPlanUrl;

        setPlanName(
          currentPlanName
        );

        setPlanUrl(
          currentPlanUrl
        );

        setFile(null);

        setIsStartingNewPlan(false);

        if (!structuredPlan) {
          setAcademicYear("");
          setSemester("first");

          setItems([
            createEmptyItem(),
          ]);

          setHasCurrentPlan(
            Boolean(
              currentPlanUrl
            )
          );

          return;
        }

        savedAcademicYearRef.current =
          structuredPlan.academicYear;

        savedSemesterRef.current =
          structuredPlan.semester;

        setAcademicYear(
          structuredPlan.academicYear
        );

        setSemester(
          structuredPlan.semester
        );

        setItems(
          structuredPlan.items.length > 0
            ? structuredPlan.items
            : [createEmptyItem()]
        );

        setHasCurrentPlan(true);
      } catch (error) {
        console.error(
          "Error loading structured college plan:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingPlan(false);
        }
      }
    }

    loadStructuredPlan();

    return () => {
      cancelled = true;
    };
  }, [college]);

  const changePlanName = (
    value: string
  ) => {
    setPlanName(value);
  };

  const changeAcademicYear = (
    value: string
  ) => {
    setAcademicYear(value);
  };

  const changeSemester = (
    value: CollegePlanSemester
  ) => {
    setSemester(value);
  };

  const selectFile = (
    selectedFile: File
  ) => {
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
  };

  const addItem = () => {
    setItems(
      (
        currentItems
      ) => [
        ...currentItems,
        createEmptyItem(),
      ]
    );
  };

  const removeItem = (
    itemId: string
  ) => {
    setItems(
      (
        currentItems
      ) => {
        const nextItems =
          currentItems.filter(
            (
              item: CollegePlanItem
            ) =>
              item.id !== itemId
          );

        return nextItems.length > 0
          ? nextItems
          : [createEmptyItem()];
      }
    );
  };

  const updateItem = (
    itemId: string,
    field:
      | "titleEn"
      | "titleAr"
      | "categoryEn"
      | "categoryAr"
      | "plannedDate",
    value: string
  ) => {
    setItems(
      (
        currentItems
      ) =>
        currentItems.map(
          (
            item: CollegePlanItem
          ) => {
            if (
              item.id !== itemId
            ) {
              return item;
            }

            switch (field) {
              case "titleEn":
                return {
                  ...item,

                  title: {
                    ...item.title,
                    en: value,
                  },
                };

              case "titleAr":
                return {
                  ...item,

                  title: {
                    ...item.title,
                    ar: value,
                  },
                };

              case "categoryEn":
                return {
                  ...item,

                  category: {
                    ...item.category,
                    en: value,
                  },
                };

              case "categoryAr":
                return {
                  ...item,

                  category: {
                    ...item.category,
                    ar: value,
                  },
                };

              case "plannedDate":
                return {
                  ...item,
                  plannedDate:
                    value,
                };

              default:
                return item;
            }
          }
        )
    );
  };

  const startNewPlan = () => {
    if (!hasCurrentPlan) {
      return;
    }

    const nextSemester =
      getNextSemester(
        savedSemesterRef.current
      );

    setPlanName("");
    setPlanUrl("");
    setFile(null);

    setAcademicYear(
      savedAcademicYearRef.current
    );

    setSemester(
      nextSemester
    );

    setItems([
      createEmptyItem(),
    ]);

    setIsStartingNewPlan(true);
  };

const cancelNewPlan = () => {
  setPlanName(
    savedPlanNameRef.current
  );

  setPlanUrl(
    savedPlanUrlRef.current
  );

  setFile(null);

  setAcademicYear(
    savedAcademicYearRef.current
  );

  setSemester(
    savedSemesterRef.current
  );

  setIsStartingNewPlan(false);

  if (!college) {
    return;
  }

  const collegeId = college.id;

  async function restoreItems() {
    try {
      const structuredPlan =
        await getStructuredCollegePlan(
          collegeId
        );

      if (!structuredPlan) {
        setItems([
          createEmptyItem(),
        ]);

        return;
      }

      setItems(
        structuredPlan.items.length > 0
          ? structuredPlan.items
          : [createEmptyItem()]
      );
    } catch (error) {
      console.error(
        "Error restoring college plan:",
        error
      );
    }
  }

  restoreItems();
};

  const savePlan = async () => {
    if (!college) {
      return false;
    }

    try {
      setSaving(true);

      let newPlanUrl =
        planUrl;

      if (file) {
        newPlanUrl =
          await uploadCollegePlan(
            file,
            college.id
          );
      }

      if (!newPlanUrl) {
        return false;
      }

      const cleanedPlanName =
        planName.trim();

      const cleanedAcademicYear =
        academicYear.trim();

      const cleanedItems =
        items.map(
          (
            item: CollegePlanItem
          ) => ({
            ...item,

            title: {
              en:
                item.title.en.trim(),

              ar:
                item.title.ar.trim(),
            },

            category: {
              en:
                item.category.en.trim(),

              ar:
                item.category.ar.trim(),
            },

            plannedDate:
              item.plannedDate.trim(),
          })
        );

      await saveStructuredCollegePlan(
        {
          collegeId:
            college.id,

          academicYear:
            cleanedAcademicYear,

          semester,

          items:
            cleanedItems,
        },

        savedPlanNameRef.current,

        savedPlanUrlRef.current
      );

      await updateCollegePlan(
        college.id,
        cleanedPlanName,
        newPlanUrl
      );

      setPlanName(
        cleanedPlanName
      );

      setPlanUrl(
        newPlanUrl
      );

      setAcademicYear(
        cleanedAcademicYear
      );

      setItems(
        cleanedItems
      );

      setFile(null);

      savedPlanNameRef.current =
        cleanedPlanName;

      savedPlanUrlRef.current =
        newPlanUrl;

      savedAcademicYearRef.current =
        cleanedAcademicYear;

      savedSemesterRef.current =
        semester;

      setHasCurrentPlan(true);

      setIsStartingNewPlan(false);

      return true;
    } catch (error) {
      console.error(
        "Error saving college plan:",
        error
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    planName,
    planUrl,
    file,

    academicYear,
    semester,
    items,

    loadingPlan,
    saving,

    hasCurrentPlan,
    isStartingNewPlan,

    changePlanName,
    changeAcademicYear,
    changeSemester,

    selectFile,
    clearFile,

    addItem,
    removeItem,
    updateItem,

    startNewPlan,
    cancelNewPlan,
    savePlan,
  };
}