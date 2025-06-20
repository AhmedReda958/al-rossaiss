"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import { PlusIcon } from "lucide-react";

const Header = () => {
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
        href: "/dashboard/cities/add",
      }}
    />
  );
};

export default Header;
