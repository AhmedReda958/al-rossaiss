"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import { PlusIcon } from "lucide-react";

const Header = () => {
  const handleAddCity = () => {
    // Handle add city action
    console.log("Add city clicked");
  };

  return (
    <PageHeader
      title="Cities"
      breadcrumbs={[
        { label: "All Cities", href: "/" },
        { label: "Add city", isCurrentPage: true },
      ]}
      action={{
        label: "Add City",
        icon: PlusIcon,
        onClick: handleAddCity,
      }}
    />
  );
};

export default Header;
