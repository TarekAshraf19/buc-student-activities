"use client";

import {
  useEffect,
  useState,
} from "react";

import type { College } from "@/types/college";

import type {
  CollegePlanItem,
  CollegePlanSemester,
} from "@/types/college-plan";

import {
  updateCollegePlan,
  deleteCollegePlan,
} from "@/services/college.service";

import {
  uploadCollegePlan,
} from "@/services/storage.service";

import {
  deleteStructuredCollegePlan,
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

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    if (!college) {
      return;
    }

    setPlanName(
      college.planName || ""
    );

    setPlanUrl(
      college.planUrl || ""
    );

    setFile(null);

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

        if (!structuredPlan) {
          setAcademicYear("");
          setSemester("first");
          setItems([
            createEmptyItem(),
          ]);

          return;
        }

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
    setItems((currentItems) => [
      ...currentItems,
      createEmptyItem(),
    ]);
  };

  const removeItem = (
    itemId: string
  ) => {
    setItems((currentItems) => {
      const nextItems =
        currentItems.filter(
          (item) =>
            item.id !== itemId
        );

      return nextItems.length > 0
        ? nextItems
        : [createEmptyItem()];
    });
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
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== itemId) {
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
              plannedDate: value,
            };

          default:
            return item;
        }
      })
    );
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

      const cleanedItems =
        items.map((item) => ({
          ...item,

          title: {
            en: item.title.en.trim(),
            ar: item.title.ar.trim(),
          },

          category: {
            en: item.category.en.trim(),
            ar: item.category.ar.trim(),
          },

          plannedDate:
            item.plannedDate.trim(),
        }));

      await Promise.all([
        updateCollegePlan(
          college.id,
          planName.trim(),
          newPlanUrl
        ),

        saveStructuredCollegePlan({
          collegeId: college.id,
          academicYear:
            academicYear.trim(),
          semester,
          items: cleanedItems,
        }),
      ]);

      setPlanName(
        planName.trim()
      );

      setPlanUrl(
        newPlanUrl
      );

      setItems(
        cleanedItems
      );

      setFile(null);

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

  const removePlan = async () => {
    if (!college) {
      return false;
    }

    try {
      setDeleting(true);

      await Promise.all([
        deleteCollegePlan(
          college.id
        ),

        deleteStructuredCollegePlan(
          college.id
        ),
      ]);

      setPlanName("");
      setPlanUrl("");
      setAcademicYear("");
      setSemester("first");
      setItems([
        createEmptyItem(),
      ]);

      setFile(null);

      return true;
    } catch (error) {
      console.error(
        "Error deleting college plan:",
        error
      );

      return false;
    } finally {
      setDeleting(false);
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
    deleting,

    changePlanName,
    changeAcademicYear,
    changeSemester,

    selectFile,
    clearFile,

    addItem,
    removeItem,
    updateItem,

    savePlan,
    removePlan,
  };
}